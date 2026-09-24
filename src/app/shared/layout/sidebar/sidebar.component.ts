import { Component, computed, inject, signal } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { SessionService } from '../../../features/auth/services/session.service';
import { DialogService } from '../../services/dialog.service';
import { SnackbarService } from '../../services/snackbar.service';
import { ThemeService } from '../../services/theme.service';
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
  private readonly snackbarSE = inject(SnackbarService);
  readonly themeSE = inject(ThemeService);

  /** DATA */
  sidebarData = SIDEBAR_CONFIG;
  isExpandedSidebar = signal<boolean>(true);
  protected readonly displayName = computed(() => {
    const user = this.sessionSE.user();
    if (!user) return 'Guest';
    return user.firstName?.trim() || user.email;
  });

  toggleSidebar() {
    this.isExpandedSidebar.update(currentState => !currentState);
  }

  toggleTheme() {
    this.themeSE.toggle();
  }

  logout(): void {
    this.authSE.logout().subscribe(() => {
      this.snackbarSE.success('You have successfully logged out');
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
