import {
  getChangePasswordPayload,
  getUserUpdatePayload,
} from './../../../../shared/util/payload-handler';
import { iUser } from './../../../auth/models/user';
import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SessionService } from '../../../auth/services/session.service';
import { ProfileService } from '../../services/profile.service';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { HttpErrorResponse } from '@angular/common/http';
import { LucideAngularModule } from 'lucide-angular';
import { ToastService } from '../../../../shared/services/toast.service';
import { icons } from '../../../../shared/util/icons';

@Component({
  selector: 'app-profile',
  imports: [ReactiveFormsModule, ButtonComponent, LucideAngularModule],
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

  /** CONTROL VARIABLES */
  isLoading = signal<boolean>(false);

  /** FORM */
  profileForm = new FormGroup({
    firstName: new FormControl(this.user.firstName, {
      nonNullable: true,
    }),
    lastName: new FormControl(this.user.lastName, {
      nonNullable: true,
    }),
    email: new FormControl(this.user.email, {
      nonNullable: true,
    }),
    phone: new FormControl(this.user.phone, {
      nonNullable: true,
    }),
  });
  passwordForm = new FormGroup({
    currentPassword: new FormControl('', {
      nonNullable: true,
    }),
    newPassword: new FormControl('', {
      nonNullable: true,
    }),
  });

  /** ACTIONS */
  submitProfileForm(): void {
    this.profileSE
      .update(this.user.id, getUserUpdatePayload(this.profileForm.getRawValue()))
      .subscribe({
        next: () => {
          this.toastSE.success('The information has been successfully updated', 'Update!');
        },
        error: (err: HttpErrorResponse) => {
          if (err) {
            this.toastSE.error(err.error.detail ?? 'Update failed', 'Error');
          }
        },
      });
  }
  submitPasswordForm(): void {
    this.profileSE
      .changePassword(this.user.id, getChangePasswordPayload(this.passwordForm.getRawValue()))
      .subscribe({
        next: () => {
          this.toastSE.success('The password has been successfully updated', 'Update!');
        },
        error: (err: HttpErrorResponse) => {
          if (err) {
            const errors = Object.values(err.error.errors).join('/n');
            this.toastSE.error(errors ?? 'Passsword update failed', 'Error');
          }
        },
      });
  }
}
