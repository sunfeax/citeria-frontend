import { ChangeDetectionStrategy, booleanAttribute, Component, Input } from '@angular/core';
import { LucideAngularModule, LucideIconData } from 'lucide-angular';
import { icons } from '../../util/icons';

type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'quaternary'
  | 'outline'
  | 'icon'
  | 'danger'
  | 'warning';
type ButtonSize = '2xs' | 'xs' | 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-button',
  imports: [LucideAngularModule],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
  /** ICONS */
  protected readonly icons = icons;

  /** INPUTS */
  @Input() icon?: LucideIconData;
  @Input() image?: string;
  @Input() text?: string = '';
  @Input() type: 'button' | 'submit' = 'button';
  @Input() ariaLabel: string = '';
  @Input() ariaPressed?: boolean;
  @Input({ transform: booleanAttribute }) loading: boolean = false;
  @Input({ transform: booleanAttribute }) disabled: boolean = false;
  @Input({ transform: booleanAttribute }) fullWidth: boolean = false;
  @Input() variant: ButtonVariant = 'primary';
  @Input() size: ButtonSize = 'md';

  protected get buttonClasses(): string {
    return [
      'app-button',
      `app-button--${this.variant}`,
      `app-button--${this.size}`,
      this.fullWidth ? 'app-button--full' : '',
      !this.text && (this.icon || this.image) ? 'app-button--icon-only' : '',
    ]
      .filter(Boolean)
      .join(' ');
  }

  protected get loaderClasses(): string {
    return `app-button__loader app-button__loader--${this.size}`;
  }

  protected get iconClasses(): string {
    return `app-button__icon app-button__icon--${this.size}`;
  }
}
