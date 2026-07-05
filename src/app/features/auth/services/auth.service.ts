import { AuthHttpService } from './auth-http.service';
import { inject, Injectable } from '@angular/core';
import { SessionService } from './session.service';
import { iLoginRequest, iLoginResponse } from '../models/iLogin';
import { iRefreshResponse } from '../models/iRefresh';
import { iRegisterRequest, tRegisterResponse } from '../models/iRegister';
import {
  catchError,
  finalize,
  Observable,
  of,
  shareReplay,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import { iUser } from '../models/iUser';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  /** INJECTORS */
  private readonly authHttpSE = inject(AuthHttpService);
  private readonly sessionSE = inject(SessionService);

  /** STATE */
  private refresh$: Observable<iRefreshResponse> | null = null;

  /** ACTIONS */
  login(payload: iLoginRequest): Observable<iLoginResponse> {
    return this.authHttpSE.login(payload).pipe(
      tap((response) => {
        this.sessionSE.setAccessToken(response.accessToken);
        this.sessionSE.setUser(response.user);
      }),
    );
  }
  register(payload: iRegisterRequest): Observable<tRegisterResponse> {
    return this.authHttpSE.register(payload);
  }
  refresh(): Observable<iRefreshResponse> {
    if (!this.refresh$) {
      this.refresh$ = this.authHttpSE.refresh().pipe(
        tap((response) => this.sessionSE.setAccessToken(response.accessToken)),
        catchError((err) => {
          this.sessionSE.clearSession();
          return throwError(() => err);
        }),
        finalize(() => (this.refresh$ = null)),
        shareReplay(1),
      );
    }
    return this.refresh$;
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
  restoreSession(): Observable<iUser | null> {
    return this.refresh().pipe(
      switchMap(() => this.getMe()),
      catchError(() => {
        return of(null);
      }),
    );
  }
}
