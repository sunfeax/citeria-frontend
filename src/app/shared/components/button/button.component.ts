import { ChangeDetectionStrategy, booleanAttribute, Component, Input } from '@angular/core';
import { LoaderCircleIcon, LucideAngularModule } from 'lucide-angular';

type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'quaternary' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-button',
  imports: [LucideAngularModule],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
  protected readonly loaderCircleIcon = LoaderCircleIcon;

  @Input() text: string = '';
  @Input() type: 'button' | 'submit' = 'button';
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
    ]
      .filter(Boolean)
      .join(' ');
  }

  protected get loaderClasses(): string {
    return `app-button__loader app-button__loader--${this.size}`;
  }
}
