import { AuthService } from './../../../features/auth/services/auth.service';
import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { icons } from '../../util/icons';
import { routes } from '../../util/routes';
import { sidebarData } from '../../util/static-data';
import { SessionService } from '../../../features/auth/services/session.service';
import { DialogService } from '../../services/dialog-service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-sidebar',
  imports: [LucideAngularModule],
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

  /** ICONS */
  protected readonly icons = icons;

  /** DATA */
  data = sidebarData;
  protected readonly displayName = computed(() => {
    const user = this.sessionSE.user();
    if (!user) return 'Guest';
    const fullName = `${user.firstName} ${user.lastName}`;
    return fullName || user.email;
  });

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
