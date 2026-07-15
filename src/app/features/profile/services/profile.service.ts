import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { iUserUpdateRequest } from '../models/user-update-request';
import { iUser } from '../../auth/models/user';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  /** INJECTORS */
  http = inject(HttpClient);

  /** ACTIONS */
  update(id: string, payload: iUserUpdateRequest): Observable<iUser> {
    return this.http.patch<iUser>(`${environment.baseUrl}/users/${id}`, payload, {
      withCredentials: true,
    });
  }
}
