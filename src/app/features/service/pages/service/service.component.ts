import { Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { MatButton } from '@angular/material/button';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { BehaviorSubject, catchError, EMPTY, switchMap, tap } from 'rxjs';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { ServiceService } from '../../services/service.service';

@Component({
  selector: 'app-service',
  imports: [MatButton, MatPaginatorModule, MatProgressBarModule],
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

  private readonly pageRequest$ = new BehaviorSubject({
    page: this.page(),
    size: this.size(),
  });

  readonly isLoading = signal(false);

  readonly response = toSignal(
    this.pageRequest$.pipe(
      tap(() => this.isLoading.set(true)),
      switchMap(({ page, size }) =>
        this.serviceSE.getList(page, size).pipe(
          tap(() => this.isLoading.set(false)),
          catchError(() => {
            this.handleLoadError();
            return EMPTY;
          }),
        ),
      ),
      takeUntilDestroyed(),
    ),
    { initialValue: null },
  );

  readonly services = computed(() => this.response()?.content ?? []);
  readonly totalElements = computed(() => this.response()?.totalElements ?? 0);

  /** ACTIONS */
  onPage(event: PageEvent) {
    this.size.set(event.pageSize);
    this.page.set(event.pageIndex);
    this.pageRequest$.next({ page: event.pageIndex, size: event.pageSize });
  }

  private handleLoadError(): void {
    this.isLoading.set(false);
    this.snackbarSE.error('Unable to load services right now.');
    this.page.set(this.response()?.page ?? this.page());
    this.size.set(this.response()?.size ?? this.size());
  }
}
