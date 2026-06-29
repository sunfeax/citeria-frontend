import { AuthHttpService } from './auth-http.service';
import { inject, Injectable } from '@angular/core';
import { SessionService } from './session.service';
import { LoginRequest, LoginResponse } from '../models/login.dto';
import { RegisterRequest, RegisterResponse } from '../models/register.dto';
import { catchError, finalize, Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private readonly authHttpSE = inject(AuthHttpService);
  private readonly sessionSE = inject(SessionService);

  login(payload: LoginRequest): Observable<LoginResponse> {
    return this.authHttpSE.login(payload).pipe(
      tap((response) => {
        this.sessionSE.setAccessToken(response.token);
      })
    );
  }

  register(payload: RegisterRequest): Observable<RegisterResponse> {
    return this.authHttpSE.register(payload);
  }

  refresh(): Observable<LoginResponse> {
    return this.authHttpSE.refresh().pipe(
      tap((response) => {
        this.sessionSE.setAccessToken(response.token);
      }),
      catchError((err) => {
        this.sessionSE.clearSession();
        return throwError(() => err);
      }) 
    );
  }

  logout(): Observable<void> {
    return this.authHttpSE.logout().pipe(
      finalize(() => {
        this.sessionSE.clearSession();
      })
    );
  }
}
