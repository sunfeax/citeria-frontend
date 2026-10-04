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
import { LoginRequest, LoginResponse } from '../models/login';
import { RefreshResponse } from '../models/refresh';
import { RegisterRequest, RegisterResponse } from '../models/register';
import { User } from '../models/user';
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
  private refresh$: Observable<RefreshResponse> | null = null;

  /** ACTIONS */
  login(payload: LoginRequest): Observable<LoginResponse> {
    return this.authHttpService.login(payload).pipe(
      tap(response => {
        this.sessionService.setAccessToken(response.accessToken);
        this.sessionService.setUser(response.user);
      }),
    );
  }
  register(payload: RegisterRequest): Observable<RegisterResponse> {
    return this.authHttpService.register(payload);
  }
  refresh(): Observable<RefreshResponse> {
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
  getMe(): Observable<User> {
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
  restoreSession(): Observable<User | null> {
    return this.refresh().pipe(
      switchMap(() => this.getMe()),
      catchError(() => {
        return of(null);
      }),
    );
  }
}
