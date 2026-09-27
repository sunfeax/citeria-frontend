import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButton } from '@angular/material/button';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Subject, switchMap, tap } from 'rxjs';
import { iApiError } from '../../../../shared/models/api-error';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { iServiceList } from '../../models/service-list';
import { ServiceService } from '../../services/service.service';
import { iPageableContent } from './../../../../shared/models/pageable';

@Component({
  selector: 'app-service',
  imports: [MatButton, MatPaginatorModule],
  templateUrl: './service.component.html',
  styleUrl: './service.component.scss',
})
export class ServiceComponent implements OnInit {
  /** INJECTORS */
  private readonly serviceSE = inject(ServiceService);
  private readonly snackbarSE = inject(SnackbarService);

  /** DATA */
  private readonly pageRequest$ = new Subject<{ page: number; size: number }>();
  isLoading = signal<boolean>(false);

  response = signal<iPageableContent<iServiceList> | null>(null);
  services = computed(() => this.response()?.content ?? []);
  totalElements = computed(() => this.response()?.totalElements ?? 0);

  page = signal<number>(0);
  size = signal<number>(20);
  sizeOptions = [5, 10, 20, 50];

  /** ACTIONS */
  constructor() {
    this.pageRequest$
      .pipe(
        tap(() => this.isLoading.set(true)),
        switchMap(({ page, size }) => this.serviceSE.getList(page, size)),
        takeUntilDestroyed(),
      )
      .subscribe({
        next: response => {
          this.isLoading.set(false);
          this.response.set(response);
        },
        error: (err: HttpErrorResponse) => {
          this.isLoading.set(false);
          const apiError = err.error as iApiError;
          this.snackbarSE.error(apiError.detail ?? 'Unable to load services right now.');
        },
      });
  }

  ngOnInit(): void {
    this.pageRequest$.next({ page: this.page(), size: this.size() });
  }

  onPage(e: PageEvent) {
    this.size.set(e.pageSize);
    this.page.set(e.pageIndex);
    this.pageRequest$.next({ page: e.pageIndex, size: e.pageSize });
  }
}
