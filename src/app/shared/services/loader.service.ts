import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  private loadingTextSubject = new BehaviorSubject<string>('Chargement...');
  private requestCount = 0;
  private minDisplayTime = 300; // Minimum ms to show loader (prevents flicker)
  private loadingStartTime = 0;

  public readonly isLoading$: Observable<boolean> = this.isLoadingSubject.asObservable();
  public readonly loadingText$: Observable<string> = this.loadingTextSubject.asObservable();

  constructor() {}

  /**
   * Show the loader with optional custom text
   * Increments request counter for HTTP interceptor usage
   */
  show(text?: string): void {
    this.requestCount++;

    if (text) {
      this.loadingTextSubject.next(text);
    }

    if (!this.isLoadingSubject.value) {
      this.loadingStartTime = Date.now();
      this.isLoadingSubject.next(true);
    }
  }

  /**
   * Hide the loader
   * Decrements request counter and only hides when counter reaches 0
   */
  hide(): void {
    if (this.requestCount > 0) {
      this.requestCount--;
    }

    // Only hide when no pending requests
    if (this.requestCount === 0) {
      const elapsedTime = Date.now() - this.loadingStartTime;
      const remainingTime = Math.max(0, this.minDisplayTime - elapsedTime);

      // Ensure loader shows for minimum duration to prevent flicker
      setTimeout(() => {
        this.isLoadingSubject.next(false);
        this.loadingTextSubject.next('Chargement...');
      }, remainingTime);
    }
  }

  /**
   * Force hide the loader immediately (resets counter)
   * Use with caution - for error recovery scenarios
   */
  forceHide(): void {
    this.requestCount = 0;
    this.isLoadingSubject.next(false);
    this.loadingTextSubject.next('Chargement...');
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

    // Hide after brief delay to allow for translation loading
    setTimeout(() => {
      this.hide();
    }, 600);
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
   * Show loader for HTTP requests (used by interceptor)
   */
  showHttpRequest(url?: string): void {
    this.show('Chargement des données...');
  }

  /**
   * Get current loading state
   */
  get isLoading(): boolean {
    return this.isLoadingSubject.value;
  }

  /**
   * Get current request count (for debugging)
   */
  get activeRequests(): number {
    return this.requestCount;
  }
}