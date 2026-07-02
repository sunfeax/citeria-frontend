import { computed, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  /** STATE */
  private readonly accessToken = signal<string | null>(null);

  readonly isAuthenticated = computed(() => !!this.accessToken());

  /** ACTIONS */
  getAccessToken(): string | null {
    return this.accessToken();
  }

  setAccessToken(token: string): void {
    this.accessToken.set(token);
  }

  clearSession(): void {
    this.accessToken.set(null);
  }
}
