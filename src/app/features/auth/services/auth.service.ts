import { inject, Service } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import {
  catchError,
  filter,
  finalize,
  Observable,
  of,
  pairwise,
  shareReplay,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import { TabSyncService } from '../../../core/services/tab-sync.service';
import { routePaths } from '../../../shared/util/route-paths';
import { LoginRequest, LoginResponse } from '../models/login';
import { RefreshResponse } from '../models/refresh';
import { RegisterRequest, RegisterResponse } from '../models/register';
import { User } from '../models/user';
import { AuthHttpService } from './auth-http.service';
import { SessionService } from './session.service';

@Service()
export class AuthService {
  /** INJECTORS */
  private readonly authHttpService = inject(AuthHttpService);
  private readonly sessionService = inject(SessionService);
  private readonly tabSyncService = inject(TabSyncService);
  private readonly router = inject(Router);

  /** STATE */
  private refresh$: Observable<RefreshResponse> | null = null;

  constructor() {
    toObservable(this.sessionService.user)
      .pipe(
        pairwise(),
        filter(([prev, curr]) => curr === null && prev !== null),
        takeUntilDestroyed(),
      )
      .subscribe(() => this.router.navigateByUrl(routePaths.login));

    this.tabSyncService.incoming
      .pipe(
        filter(value => value.type === 'logout'),
        takeUntilDestroyed(),
      )
      .subscribe(() => {
        this.sessionService.clearSession();
      });
  }

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
      tap(() => {
        this.sessionService.clearSession();
        this.tabSyncService.send({ type: 'logout' });
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
