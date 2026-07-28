import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';
import { iDialogData } from '../../models/dialog-data';
import { ButtonComponent } from '../../components/button/button.component';

@Component({
  selector: 'app-confirm-dialog',
  imports: [ButtonComponent],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.scss',
})
export class ConfirmDialogComponent {
  /** INJECTORS */
  private readonly dialogRefSE = inject<DialogRef<boolean>>(DialogRef);

  /** DATA */
  readonly data = inject<iDialogData>(DIALOG_DATA);

  get confirmVariant(): 'primary' | 'danger' | 'warning' {
    if (this.data.variant === 'danger') return 'danger';
    if (this.data.variant === 'warning') return 'warning';
    return 'primary';
  }

  /** ACTIONS */
  onConfirm(): void {
    this.dialogRefSE.close(true);
  }
  onCancel(): void {
    this.dialogRefSE.close(false);
  }
}
