import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginRequest, LoginResponse } from '../models/login.dto';
import { environment } from '../../../../environments/environment';
import { RegisterRequest, RegisterResponse } from '../models/register.dto';

@Injectable({
  providedIn: 'root',
})
export class AuthHttpService {

  http = inject(HttpClient);
  
  login(payload: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      `${environment.baseUrl}/auth/login`,
      payload,
      { withCredentials: true }
    );
  }

  register(payload: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(
      `${environment.baseUrl}/auth/register`,
      payload,
      { withCredentials: true }
    );
  }

  refresh(): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      `${environment.baseUrl}/auth/refresh`,
      {},
      { withCredentials: true }
    );
  }

  logout(): Observable<void> {
    return this.http.post<void>(
      `${environment.baseUrl}/auth/logout`,
      {},
      { withCredentials: true }
    );
  }
}
