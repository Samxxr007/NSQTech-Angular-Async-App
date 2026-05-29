import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly THEME_KEY = 'mploychek_theme';
  public isDark = signal<boolean>(true);

  constructor() {
    this.initTheme();
  }

  private initTheme() {
    const saved = localStorage.getItem(this.THEME_KEY);
    if (saved === 'light') {
      this.isDark.set(false);
      document.body.classList.add('theme-light');
      document.body.classList.remove('theme-dark');
    } else {
      this.isDark.set(true);
      document.body.classList.add('theme-dark');
      document.body.classList.remove('theme-light');
    }
  }

  toggleTheme() {
    this.isDark.update(d => !d);
    if (this.isDark()) {
      localStorage.setItem(this.THEME_KEY, 'dark');
      document.body.classList.add('theme-dark');
      document.body.classList.remove('theme-light');
    } else {
      localStorage.setItem(this.THEME_KEY, 'light');
      document.body.classList.add('theme-light');
      document.body.classList.remove('theme-dark');
    }
  }
}
