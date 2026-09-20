import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators as v } from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatError, MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { finalize } from 'rxjs';
import { iApiError } from '../../../../shared/models/api-error';
import { ToastService } from '../../../../shared/services/toast.service';
import { applyServerErrors, clearServerErrors, getFieldError } from '../../../../shared/util/form-errors';
import { SessionService } from '../../../auth/services/session.service';
import { ProfileService } from '../../services/profile.service';
import { getChangePasswordPayload, getUserUpdatePayload } from './../../../../shared/util/payload-handler';
import { iUser } from './../../../auth/models/user';

@Component({
  selector: 'app-profile',
  imports: [
    ReactiveFormsModule,
    MatButton,
    MatIconButton,
    MatFormField,
    MatLabel,
    MatError,
    MatSuffix,
    MatInput,
    MatIcon,
    MatProgressSpinner,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  /** INJECTORS */
  private readonly sessionSE = inject(SessionService);
  private readonly profileSE = inject(ProfileService);
  private readonly toastSE = inject(ToastService);

  /** TEMPLATE HELPERS */
  readonly getFieldError = getFieldError;

  /** DATA */
  user: iUser = this.sessionSE.requireUser();

  /** STATE */
  isProfileLoading = signal<boolean>(false);
  isPasswordLoading = signal<boolean>(false);
  isCurrentPasswordVisible = signal<boolean>(false);
  isNewPasswordVisible = signal<boolean>(false);

  /** FORM */
  profileForm = new FormGroup({
    firstName: new FormControl(this.user.firstName, {
      nonNullable: true,
      validators: [v.required, v.minLength(2), v.maxLength(50), v.pattern(/^[\p{L}]+(?:[\s'-][\p{L}]+)*$/u)],
    }),
    lastName: new FormControl(this.user.lastName, {
      nonNullable: true,
      validators: [v.required, v.minLength(2), v.maxLength(50), v.pattern(/^[\p{L}]+(?:[\s'-][\p{L}]+)*$/u)],
    }),
    email: new FormControl(this.user.email, {
      nonNullable: true,
      validators: [v.required, v.email],
    }),
    phone: new FormControl(this.user.phone, {
      nonNullable: true,
      validators: [v.required, v.minLength(7), v.maxLength(20), v.pattern(/^\+?\d+$/)],
    }),
  });
  passwordForm = new FormGroup({
    currentPassword: new FormControl('', {
      nonNullable: true,
      validators: [v.required],
    }),
    newPassword: new FormControl('', {
      nonNullable: true,
      validators: [v.required, v.minLength(8), v.pattern(/^(?=.*[A-Z])(?=.*[@#$%^&+=!])[A-Za-z0-9@#$%^&+=!]+$/)],
    }),
  });

  /** ACTIONS */
  submitProfileForm(): void {
    clearServerErrors(this.profileForm);

    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.isProfileLoading.set(true);
    this.profileSE
      .update(this.user.id, getUserUpdatePayload(this.profileForm.getRawValue()))
      .pipe(
        finalize(() => {
          this.isProfileLoading.set(false);
        }),
      )
      .subscribe({
        next: user => {
          this.sessionSE.setUser(user);
          this.toastSE.success('Your information has been updated.');
          this.profileForm.markAsPristine();
        },
        error: (err: HttpErrorResponse) => {
          const apiError = err.error as iApiError;
          if (apiError.errors) {
            applyServerErrors(this.profileForm, apiError.errors);
          } else {
            this.toastSE.error(apiError.detail ?? 'Update failed.');
          }
        },
      });
  }
  submitPasswordForm(): void {
    clearServerErrors(this.passwordForm);

    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    this.isPasswordLoading.set(true);
    this.profileSE
      .changePassword(this.user.id, getChangePasswordPayload(this.passwordForm.getRawValue()))
      .pipe(
        finalize(() => {
          this.isPasswordLoading.set(false);
        }),
      )
      .subscribe({
        next: () => {
          this.toastSE.success('Your password has been updated.');
          this.passwordForm.reset();
        },
        error: (err: HttpErrorResponse) => {
          const apiError = err.error as iApiError;
          if (apiError.errors) {
            applyServerErrors(this.passwordForm, apiError.errors);
          } else {
            this.toastSE.error(apiError.detail ?? 'Password update failed.');
          }
        },
      });
  }
}
