import { inject, Injectable } from '@angular/core';
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
import { iLoginRequest, iLoginResponse } from '../models/login';
import { iRefreshResponse } from '../models/refresh';
import { iRegisterRequest, tRegisterResponse } from '../models/register';
import { iUser } from '../models/user';
import { AuthHttpService } from './auth-http.service';
import { SessionService } from './session.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  /** INJECTORS */
  private readonly authHttpService = inject(AuthHttpService);
  private readonly sessionService = inject(SessionService);

  /** STATE */
  private refresh$: Observable<iRefreshResponse> | null = null;

  /** ACTIONS */
  login(payload: iLoginRequest): Observable<iLoginResponse> {
    return this.authHttpService.login(payload).pipe(
      tap(response => {
        this.sessionService.setAccessToken(response.accessToken);
        this.sessionService.setUser(response.user);
      }),
    );
  }
  register(payload: iRegisterRequest): Observable<tRegisterResponse> {
    return this.authHttpService.register(payload);
  }
  refresh(): Observable<iRefreshResponse> {
    if (!this.refresh$) {
      this.refresh$ = this.authHttpService.refresh().pipe(
        tap(response => this.sessionService.setAccessToken(response.accessToken)),
        catchError(err => {
          this.sessionService.clearSession();
          return throwError(() => err);
        }),
        finalize(() => (this.refresh$ = null)),
        shareReplay(1),
      );
    }
    return this.refresh$;
  }

  logout(): Observable<void> {
    return this.authHttpService.logout().pipe(
      finalize(() => {
        this.sessionService.clearSession();
      }),
    );
  }
  getMe(): Observable<iUser> {
    return this.authHttpService.getMe().pipe(
      tap(response => {
        this.sessionService.setUser(response);
      }),
      catchError(err => {
        this.sessionService.clearSession();
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
