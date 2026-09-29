import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { iPageableContent } from '../../../shared/models/pageable';
import { iServiceList, ServiceFilters } from '../models/service-list';

@Injectable({ providedIn: 'root' })
export class ServiceService {
  /** INJECTORS */
  private readonly http = inject(HttpClient);

  /** ACTIONS */
  getList(
    page: number,
    size: number,
    filters: ServiceFilters,
  ): Observable<iPageableContent<iServiceList>> {
    let params = new HttpParams().set('page', page).set('size', size);

    for (const [key, value] of Object.entries(filters)) {
      if (value !== '' && value !== null && value !== undefined) {
        params = params.set(key, value);
      }
    }

    return this.http.get<iPageableContent<iServiceList>>(
      `${environment.baseUrl}/services`,
      {
        params,
        withCredentials: true,
      },
    );
  }
}
