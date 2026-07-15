import { getUserUpdatePayload } from './../../../../shared/util/payload-handler';
import { iUser } from './../../../auth/models/user';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SessionService } from '../../../auth/services/session.service';
import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'app-profile',
  imports: [ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  /** INJECTORS */
  private readonly sessionSE = inject(SessionService);
  private readonly profileSE = inject(ProfileService);

  /** DATA */
  user: iUser = this.sessionSE.requireUser();

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

  /** ACTIONS */
  update(): void {
    this.profileSE.update(this.user.id, getUserUpdatePayload(this.profileForm.getRawValue()));
  }
}
