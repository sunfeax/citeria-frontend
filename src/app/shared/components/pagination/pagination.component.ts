import { Component } from '@angular/core';
import { icons } from '../../util/icons';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-pagination',
  imports: [LucideAngularModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss',
})
export class PaginationComponent {
  /** ICONS */
  readonly icons = icons;
}
