import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { SessionService } from '../../features/auth/services/session.service';
import { AuthService } from '../../features/auth/services/auth.service';

export const accessGuard: CanActivateFn = () => {
  const sessionSE = inject(SessionService);
  const authSE = inject(AuthService);
  const router = inject(Router);

  if (sessionSE.isAuthenticated()) {
    return true;
  }
  return authSE.refresh().pipe(
    map(() => true),
    catchError(() => of(router.createUrlTree(['/login']))),
  );
};
