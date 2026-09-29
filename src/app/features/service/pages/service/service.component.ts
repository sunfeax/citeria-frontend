import { Component, computed, inject, linkedSignal, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatOption } from '@angular/material/core';
import {
  MatFormField,
  MatLabel,
  MatPrefix,
  MatSuffix,
} from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelect } from '@angular/material/select';
import { MatSlider, MatSliderRangeThumb } from '@angular/material/slider';
import { catchError, EMPTY, finalize, switchMap } from 'rxjs';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { debounced } from '../../../../shared/util/rxjs-helpers';
import { ServiceService } from '../../services/service.service';

@Component({
  selector: 'app-service',
  imports: [
    MatButton,
    MatIconButton,
    MatFormField,
    MatLabel,
    MatPrefix,
    MatSuffix,
    MatInput,
    MatIcon,
    MatSelect,
    MatOption,
    MatSlider,
    MatSliderRangeThumb,
    MatPaginatorModule,
    MatProgressBarModule,
    FormsModule,
  ],
  templateUrl: './service.component.html',
  styleUrl: './service.component.scss',
})
export class ServiceComponent {
  /** INJECTORS */
  private readonly serviceSE = inject(ServiceService);
  private readonly snackbarSE = inject(SnackbarService);

  /** SEARCH */
  readonly search = signal<string | null>(null);
  private readonly debouncedSearch = debounced(
    computed(() => this.search()?.trim() ?? null),
    300,
  );

  /** FILTERS */
  readonly active = signal<boolean | null>(null);
  readonly minPrice = signal<number | null>(null);
  readonly maxPrice = signal<number | null>(null);
  private readonly debouncedMinPrice = debounced(this.minPrice, 300);
  private readonly debouncedMaxPrice = debounced(this.maxPrice, 300);

  /** PAGINATION */
  readonly page = linkedSignal({
    source: this.debouncedSearch,
    computation: () => 0,
  });
  readonly size = signal(20);
  readonly sizeOptions = [5, 10, 20, 50];

  /** DATA */
  private readonly request = computed(() => ({
    page: this.page(),
    size: this.size(),
    filters: {
      search: this.debouncedSearch(),
      minPrice: this.debouncedMinPrice(),
      maxPrice: this.debouncedMaxPrice(),
      active: this.active(),
    },
  }));

  readonly response = toSignal(
    toObservable(this.request).pipe(
      switchMap(({ page, size, filters }) => {
        this.isLoading.set(true);
        return this.serviceSE.getList(page, size, filters).pipe(
          catchError(() => {
            this.handleLoadError();
            return EMPTY;
          }),
          finalize(() => this.isLoading.set(false)),
        );
      }),
    ),
    { initialValue: null },
  );
  readonly services = computed(() => this.response()?.content ?? []);
  readonly totalElements = computed(() => this.response()?.totalElements ?? 0);

  /** CONTROL STATE */
  readonly isLoading = signal(false);
  readonly filtersExpanded = signal(false);

  /** ACTIONS */
  toggleFilters(): void {
    this.filtersExpanded.update(expanded => !expanded);
  }

  onPage(event: PageEvent) {
    this.size.set(event.pageSize);
    this.page.set(event.pageIndex);
  }

  private handleLoadError(): void {
    this.snackbarSE.error('Unable to load services right now.');
    this.page.set(this.response()?.page ?? this.page());
    this.size.set(this.response()?.size ?? this.size());
  }
}
