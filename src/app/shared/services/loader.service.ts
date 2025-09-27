import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  private loadingTextSubject = new BehaviorSubject<string>('Chargement...');

  public readonly isLoading$: Observable<boolean> = this.isLoadingSubject.asObservable();
  public readonly loadingText$: Observable<string> = this.loadingTextSubject.asObservable();

  constructor() {}

  /**
   * Show the loader with optional custom text
   */
  show(text?: string): void {
    if (text) {
      this.loadingTextSubject.next(text);
    }
    this.isLoadingSubject.next(true);
  }

  /**
   * Hide the loader
   */
  hide(): void {
    this.isLoadingSubject.next(false);
  }

  /**
   * Show loader for a specific duration
   */
  showFor(duration: number, text?: string): void {
    this.show(text);
    setTimeout(() => {
      this.hide();
    }, duration);
  }

  /**
   * Show loader for language change
   */
  showLanguageChange(newLang: 'fr' | 'en'): void {
    const text = newLang === 'fr'
      ? 'Changement de langue...'
      : 'Changing language...';
    this.show(text);

    // Hide after a longer delay to allow for translation loading
    setTimeout(() => {
      this.hide();
    }, 1500);
  }

  /**
   * Show loader for page navigation
   */
  showPageLoad(pageName?: string): void {
    let text = 'Chargement...';
    if (pageName) {
      text = `Chargement ${pageName}...`;
    }
    this.show(text);
  }

  /**
   * Get current loading state
   */
  get isLoading(): boolean {
    return this.isLoadingSubject.value;
  }
}