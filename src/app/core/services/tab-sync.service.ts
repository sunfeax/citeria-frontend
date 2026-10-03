import { DestroyRef, inject, Service } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from '../../features/auth/services/session.service';
import { routes } from '../../shared/util/routes';

@Service()
export class TabSyncService {
  private readonly channel = new BroadcastChannel('app');

  private readonly sessionService = inject(SessionService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    this.channel.onmessage = (event: MessageEvent) => {
      if (event.data === 'logout') {
        this.sessionService.clearSession();
        this.router.navigateByUrl(routes.login);
      }
    };
    this.destroyRef.onDestroy(() => this.channel.close());
  }

  send(msg: string): void {
    this.channel.postMessage(msg);
  }
}
