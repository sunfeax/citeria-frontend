import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SessionService } from '../../features/auth/services/session.service';
import { routePaths } from '../../shared/util/route-paths';

export const accessGuard: CanActivateFn = () => {
  const sessionService = inject(SessionService);
  const router = inject(Router);

  if (sessionService.user()) {
    return true;
  }

  return router.parseUrl(routePaths.login);
};
