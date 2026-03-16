import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LucideAngularModule, ZapIcon, EyeIcon, EyeOff } from 'lucide-angular';
import { ButtonComponent } from '../../../../shared/components/button/button.component';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, ButtonComponent, LucideAngularModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  readonly ZapIcon = ZapIcon;
  readonly EyeIcon = EyeIcon;
  readonly EyeOff = EyeOff;
  
  isLoading = false;  
  isPasswordVisible = signal<boolean>(true);

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  });

  submit() {
    this.isLoading = true;
    this.isPasswordVisible = signal<boolean>(false);

    console.log(this.loginForm.value);

    this.isLoading = false;
  }
}