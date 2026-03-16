import { NgClass } from '@angular/common';
import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { LucideAngularModule, CheckCircle2Icon, CircleAlertIcon, InfoIcon, TriangleAlertIcon, XIcon } from 'lucide-angular';
import { ToastService } from '../../services/toast.service';
import { ToastType } from '../../types/toast.type';

@Component({
  selector: 'app-toast',
  imports: [NgClass, LucideAngularModule],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastComponent {
  readonly toastService = inject(ToastService);

  protected readonly CheckCircle2Icon = CheckCircle2Icon;
  protected readonly CircleAlertIcon = CircleAlertIcon;
  protected readonly InfoIcon = InfoIcon;
  protected readonly TriangleAlertIcon = TriangleAlertIcon;
  protected readonly XIcon = XIcon;

  iconFor(type: ToastType) {
    switch (type) {
      case 'success':
        return this.CheckCircle2Icon;
      case 'error':
        return this.CircleAlertIcon;
      case 'warning':
        return this.TriangleAlertIcon;
      default:
        return this.InfoIcon;
    }
  }
}
