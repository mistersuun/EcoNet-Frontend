import { Injectable, inject } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private transloco = inject(TranslocoService);
  private readonly LANGUAGE_KEY = 'econet_language';

  constructor() {
    this.initializeLanguage();
  }

  private initializeLanguage() {
    const savedLanguage = this.getSavedLanguage();
    const defaultLanguage = savedLanguage || 'fr';
    this.transloco.setActiveLang(defaultLanguage);
  }

  switchLanguage(lang: 'fr' | 'en') {
    this.transloco.setActiveLang(lang);
    this.saveLanguage(lang);

    // Refresh the page to apply language changes
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        window.location.reload();
      }, 800); // Wait for loader animation to show
    }
  }

  getCurrentLanguage(): 'fr' | 'en' {
    return this.transloco.getActiveLang() as 'fr' | 'en';
  }

  private saveLanguage(lang: string) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.LANGUAGE_KEY, lang);
    }
  }

  private getSavedLanguage(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(this.LANGUAGE_KEY);
    }
    return null;
  }
}