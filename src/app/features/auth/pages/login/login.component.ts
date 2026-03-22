import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators as v } from '@angular/forms';
import { LucideAngularModule, ZapIcon, EyeIcon, EyeOff } from 'lucide-angular';
import { finalize } from 'rxjs';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { Router, RouterLink } from '@angular/router';
import { ToastService } from '../../../../shared/services/toast.service';
import { AuthApiService } from '../../services/auth-api.service';
import { LoginRequest } from '../../models/login.dto';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, ButtonComponent, LucideAngularModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {

  private authApiService = inject(AuthApiService);
  private router = inject(Router);
  private toast = inject(ToastService);

  readonly ZapIcon = ZapIcon;
  readonly EyeIcon = EyeIcon;
  readonly EyeOff = EyeOff;
  
  isSubmitted = signal<boolean>(false);
  isLoading = signal<boolean>(false);
  isPasswordVisible = signal<boolean>(true);
  serverError = signal<string | null>(null);

  loginForm = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [v.required, v.email],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [v.required],
    }),
  });

  onSubmit() {
    this.isPasswordVisible.set(true);
    this.isSubmitted.set(true);
    this.serverError.set(null);

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.toast.warning('Please fill in all required fields correctly.', 'Sign in failed');
      return;
    }

    this.isLoading.set(true);

    const payload: LoginRequest = this.loginForm.getRawValue();

    this.authApiService.login(payload)
      .pipe(
        finalize(() => {
          this.isLoading.set(false);
        })
      )
      .subscribe({
        next: () => {
          this.serverError.set(null);
          this.toast.success('You have signed in successfully.', 'Welcome back');
          this.router.navigateByUrl('/');
        },
        error: (err: HttpErrorResponse) => {
          if (err.status === 401) {
            this.toast.error('Invalid email or password.');
            return;
          } else {
            this.toast.error('Unable to sign in right now. Please try again.', 'Login failed');
          }
        },
      });
  }
}
