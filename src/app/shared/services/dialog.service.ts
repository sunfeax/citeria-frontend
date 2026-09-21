import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../dialogs/confirm-dialog/confirm-dialog.component';
import { iDialogData } from '../models/dialog-data';

@Injectable({ providedIn: 'root' })
export class DialogService {
  /** INJECTORS */
  private readonly dialogSE = inject(MatDialog);

  /** ACTIONS */
  confirm(data: iDialogData): void {
    this.dialogSE
      .open<ConfirmDialogComponent, iDialogData, boolean>(ConfirmDialogComponent, {
        data,
        width: 'min(28rem, calc(100vw - 2rem))',
        autoFocus: 'dialog',
      })
      .afterClosed()
      .subscribe(confirmed => {
        if (confirmed === true) {
          data.onConfirm();
        }
      });
  }
}
