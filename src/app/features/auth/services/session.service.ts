import { computed, Injectable, signal } from '@angular/core';
import { iUser } from '../models/iUser';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  /** STATE */
  private readonly accessToken = signal<string | null>(null);
  private readonly currentUser = signal<iUser | null>(null);

  readonly isAuthenticated = computed(() => !!this.accessToken());
  readonly user = computed(() => this.currentUser());

  /** ACTIONS */
  getAccessToken(): string | null {
    return this.accessToken();
  }
  setAccessToken(token: string): void {
    this.accessToken.set(token);
  }
  clearSession(): void {
    this.accessToken.set(null);
    this.currentUser.set(null);
  }
  setUser(user: iUser): void {
    this.currentUser.set(user);
  }
}
