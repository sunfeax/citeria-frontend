import { getRegisterPayload } from './../../../../shared/util/payload-handler';
import { eUserType } from '../../models/user-type';
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
import { icons } from '../../../../shared/util/icons';
import { routes } from '../../../../shared/util/routes';
import { tRegisterServerErrors } from '../../models/register';
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
  private toastSE = inject(ToastService);
  private router = inject(Router);

  /** ENUMS */
  readonly UserType = eUserType;

  /** ICONS */
  readonly icons = icons;

  /** ROUTES */
  readonly routes = routes;

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
      this.toastSE.warning('Please fill in all required fields correctly.', 'Registration failed');
      return;
    }

    this.isLoading.set(true);
    this.authSE
      .register(getRegisterPayload(this.registerForm.getRawValue()))
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
          this.toastSE.success('You have signed up successfully.', 'Welcome!');
          this.router.navigateByUrl(routes.login);
        },
        error: (err: HttpErrorResponse) => {
          if (err.error.errors) {
            this.serverErrors.set(err.error.errors);
          } else {
            this.toastSE.error(err.error.detail ?? 'Registration failed', 'Error');
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
}
