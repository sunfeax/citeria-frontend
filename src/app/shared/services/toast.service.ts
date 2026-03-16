import { Injectable, signal } from '@angular/core';
import { ToastItem } from '../types/toast.type';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  readonly toasts = signal<ToastItem[]>([]);

  success(message: string, title = 'Success', duration = 3000): void {
    this.show({ type: 'success', title, message, duration });
  }

  error(message: string, title = 'Error', duration = 4000): void {
    this.show({ type: 'error', title, message, duration });
  }

  info(message: string, title = 'Info', duration = 3000): void {
    this.show({ type: 'info', title, message, duration });
  }

  warning(message: string, title = 'Warning', duration = 3500): void {
    this.show({ type: 'warning', title, message, duration });
  }

  remove(id: string): void {
    this.toasts.update(items => items.filter(item => item.id !== id));
  }

  private show(input: Omit<ToastItem, 'id'>): void {
    const id = crypto.randomUUID();

    const toast: ToastItem = {
      id,
      ...input,
    };

    this.toasts.update(items => [...items, toast]);

    window.setTimeout(() => {
      this.remove(id);
    }, toast.duration);
  }
}