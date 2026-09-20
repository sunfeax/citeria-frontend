import { inject, Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

type tToastType = 'success' | 'error' | 'info' | 'warning';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  /** INJECTORS */
  private readonly snackBarSE = inject(MatSnackBar);

  /** ACTIONS */
  success(message: string, duration = 3000): void {
    this.show(message, 'success', duration);
  }

  error(message: string, duration = 5000): void {
    this.show(message, 'error', duration);
  }

  info(message: string, duration = 3000): void {
    this.show(message, 'info', duration);
  }

  warning(message: string, duration = 4000): void {
    this.show(message, 'warning', duration);
  }

  dismiss(): void {
    this.snackBarSE.dismiss();
  }

  /** HELPERS */
  private show(message: string, type: tToastType, duration: number): void {
    const config: MatSnackBarConfig = {
      duration,
      panelClass: ['app-snack-bar', `app-snack-bar--${type}`],
      horizontalPosition: 'right',
      verticalPosition: 'top',
    };

    this.snackBarSE.open(message, 'Dismiss', config);
  }
}
