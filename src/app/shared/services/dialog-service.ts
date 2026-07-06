import { Injectable, inject } from '@angular/core';
import { Dialog } from '@angular/cdk/dialog';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ConfirmDialogComponent } from '../dialogs/confirm-dialog/confirm-dialog.component';
import { iDialogData } from '../types/dialog-data';

@Injectable({ providedIn: 'root' })
export class DialogService {
  private readonly dialogSE = inject(Dialog);

  confirm(data: iDialogData): void {
    this.dialogSE
      .open<boolean, iDialogData>(ConfirmDialogComponent, {
        data,
        backdropClass: 'confirm-backdrop',
      })
      .closed.subscribe((confirmed) => {
        if (confirmed === true) {
          data.onConfirm();
        }
      });
  }
}
