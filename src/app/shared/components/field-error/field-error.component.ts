import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-field-error',
  imports: [],
  templateUrl: './field-error.component.html',
  styleUrl: './field-error.component.scss',
})
export class FieldErrorComponent {
  @Input({ required: true }) control!: AbstractControl; 
  @Input() serverError?: string | null;

  get shouldShowError(): boolean {
    return !!this.serverError || (this.control.invalid && this.control.touched);
  }
}
