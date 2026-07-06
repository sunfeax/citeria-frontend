import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { ToastService } from '../../services/toast.service';
import { ToastType } from '../../types/toast';
import IconsClass from '../../util/icons-class';

@Component({
  selector: 'app-toast',
  imports: [LucideAngularModule],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastComponent {
  /** INJECTORS */
  readonly toastSE = inject(ToastService);

  /** ICONS */
  protected readonly icons = IconsClass;

  iconFor(type: ToastType) {
    switch (type) {
      case 'success':
        return this.icons.checkCircle;
      case 'error':
        return this.icons.circleAlert;
      case 'warning':
        return this.icons.triangleAlert;
      default:
        return this.icons.info;
    }
  }
}
