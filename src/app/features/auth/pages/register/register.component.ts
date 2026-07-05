import { eUserType } from '../../models/eUserType';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators as v,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { finalize } from 'rxjs';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { Router, RouterLink } from '@angular/router';
import { ToastService } from '../../../../shared/services/toast.service';
import IconsClass from '../../../../shared/util/icons-class';
import RoutesClass from '../../../../shared/util/routes-class';
import { iRegisterRequest, tRegisterServerErrors } from '../../models/iRegister';
import { FieldErrorComponent } from '../../../../shared/components/field-error/field-error.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  imports: [
    ReactiveFormsModule,
    ButtonComponent,
    LucideAngularModule,
    RouterLink,
    FieldErrorComponent,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  /** INJECTORS */
  private authSE = inject(AuthService);
  private router = inject(Router);
  private toast = inject(ToastService);

  /** ENUMS */
  readonly UserType = eUserType;

  /** ICONS */
  readonly icons = IconsClass;

  /** ROUTES */
  readonly routes = RoutesClass;

  /** STATE */
  isSubmitted = signal<boolean>(false);
  isLoading = signal<boolean>(false);
  isPasswordVisible = signal<boolean>(true);
  isConfirmPasswordVisible = signal<boolean>(true);
  serverErrors = signal<tRegisterServerErrors>({});

  /** FORM */
  registerForm = new FormGroup(
    {
      firstName: new FormControl('', {
        nonNullable: true,
        validators: [
          v.required,
          v.minLength(2),
          v.maxLength(50),
          v.pattern(/^[\p{L}]+(?:[\s'-][\p{L}]+)*$/u),
        ],
      }),
      lastName: new FormControl('', {
        nonNullable: true,
        validators: [
          v.required,
          v.minLength(2),
          v.maxLength(50),
          v.pattern(/^[\p{L}]+(?:[\s'-][\p{L}]+)*$/u),
        ],
      }),
      email: new FormControl('', {
        nonNullable: true,
        validators: [v.required, v.email],
      }),
      phone: new FormControl('', {
        nonNullable: true,
        validators: [v.required, v.minLength(7), v.maxLength(20), v.pattern(/^\+?\d+$/)],
      }),
      password: new FormControl('', {
        nonNullable: true,
        validators: [
          v.required,
          v.minLength(8),
          v.pattern(/^(?=.*[A-Z])(?=.*[@#$%^&+=!])[A-Za-z0-9@#$%^&+=!]+$/),
        ],
      }),
      confirmPassword: new FormControl('', {
        nonNullable: true,
        validators: [v.required],
      }),
      type: new FormControl(eUserType.CLIENT, {
        nonNullable: true,
        validators: [v.required],
      }),
    },
    {
      validators: [this.passwordComparator()],
    },
  );

  /** ACTIONS */
  onSubmit() {
    this.isPasswordVisible.set(true);
    this.isConfirmPasswordVisible.set(true);
    this.isSubmitted.set(true);
    this.serverErrors.set({});

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      this.toast.warning('Please fill in all required fields correctly.', 'Registration failed');
      return;
    }

    this.isLoading.set(true);

    const payload = this.getPayload(this.registerForm.getRawValue());

    this.authSE
      .register(payload)
      .pipe(
        finalize(() => {
          this.isLoading.set(false);
          this.isSubmitted.set(false);
          this.serverErrors.set({});
        }),
      )
      .subscribe({
        next: () => {
          this.serverErrors.set({});
          this.toast.success('You have signed up successfully.', 'Welcome!');
          this.router.navigateByUrl(RoutesClass.login);
        },
        error: (err: HttpErrorResponse) => {
          if (err.error.errors) {
            this.serverErrors.set(err.error.errors);
          } else {
            this.toast.error(err.error.detail ?? 'Registration failed', 'Error');
          }
        },
      });
  }

  /** HELPERS */
  passwordComparator(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const { password, confirmPassword } = group.value;

      if (!password || !confirmPassword) return null;

      return password === confirmPassword ? null : { passwordMismatch: true };
    };
  }

  getPayload(raw: iRegisterRequest) {
    const payload: iRegisterRequest = {
      firstName: raw.firstName.trim(),
      lastName: raw.lastName.trim(),
      email: raw.email.trim(),
      phone: raw.phone.trim(),
      password: raw.password,
      type: raw.type,
    };

    return payload;
  }
}
