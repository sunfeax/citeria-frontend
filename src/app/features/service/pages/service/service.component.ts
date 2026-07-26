import { iPageableContent } from './../../../../shared/models/pageable';
import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { ServiceService } from '../../services/service.service';
import { iServiceList } from '../../models/service-list';
import { ToastService } from '../../../../shared/services/toast.service';
import { ButtonComponent } from '../../../../shared/components/button/button.component';

@Component({
  selector: 'app-service',
  imports: [ButtonComponent],
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
  size = computed(() => this.page()?.totalElements ?? 0);
  isFirstPage = computed(() => this.page()?.first ?? false);
  isLastPage = computed(() => this.page()?.last ?? false);

  /** ACTIONS */
  ngOnInit(): void {
    this.serviceSE.getList().subscribe({
      next: (page) => {
        console.log(page);
        this.page.set(page);
      },
      error: (err) => this.toastSE.error(err),
    });
  }
}
