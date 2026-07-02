import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import RoutesClass from '../../../../shared/util/routes-class';

@Component({
  selector: 'app-forgot-password',
  imports: [RouterLink],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
})
export class ForgotPasswordComponent {
  readonly routes = RoutesClass;
}
