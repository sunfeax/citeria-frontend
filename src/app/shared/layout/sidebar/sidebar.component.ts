import { Component, computed, inject, signal } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { SessionService } from '../../../features/auth/services/session.service';
import { DialogService } from '../../services/dialog.service';
import { ThemeService } from '../../services/theme.service';
import { ToastService } from '../../services/toast.service';
import { routes } from '../../util/routes';
import { SIDEBAR_CONFIG } from '../../util/sidebar.config';
import { AuthService } from './../../../features/auth/services/auth.service';

@Component({
  selector: 'app-sidebar',
  imports: [MatIcon, MatIconButton, RouterLink],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  /** INJECTORS */
  private readonly authSE = inject(AuthService);
  private readonly sessionSE = inject(SessionService);
  private readonly router = inject(Router);
  private readonly dialogSE = inject(DialogService);
  private readonly toastSE = inject(ToastService);
  readonly themeSE = inject(ThemeService);

  /** DATA */
  sidebarData = SIDEBAR_CONFIG;
  isToggledSidebar = signal<boolean>(true);
  protected readonly displayName = computed(() => {
    const user = this.sessionSE.user();
    if (!user) return 'Guest';
    const fullName = `${user.firstName} ${user.lastName}`;
    return fullName || user.email;
  });

  toggleSidebar() {
    this.isToggledSidebar.update(currentState => !currentState);
  }

  toggleTheme() {
    this.themeSE.toggle();
  }

  logout(): void {
    this.authSE.logout().subscribe(() => {
      this.toastSE.success('You have successfully logged out');
      this.router.navigateByUrl(routes.login);
    });
  }

  openConfirmDialogToLogout(): void {
    this.dialogSE.confirm({
      title: 'Logout',
      message: 'Do want to sign out?',
      confirmText: 'Logout',
      variant: 'danger',
      onConfirm: () => this.logout(),
    });
  }
}
