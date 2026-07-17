import { finalize } from 'rxjs';
import {
  getChangePasswordPayload,
  getUserUpdatePayload,
} from './../../../../shared/util/payload-handler';
import { iUser } from './../../../auth/models/user';
import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators as v } from '@angular/forms';
import { SessionService } from '../../../auth/services/session.service';
import { ProfileService } from '../../services/profile.service';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { HttpErrorResponse } from '@angular/common/http';
import { LucideAngularModule } from 'lucide-angular';
import { ToastService } from '../../../../shared/services/toast.service';
import { icons } from '../../../../shared/util/icons';
import { FieldErrorComponent } from '../../../../shared/components/field-error/field-error.component';
import { tUserUpdateServerErrors } from '../../models/user-update-request';
import { tChangePasswordServerErrors } from '../../models/user-change-password';

@Component({
  selector: 'app-profile',
  imports: [ReactiveFormsModule, ButtonComponent, LucideAngularModule, FieldErrorComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  /** INJECTORS */
  private readonly sessionSE = inject(SessionService);
  private readonly profileSE = inject(ProfileService);
  private readonly toastSE = inject(ToastService);

  /** ICONS */
  readonly icons = icons;

  /** DATA */
  user: iUser = this.sessionSE.requireUser();

  /** STATE */
  isProfileLoading = signal<boolean>(false);
  isPasswordLoading = signal<boolean>(false);
  userUpdateServerErrors = signal<tUserUpdateServerErrors>({});
  passwordChangeServerErrors = signal<tChangePasswordServerErrors>({});

  /** FORM */
  profileForm = new FormGroup({
    firstName: new FormControl(this.user.firstName, {
      nonNullable: true,
      validators: [
        v.required,
        v.minLength(2),
        v.maxLength(50),
        v.pattern(/^[\p{L}]+(?:[\s'-][\p{L}]+)*$/u),
      ],
    }),
    lastName: new FormControl(this.user.lastName, {
      nonNullable: true,
      validators: [
        v.required,
        v.minLength(2),
        v.maxLength(50),
        v.pattern(/^[\p{L}]+(?:[\s'-][\p{L}]+)*$/u),
      ],
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
      validators: [
        v.required,
        v.minLength(8),
        v.pattern(/^(?=.*[A-Z])(?=.*[@#$%^&+=!])[A-Za-z0-9@#$%^&+=!]+$/),
      ],
    }),
  });

  /** ACTIONS */
  submitProfileForm(): void {
    this.userUpdateServerErrors.set({});

    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      this.toastSE.warning('Please fill in all required fields correctly.', 'Update failed');
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
        next: (user) => {
          this.sessionSE.setUser(user);
          this.toastSE.success('The information has been successfully updated', 'Update!');
          this.profileForm.markAsPristine();
        },
        error: (err: HttpErrorResponse) => {
          if (err.error.errors) {
            this.userUpdateServerErrors.set(err.error.errors);
          } else {
            this.toastSE.error('Update failed', 'Error');
          }
        },
      });
  }
  submitPasswordForm(): void {
    this.passwordChangeServerErrors.set({});

    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      this.toastSE.warning(
        'Please fill in all required fields correctly.',
        'Password update failed',
      );
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
          this.toastSE.success('The password has been successfully updated', 'Update!');
          this.passwordForm.reset();
        },
        error: (err: HttpErrorResponse) => {
          if (err.error.errors) {
            this.passwordChangeServerErrors.set(err.error.errors);
          } else {
            this.toastSE.error('Passsword update failed', 'Error');
          }
        },
      });
  }
}
