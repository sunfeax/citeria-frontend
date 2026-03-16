import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators as v } from '@angular/forms';
import { LucideAngularModule, ZapIcon, EyeIcon, EyeOff } from 'lucide-angular';
import { finalize } from 'rxjs';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { ILoginRequest } from '../../models/login.interface';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, ButtonComponent, LucideAngularModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {

  private authService = inject(AuthService);
  private router = inject(Router);

  readonly ZapIcon = ZapIcon;
  readonly EyeIcon = EyeIcon;
  readonly EyeOff = EyeOff;
  
  isLoading = signal<boolean>(false);  
  isPasswordVisible = signal<boolean>(true);

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
    this.isLoading.set(true);
    this.isPasswordVisible.set(true);

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.isLoading.set(false);
      return;
    }

    const payload: ILoginRequest = this.loginForm.getRawValue();

    this.authService.login(payload)
      .pipe(
        finalize(() => {
          this.isLoading.set(false);
        })
      )
      .subscribe({
        next: (response) => {
          console.log('Login success', response);
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          console.error('Login failed', err);
        },
      });

  }
}
