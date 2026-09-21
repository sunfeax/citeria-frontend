import { DOCUMENT } from '@angular/common';
import { effect, inject, Injectable, signal } from '@angular/core';

export type Theme = 'dark' | 'light';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  document = inject(DOCUMENT);
  theme = signal<Theme>(this.getInitialTheme());

  constructor() {
    effect(() => {
      const theme = this.theme();
      const root = this.document.documentElement;
      root.dataset['theme'] = theme;
      root.style.colorScheme = theme;
      localStorage.setItem('theme', this.theme());
    });
  }

  toggle(): void {
    this.theme.update(currentTheme => (currentTheme === 'dark' ? 'light' : 'dark'));
  }

  getInitialTheme(): Theme {
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme === 'dark') {
      return 'dark';
    } else if (savedTheme === 'light') {
      return 'light';
    } else {
      return 'dark';
    }
  }
}
