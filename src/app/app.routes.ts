import { Routes } from '@angular/router';
import { ForgotPasswordComponent } from './features/auth/pages/forgot-password/forgot-password.component';
import { LoginComponent } from './features/auth/pages/login/login.component';
import { RegisterComponent } from './features/auth/pages/register/register.component';
import { MainLayoutComponent } from './shared/layout/main-layout/main-layout.component';

export const routes: Routes = [

  { path: '', component: MainLayoutComponent, children: [
      // { path: '', component: HomeComponent },
      // { path: 'search', component: SearchComponent },
      // { path: 'profile', component: ProfileComponent },
    ]
  },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
];
