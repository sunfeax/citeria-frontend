import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginRequest, LoginResponse } from '../models/login.dto';
import { BASE_URL } from '../../../core/environment/constants';
import { RegisterRequest, RegisterResponse } from '../models/register.dto';

@Injectable({
  providedIn: 'root',
})
export class AuthApiService {

  http = inject(HttpClient);
  
  login(payload: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      `${BASE_URL}/auth/login`,
      payload,
      { withCredentials: true }
    );
  }

  register(payload: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(
      `${BASE_URL}/auth/register`,
      payload,
      { withCredentials: true }
    );
  }

  refresh(): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      `${BASE_URL}/auth/refresh`,
      {},
      { withCredentials: true }
    );
  }

  logout(): Observable<void> {
    return this.http.post<void>(
      `${BASE_URL}/auth/logout`,
      {},
      { withCredentials: true }
    );
  }
}
