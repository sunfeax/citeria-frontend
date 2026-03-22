import { AuthApiService } from './auth-api.service';
import { inject, Injectable } from '@angular/core';
import { SessionService } from './session.service';
import { LoginRequest, LoginResponse } from '../models/login.dto';
import { catchError, finalize, Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private readonly authApiService = inject(AuthApiService);
  private readonly sessionService = inject(SessionService);

  login(payload: LoginRequest): Observable<LoginResponse> {
    return this.authApiService.login(payload).pipe(
      tap((response) => {
        this.sessionService.setAccessToken(response.token);
      })
    );
  }

  refresh(): Observable<LoginResponse> {
    return this.authApiService.refresh().pipe(
      tap((response) => {
        this.sessionService.setAccessToken(response.token);
      }),
      catchError((err) => {
        this.sessionService.clearSession();
        return throwError(() => err);
      }) 
    );
  }

  logout(): Observable<void> {
    return this.authApiService.logout().pipe(
      finalize(() => {
        this.sessionService.clearSession();
      })
    );
  }
}
