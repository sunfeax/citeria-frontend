import { Component, computed, inject, signal } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { TabSyncService } from '../../../core/services/tab-sync.service';
import { SessionService } from '../../../features/auth/services/session.service';
import { DialogService } from '../../services/dialog.service';
import { ThemeService } from '../../services/theme.service';
import { routes } from '../../util/routes';
import { SIDEBAR_CONFIG } from '../../util/sidebar.config';
import { AuthService } from './../../../features/auth/services/auth.service';
import { SnackbarService } from './../../services/snackbar.service';

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
  private readonly snackbarService = inject(SnackbarService);
  private readonly tabSyncService = inject(TabSyncService);
  readonly themeSE = inject(ThemeService);

  /** DATA */
  sidebarData = SIDEBAR_CONFIG;
  isExpandedSidebar = signal<boolean>(true);
  protected readonly displayName = computed(() => {
    const user = this.sessionSE.user();
    if (!user) return 'Guest';
    return user.firstName?.trim() || user.email;
  });

  toggleSidebar(): void {
    this.isExpandedSidebar.update(currentState => !currentState);
  }

  toggleTheme(): void {
    this.themeSE.toggle();
  }

  logout(): void {
    this.authSE.logout().subscribe({
      next: () => {
        this.router.navigateByUrl(routes.login);
        this.tabSyncService.send('logout');
      },
      error: () => this.snackbarService.error('An error occurred during logout.'),
    });
  }

  openConfirmDialogToLogout(): void {
    this.dialogSE
      .confirm({
        title: 'Logout',
        message: 'Do want to sign out?',
        confirmText: 'Logout',
        variant: 'danger',
      })
      .subscribe(() => this.logout());
  }
}
