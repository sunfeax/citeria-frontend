import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { SessionService } from '../../features/auth/services/session.service';
import { AuthService } from '../../features/auth/services/auth.service';

const AUTH_ENDPOINTS = ['/auth/login', '/auth/register', '/auth/refresh', '/auth/logout'];

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const sessionSE = inject(SessionService);
  const authSE = inject(AuthService);

  const isAuthEndpoint = AUTH_ENDPOINTS.some((url) => req.url.includes(url));

  const token = sessionSE.getAccessToken();
  const authReq = token && !isAuthEndpoint
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(authReq).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 401 && !isAuthEndpoint) {
        return authSE.refresh().pipe(
          switchMap((response) => {
            const retryReq = req.clone({
              setHeaders: { Authorization: `Bearer ${response.token}` },
            });
            return next(retryReq);
          })
        );
      }

      return throwError(() => err);
    })
  );
};
