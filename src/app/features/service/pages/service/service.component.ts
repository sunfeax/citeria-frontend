import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { iApiError } from '../../../../shared/models/api-error';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { iServiceList } from '../../models/service-list';
import { ServiceService } from '../../services/service.service';
import { iPageableContent } from './../../../../shared/models/pageable';
import { getMockPage } from './service.mockdata';

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
  response = signal<iPageableContent<iServiceList> | null>(null);

  services = computed(() => this.response()?.content ?? []);
  totalElements = computed(() => this.response()?.totalElements ?? 0);

  page = signal<number>(0);
  size = signal<number>(20);
  sizeOptions = [5, 10, 20, 50];

  /** ACTIONS */
  ngOnInit(): void {
    this.load();
  }

  onPage(e: PageEvent) {
    this.size.set(e.pageSize);
    this.page.set(e.pageIndex);
    this.load(e.pageIndex, e.pageSize);
  }

  load(page = 0, size = this.size()) {
    this.serviceSE.getList(page, size).subscribe({
      next: response => {
        // TODO: заменить на реальный content после разработки пагинации
        this.response.set(getMockPage(page, size));
        // this.page.set(response);
      },
      error: (err: HttpErrorResponse) => {
        const apiError = err.error as iApiError;
        this.snackbarSE.error(apiError.detail ?? 'Unable to load services right now.');
      },
    });
  }
}
