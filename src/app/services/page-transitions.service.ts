import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PageTransitionsService {
  private currentRoute = '';
  private isTransitioning = false;

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.setupRouterTransitions();
    }
  }

  private setupRouterTransitions(): void {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        if (this.currentRoute !== event.url) {
          this.triggerPageTransition(this.currentRoute, event.url);
          this.currentRoute = event.url;
        }
      });
  }

  private triggerPageTransition(fromRoute: string, toRoute: string): void {
    if (this.isTransitioning) return;

    this.isTransitioning = true;

    // Add smooth page transition overlay
    const overlay = this.createTransitionOverlay();

    // Animate out current content
    this.animatePageOut(() => {
      // Remove overlay after transition
      setTimeout(() => {
        overlay.remove();
        this.isTransitioning = false;
        this.animatePageIn();
      }, 300);
    });
  }

  private createTransitionOverlay(): HTMLElement {
    const overlay = document.createElement('div');
    overlay.className = 'page-transition-overlay';
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: var(--pure-white, #ffffff);
      z-index: 9999;
      transform: translateY(100%);
      transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
      pointer-events: none;
    `;

    document.body.appendChild(overlay);

    // Trigger animation
    requestAnimationFrame(() => {
      overlay.style.transform = 'translateY(0)';
    });

    return overlay;
  }

  private animatePageOut(callback: () => void): void {
    const mainContent = document.querySelector('main') || document.body;

    mainContent.style.transition = 'opacity 0.2s ease-out, transform 0.2s ease-out';
    mainContent.style.opacity = '0';
    mainContent.style.transform = 'scale(0.98)';

    setTimeout(callback, 200);
  }

  private animatePageIn(): void {
    const mainContent = document.querySelector('main') || document.body;

    mainContent.style.opacity = '0';
    mainContent.style.transform = 'scale(1.02)';

    requestAnimationFrame(() => {
      mainContent.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
      mainContent.style.opacity = '1';
      mainContent.style.transform = 'scale(1)';

      // Reset styles after animation
      setTimeout(() => {
        mainContent.style.transition = '';
        mainContent.style.transform = '';
      }, 600);
    });
  }

  // Method to trigger custom transition effects
  createCustomTransition(element: HTMLElement, type: 'fade' | 'slide' | 'scale' = 'fade'): Promise<void> {
    return new Promise((resolve) => {
      if (!isPlatformBrowser(this.platformId)) {
        resolve();
        return;
      }

      const duration = 400;
      const easing = 'cubic-bezier(0.16, 1, 0.3, 1)';

      switch (type) {
        case 'fade':
          element.style.transition = `opacity ${duration}ms ${easing}`;
          element.style.opacity = '0';
          setTimeout(() => {
            element.style.opacity = '1';
            setTimeout(resolve, duration);
          }, 50);
          break;

        case 'slide':
          element.style.transition = `transform ${duration}ms ${easing}`;
          element.style.transform = 'translateX(-20px)';
          setTimeout(() => {
            element.style.transform = 'translateX(0)';
            setTimeout(resolve, duration);
          }, 50);
          break;

        case 'scale':
          element.style.transition = `transform ${duration}ms ${easing}`;
          element.style.transform = 'scale(0.95)';
          setTimeout(() => {
            element.style.transform = 'scale(1)';
            setTimeout(resolve, duration);
          }, 50);
          break;
      }
    });
  }
}