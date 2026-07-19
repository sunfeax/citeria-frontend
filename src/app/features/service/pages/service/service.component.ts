import { Component, inject, OnInit } from '@angular/core';
import { ServiceService } from '../../services/service.service';

@Component({
  selector: 'app-service',
  imports: [],
  templateUrl: './service.component.html',
  styleUrl: './service.component.scss',
})
export class ServiceComponent implements OnInit {
  /** INJECTORS */
  private readonly serviceSE = inject(ServiceService);

  /** ACTIONS */
  ngOnInit(): void {
    this.serviceSE.getList().subscribe({
      next: (page) => console.log(page),
      error: (err) => console.error(err),
    });
  }
}
