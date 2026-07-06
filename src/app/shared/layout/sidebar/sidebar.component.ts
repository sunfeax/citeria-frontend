import { AuthService } from './../../../features/auth/services/auth.service';
import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import IconsClass from '../../util/icons-class';
import RoutesClass from '../../util/routes-class';
import StaticDataClass from '../../util/static-data-class';
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
  protected readonly icons = IconsClass;

  /** DATA */
  data = StaticDataClass.sidebarData;
  protected readonly displayName = computed(() => {
    const user = this.sessionSE.user();
    if (!user) return 'Guest';
    const fullName = `${user.firstName} ${user.lastName}`;
    return fullName || user.email;
  });

  logout(): void {
    this.authSE.logout().subscribe(() => {
      this.toastSE.success('You have successfully logged out');
      this.router.navigateByUrl(RoutesClass.login);
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
