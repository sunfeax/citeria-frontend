import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { iPageableContent } from '../../../shared/models/pageable';
import { iServiceList } from '../models/service-list';

@Injectable({ providedIn: 'root' })
export class ServiceService {
  /** INJECTORS */
  private readonly http = inject(HttpClient);

  /** ACTIONS */
  getList(page = 0, size = 20): Observable<iPageableContent<iServiceList>> {
    return this.http.get<iPageableContent<iServiceList>>(`${environment.baseUrl}/services`, {
      params: { page, size },
      withCredentials: true,
    });
  }
}
