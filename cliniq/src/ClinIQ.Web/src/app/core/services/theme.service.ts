import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { StorageService } from './storage.service';

export type ThemeMode = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly STORAGE_KEY = 'medicorex_theme';
  private themeSubject = new BehaviorSubject<ThemeMode>(this.getStoredTheme());

  theme$ = this.themeSubject.asObservable();

  constructor(private storage: StorageService) {
    this.applyTheme(this.themeSubject.value);
  }

  get currentTheme(): ThemeMode {
    return this.themeSubject.value;
  }

  get isDark(): boolean {
    return this.themeSubject.value === 'dark';
  }

  toggleTheme(): void {
    const next = this.themeSubject.value === 'light' ? 'dark' : 'light';
    this.setTheme(next);
  }

  setTheme(theme: ThemeMode): void {
    this.themeSubject.next(theme);
    this.storage.setItem(this.STORAGE_KEY, theme);
    this.applyTheme(theme);
  }

  private getStoredTheme(): ThemeMode {
    const stored = this.storage.getItem(this.STORAGE_KEY);
    if (stored === 'dark' || stored === 'light') return stored;

    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  }

  private applyTheme(theme: ThemeMode): void {
    if (typeof document === 'undefined') return;
    const body = document.body;
    body.classList.remove('light-theme', 'dark-theme');
    body.classList.add(`${theme}-theme`);
    document.documentElement.setAttribute('data-theme', theme);
  }
}
