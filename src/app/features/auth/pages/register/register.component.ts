import { UserType } from './../../../../core/enums/userType';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators as v, ValidationErrors, ValidatorFn } from '@angular/forms';
import { LucideAngularModule, ZapIcon, EyeIcon, EyeOff } from 'lucide-angular';
import { finalize } from 'rxjs';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { ToastService } from '../../../../shared/services/toast.service';
import { IRegisterRequest } from '../../models/register.interface';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, ButtonComponent, LucideAngularModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {

  private authService = inject(AuthService);
  private router = inject(Router);
  private toast = inject(ToastService);
  
  readonly UserType = UserType;
  readonly userTypeOptionClass =
    'flex h-12 items-center justify-center rounded-2xl border border-slate-300 bg-white ' +
    'text-sm font-semibold text-slate-700 transition-colors ' +
    'peer-checked:border-2 peer-checked:border-blue-500 ' +
    'peer-checked:bg-blue-50 peer-checked:text-blue-700';

  readonly ZapIcon = ZapIcon;
  readonly EyeIcon = EyeIcon;
  readonly EyeOff = EyeOff;
  
  isSubmitted = signal<boolean>(false);
  isLoading = signal<boolean>(false);
  isPasswordVisible = signal<boolean>(true);
  isConfirmPasswordVisible = signal<boolean>(true);

  registerForm = new FormGroup({
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
      nonNullable: false,
      validators: [
        v.minLength(7),
        v.maxLength(20),
        v.pattern(/^\d+$/),
      ],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [v.required],
    }),
    confirmPassword: new FormControl('', {
      nonNullable: true,
      validators: [v.required],
    }),
    type: new FormControl(UserType.CLIENT, {
      nonNullable: true,
      validators: [v.required],
    }),
  }, {
    validators: [this.passwordValidator()]
  });

  onSubmit() {
    this.isPasswordVisible.set(true);
    this.isConfirmPasswordVisible.set(true);
    this.isSubmitted.set(true);

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      this.toast.warning('Please fill in all required fields correctly.', 'Validation error');
      return;
    }

    this.isLoading.set(true);

    const payload: IRegisterRequest = this.registerForm.getRawValue();

    this.authService.register(payload)
      .pipe(
        finalize(() => {
          this.isLoading.set(false);
        })
      )
      .subscribe({
        next: () => {
          this.toast.success('You have signed up successfully.', 'Welcome!');
          this.router.navigateByUrl('/');
        },
        error: (err: HttpErrorResponse) => {
          if (err.status === 400) {
            this.toast.error('Please check that the fields are filled in correctly.', 'Registration failed');
          }
        },
      });
  }

  passwordValidator(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const { password, confirmPassword } = group.value;

      if (!password || !confirmPassword) return null;

      return password === confirmPassword ? null : { passwordMismatch: true };
    };
  }
}
