import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MAT_ICON_DEFAULT_OPTIONS } from '@angular/material/icon';
import { provideRouter, Router } from '@angular/router';

import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { catchError, filter, of } from 'rxjs';
import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { TabSyncService } from './core/services/tab-sync.service';
import { AuthService } from './features/auth/services/auth.service';
import { SessionService } from './features/auth/services/session.service';
import { routePaths } from './shared/util/route-paths';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    {
      provide: MAT_ICON_DEFAULT_OPTIONS,
      useValue: { fontSet: 'material-symbols-outlined' },
    },
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'outline', hideRequiredMarker: true },
    },
    provideAppInitializer(() => {
      const authService = inject(AuthService);
      return authService.restoreSession().pipe(catchError(() => of(null)));
    }),
    provideAppInitializer(() => {
      const sessionService = inject(SessionService);
      const tabSyncService = inject(TabSyncService);
      const router = inject(Router);

      tabSyncService.incoming
        .pipe(filter(value => value.type === 'logout'))
        .subscribe(() => {
          sessionService.clearSession();
          router.navigateByUrl(routePaths.login);
        });
    }),
  ],
};
