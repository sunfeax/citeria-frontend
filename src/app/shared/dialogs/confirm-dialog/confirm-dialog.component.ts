import { Component, inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { iDialogData } from '../../models/dialog-data';

@Component({
  selector: 'app-confirm-dialog',
  imports: [MatDialogTitle, MatDialogContent, MatDialogActions, MatButton],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.scss',
})
export class ConfirmDialogComponent {
  /** INJECTORS */
  private readonly dialogRefSE = inject<MatDialogRef<ConfirmDialogComponent, boolean>>(MatDialogRef);

  /** DATA */
  readonly data = inject<iDialogData>(MAT_DIALOG_DATA);

  get confirmClass(): string {
    switch (this.data.variant) {
      case 'danger':
        return 'confirm__accept--danger';
      case 'warning':
        return 'confirm__accept--warning';
      default:
        return '';
    }
  }

  /** ACTIONS */
  onConfirm(): void {
    this.dialogRefSE.close(true);
  }
  onCancel(): void {
    this.dialogRefSE.close(false);
  }
}
