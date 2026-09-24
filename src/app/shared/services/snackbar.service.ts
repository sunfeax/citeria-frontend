import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SNACKBAR_CONFIG } from '../../core/config/snackbar.config';

type Snackbar = 'success' | 'error' | 'info' | 'warning';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  /** INJECTORS */
  private readonly snackBarSE = inject(MatSnackBar);

  /** ACTIONS */
  success(message: string): void {
    this.show(message, 'success');
  }

  error(message: string): void {
    this.show(message, 'error');
  }

  info(message: string): void {
    this.show(message, 'info');
  }

  warning(message: string): void {
    this.show(message, 'warning');
  }

  private show(message: string, type: Snackbar): void {
    const panelClass = ['app-snack-bar', `app-snack-bar--${type}`];
    const config = { ...SNACKBAR_CONFIG, panelClass };
    this.snackBarSE.open(message, 'Dismiss', config);
  }
}
