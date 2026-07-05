import { AuthService } from './../../../features/auth/services/auth.service';
import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import IconsClass from '../../util/icons-class';
import RoutesClass from '../../util/routes-class';
import StaticDataClass from '../../util/static-data-class';
import { SessionService } from '../../../features/auth/services/session.service';

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
      this.router.navigateByUrl(RoutesClass.login);
    });
  }
}
