import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BASE_URL } from '../../../core/environment/constantes';
import { ILoginRequest } from '../models/login.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  http = inject(HttpClient);
  
  login(payload: ILoginRequest): Observable<unknown> {
    return this.http.post(
      `${BASE_URL}/auth/login`,
      payload,
      { withCredentials: true }
    );
  }
}
