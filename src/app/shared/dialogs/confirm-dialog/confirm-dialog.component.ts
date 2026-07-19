import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';
import { iDialogData } from '../../models/dialog-data';

@Component({
  selector: 'app-confirm-dialog',
  imports: [],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.scss',
})
export class ConfirmDialogComponent {
  /** INJECTORS */
  private readonly dialogRefSE = inject<DialogRef<boolean>>(DialogRef);

  /** DATA */
  readonly data = inject<iDialogData>(DIALOG_DATA);

  /** ACTIONS */
  onConfirm(): void {
    this.dialogRefSE.close(true);
  }
  onCancel(): void {
    this.dialogRefSE.close(false);
  }
}
