import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { SessionService } from '../../features/auth/services/session.service';
import { AuthService } from '../../features/auth/services/auth.service';

export const accessGuard: CanActivateFn = () => {
  const sessionService = inject(SessionService);
  const authService = inject(AuthService);
  const router = inject(Router);

  if (sessionService.isAuthenticated()) {
    return true;
  }
  return authService.refresh().pipe(
    map(() => true),
    catchError(() => of(router.createUrlTree(['/login']))),
  );
};
