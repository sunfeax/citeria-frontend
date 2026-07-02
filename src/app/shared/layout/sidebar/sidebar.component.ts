import { Component } from '@angular/core';
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
  protected readonly icons = IconsClass;
  data = StaticDataClass.sidebarData;
}
