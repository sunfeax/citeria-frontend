import { ChangeDetectionStrategy, booleanAttribute, Component, Input } from '@angular/core';
import { LoaderCircleIcon, LucideAngularModule } from 'lucide-angular';

type ButtonVariant = 'primary' | 'secondary' | 'outline';
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
  private readonly baseStyles =
    'inline-flex items-center justify-center gap-2 rounded-2xl border font-semibold ' +
    'transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-blue-200 ' +
    'focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70';

  @Input() text: string = '';
  @Input() type: 'button' | 'submit' = 'button';
  @Input({ transform: booleanAttribute }) loading: boolean = false;
  @Input({ transform: booleanAttribute }) disabled: boolean = false;
  @Input({ transform: booleanAttribute }) fullWidth: boolean = false;
  @Input() variant: ButtonVariant = 'primary';
  @Input() size: ButtonSize = 'md';

  protected readonly variantStyles: Record<ButtonVariant, string> = {
    primary: 'border-blue-600 bg-blue-600 text-white hover:border-blue-700 hover:bg-blue-700',
    secondary: 'border-slate-300 bg-white-400 text-slate-700 hover:border-blue-700 hover:bg-slate-100 hover:border-2',
    outline: 'border-slate-300 bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700',
  };

  protected readonly sizeStyles: Record<ButtonSize, string> = {
    sm: 'h-10 px-3 text-sm',
    md: 'h-12 px-4 text-sm',
    lg: 'h-14 px-5 text-base',
  };

  protected readonly loaderStyles: Record<ButtonSize, string> = {
    sm: 'h-4 w-4',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  protected get buttonClasses(): string {
    const widthStyles = this.fullWidth ? 'w-full' : 'w-auto';

    return [
      this.baseStyles,
      this.variantStyles[this.variant],
      this.sizeStyles[this.size],
      widthStyles,
    ].join(' ');
  }

  protected get loaderClasses(): string {
    return `${this.loaderStyles[this.size]} animate-spin`;
  }
}
