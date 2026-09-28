import { Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatOption } from '@angular/material/core';
import { MatFormField, MatLabel, MatPrefix } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelect } from '@angular/material/select';
import {
  BehaviorSubject,
  catchError,
  debounceTime,
  distinctUntilChanged,
  EMPTY,
  map,
  skip,
  switchMap,
  tap,
} from 'rxjs';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { ServiceService } from '../../services/service.service';

@Component({
  selector: 'app-service',
  imports: [
    MatButton,
    MatIconButton,
    MatFormField,
    MatLabel,
    MatPrefix,
    MatInput,
    MatIcon,
    MatSelect,
    MatOption,
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

  /** DATA */
  readonly page = signal(0);
  readonly size = signal(20);
  readonly sizeOptions = [5, 10, 20, 50];
  readonly services = computed(() => this.response()?.content ?? []);
  readonly totalElements = computed(() => this.response()?.totalElements ?? 0);

  /** SEARCH */
  readonly search = signal('');
  readonly search$ = toObservable(this.search).pipe(
    skip(1),
    map(value => value.trim()),
    debounceTime(300),
    distinctUntilChanged(),
  );

  private readonly pageRequest$ = new BehaviorSubject({
    page: this.page(),
    size: this.size(),
    search: this.search(),
  });

  readonly isLoading = signal(false);
  readonly filtersExpanded = signal(false);

  readonly response = toSignal(
    this.pageRequest$.pipe(
      tap(() => this.isLoading.set(true)),
      switchMap(({ page, size, search }) =>
        this.serviceSE.getList(page, size, search).pipe(
          tap(() => this.isLoading.set(false)),
          catchError(() => {
            this.handleLoadError();
            return EMPTY;
          }),
        ),
      ),
    ),
    { initialValue: null },
  );

  /** ACTIONS */
  constructor() {
    this.search$.pipe(takeUntilDestroyed()).subscribe(search => {
      this.page.set(0);
      this.pageRequest$.next({
        page: 0,
        size: this.size(),
        search,
      });
    });
  }

  toggleFilters(): void {
    this.filtersExpanded.update(expanded => !expanded);
  }

  onPage(event: PageEvent) {
    this.size.set(event.pageSize);
    this.page.set(event.pageIndex);
    this.pageRequest$.next({
      page: event.pageIndex,
      size: event.pageSize,
      search: this.search(),
    });
  }

  private handleLoadError(): void {
    this.isLoading.set(false);
    this.snackbarSE.error('Unable to load services right now.');
    this.page.set(this.response()?.page ?? this.page());
    this.size.set(this.response()?.size ?? this.size());
  }
}
