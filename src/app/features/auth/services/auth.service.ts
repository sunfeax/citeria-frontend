import { AuthHttpService } from './auth-http.service';
import { inject, Injectable } from '@angular/core';
import { SessionService } from './session.service';
import { iLoginRequest, iLoginResponse } from '../models/iLogin';
import { iRegisterRequest, tRegisterResponse } from '../models/iRegister';
import { catchError, finalize, Observable, tap, throwError } from 'rxjs';
import { iUser } from '../models/iUser';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  /** INJECTORS */
  private readonly authHttpSE = inject(AuthHttpService);
  private readonly sessionSE = inject(SessionService);

  /** ACTIONS */
  login(payload: iLoginRequest): Observable<iLoginResponse> {
    return this.authHttpSE.login(payload).pipe(
      tap((response) => {
        this.sessionSE.setAccessToken(response.token);
        this.sessionSE.setUser(response.user);
      }),
    );
  }
  register(payload: iRegisterRequest): Observable<tRegisterResponse> {
    return this.authHttpSE.register(payload);
  }
  refresh(): Observable<iLoginResponse> {
    return this.authHttpSE.refresh().pipe(
      tap((response) => {
        this.sessionSE.setAccessToken(response.token);
      }),
      catchError((err) => {
        this.sessionSE.clearSession();
        return throwError(() => err);
      }),
    );
  }
  logout(): Observable<void> {
    return this.authHttpSE.logout().pipe(
      finalize(() => {
        this.sessionSE.clearSession();
      }),
    );
  }
  getMe(): Observable<iUser> {
    return this.authHttpSE.getMe().pipe(
      tap((response) => {
        this.sessionSE.setUser(response);
      }),
      catchError((err) => {
        this.sessionSE.clearSession();
        return throwError(() => err);
      }),
    );
  }
}
