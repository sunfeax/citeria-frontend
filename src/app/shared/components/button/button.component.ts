import { booleanAttribute, Component, Input } from '@angular/core';
import { LoaderCircleIcon, LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-button',
  imports: [LucideAngularModule],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
})
export class ButtonComponent {
  protected readonly loaderCircleIcon = LoaderCircleIcon;

  @Input() text: string = '';
  @Input() type: 'button' | 'submit' = 'button';
  @Input({ transform: booleanAttribute }) loading: boolean = false;
  @Input({ transform: booleanAttribute }) disabled: boolean = false;
}
