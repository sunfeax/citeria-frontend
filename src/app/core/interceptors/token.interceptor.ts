import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { SessionService } from '../../features/auth/services/session.service';
import { IS_PUBLIC_ENDPOINT } from '../config/http-context';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const sessionService = inject(SessionService);
  const token = sessionService.getAccessToken();
  const newReq =
    token && !req.context.get(IS_PUBLIC_ENDPOINT)
      ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
      : req;

  return next(newReq);
};
