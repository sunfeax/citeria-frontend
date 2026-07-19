import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { iServiceList } from '../models/service-list';
import { iPageableContent } from '../../../shared/models/pageable';

@Injectable({ providedIn: 'root' })
export class ServiceService {
  /** INJECTORS */
  private readonly http = inject(HttpClient);

  /** ACTIONS */
  getList(): Observable<iPageableContent<iServiceList>> {
    return this.http.get<iPageableContent<iServiceList>>(`${environment.baseUrl}/services`, {
      withCredentials: true,
    });
  }
}
