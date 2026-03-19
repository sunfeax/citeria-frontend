import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginRequest, LoginResponse } from '../../features/auth/models/login.dto';
import { BASE_URL } from '../environment/constants';
import { RegisterRequest, RegisterResponse } from '../../features/auth/models/register.dto';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
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
}
