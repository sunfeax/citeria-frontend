import { AuthService } from './../../../features/auth/services/auth.service';
import { Component, inject } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import IconsClass from '../../util/icons-class';
import StaticDataClass from '../../util/static-data-class';

@Component({
  selector: 'app-sidebar',
  imports: [LucideAngularModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  /** INJECTORS */
  private readonly authSE = inject(AuthService);

  /** ICONS */
  protected readonly icons = IconsClass;

  /** DATA */
  data = StaticDataClass.sidebarData;

  logout(): void {
    this.authSE.logout();
  }
}
