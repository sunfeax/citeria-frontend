import { DestroyRef, inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { BroadcastMessage } from '../models/broadcast-message';

@Service()
export class TabSyncService {
  private readonly channel = new BroadcastChannel('app');

  incoming = new Observable<BroadcastMessage>(subscriber => {
    const handler = (event: MessageEvent<BroadcastMessage>) =>
      subscriber.next(event.data);

    this.channel.addEventListener('message', handler);

    return () => this.channel.removeEventListener('message', handler);
  });

  constructor() {
    inject(DestroyRef).onDestroy(() => this.channel.close());
  }

  send(msg: BroadcastMessage): void {
    this.channel.postMessage(msg);
  }
}
