import { iPageableContent } from './../../../../shared/models/pageable';
import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ServiceService } from '../../services/service.service';
import { iServiceList } from '../../models/service-list';
import { ToastService } from '../../../../shared/services/toast.service';
import { MatButton } from '@angular/material/button';
import { iApiError } from '../../../../shared/models/api-error';

@Component({
  selector: 'app-service',
  imports: [MatButton],
  templateUrl: './service.component.html',
  styleUrl: './service.component.scss',
})
export class ServiceComponent implements OnInit {
  /** INJECTORS */
  private readonly serviceSE = inject(ServiceService);
  private readonly toastSE = inject(ToastService);

  /** DATA */
  page = signal<iPageableContent<iServiceList> | null>(null);

  services = computed(() => this.page()?.content ?? []);
  totalPages = computed(() => this.page()?.totalPages ?? 0);
  totalElements = computed(() => this.page()?.totalElements ?? 0);
  size = computed(() => this.page()?.size ?? 0);
  isFirstPage = computed(() => this.page()?.first ?? false);
  isLastPage = computed(() => this.page()?.last ?? false);

  /** ACTIONS */
  ngOnInit(): void {
    this.serviceSE.getList().subscribe({
      next: page => {
        this.page.set(page);
      },
      error: (err: HttpErrorResponse) => {
        const apiError = err.error as iApiError;
        this.toastSE.error(apiError.detail ?? 'Unable to load services right now.');
      },
    });
  }
}
