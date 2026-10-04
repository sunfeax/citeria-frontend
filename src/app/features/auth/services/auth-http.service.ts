import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginRequest, LoginResponse } from '../models/login';
import { environment } from '../../../../environments/environment';
import { RegisterRequest, RegisterResponse } from '../models/register';
import { User } from '../models/user';
import { RefreshResponse } from '../models/refresh';

@Injectable({
  providedIn: 'root',
})
export class AuthHttpService {
  /** INJECTORS */
  private readonly http = inject(HttpClient);

  /** ACTIONS */
  login(payload: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${environment.baseUrl}/auth/login`, payload, {
      withCredentials: true,
    });
  }
  register(payload: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${environment.baseUrl}/auth/register`, payload, {
      withCredentials: true,
    });
  }
  refresh(): Observable<RefreshResponse> {
    return this.http.post<RefreshResponse>(`${environment.baseUrl}/auth/refresh`, {}, { withCredentials: true });
  }
  logout(): Observable<void> {
    return this.http.post<void>(`${environment.baseUrl}/auth/logout`, {}, { withCredentials: true });
  }
  getMe(): Observable<User> {
    return this.http.get<User>(`${environment.baseUrl}/users/me`, { withCredentials: true });
  }
}
