import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { iLoginRequest, iLoginResponse } from '../models/login';
import { environment } from '../../../../environments/environment';
import { iRegisterRequest, tRegisterResponse } from '../models/register';
import { iUser } from '../models/user';
import { iRefreshResponse } from '../models/refresh';

@Injectable({
  providedIn: 'root',
})
export class AuthHttpService {
  /** INJECTORS */
  http = inject(HttpClient);

  /** ACTIONS */
  login(payload: iLoginRequest): Observable<iLoginResponse> {
    return this.http.post<iLoginResponse>(`${environment.baseUrl}/auth/login`, payload, {
      withCredentials: true,
    });
  }
  register(payload: iRegisterRequest): Observable<tRegisterResponse> {
    return this.http.post<tRegisterResponse>(`${environment.baseUrl}/auth/register`, payload, {
      withCredentials: true,
    });
  }
  refresh(): Observable<iRefreshResponse> {
    return this.http.post<iRefreshResponse>(
      `${environment.baseUrl}/auth/refresh`,
      {},
      { withCredentials: true },
    );
  }
  logout(): Observable<void> {
    return this.http.post<void>(
      `${environment.baseUrl}/auth/logout`,
      {},
      { withCredentials: true },
    );
  }
  getMe(): Observable<iUser> {
    return this.http.get<iUser>(`${environment.baseUrl}/users/me`, { withCredentials: true });
  }
}
