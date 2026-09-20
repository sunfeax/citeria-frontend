import { Routes } from '@angular/router';
import { accessGuard } from './core/guards/access.guard';
import { ForgotPasswordComponent } from './features/auth/pages/forgot-password/forgot-password.component';
import { LoginComponent } from './features/auth/pages/login/login.component';
import { RegisterComponent } from './features/auth/pages/register/register.component';
import { ProfileComponent } from './features/profile/pages/profile/profile.component';
import { ServiceComponent } from './features/service/pages/service/service.component';
import { MainLayoutComponent } from './shared/layout/main-layout/main-layout.component';
import { SidebarLayoutComponent } from './shared/layout/sidebar-layout/sidebar-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [accessGuard],
    children: [{ path: 'services', component: ServiceComponent }],
  },
  {
    path: '',
    component: SidebarLayoutComponent,
    canActivate: [accessGuard],
    children: [{ path: 'profile', component: ProfileComponent }],
  },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
];
