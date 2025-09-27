import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ScrollAnimationService {
  private observer!: IntersectionObserver;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  initializeAnimations(elements: { element: Element, callback: () => void }[]) {
    if (!isPlatformBrowser(this.platformId)) return;

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const targetElement = elements.find(e => e.element === entry.target);
            if (targetElement) {
              targetElement.callback();
            }
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    elements.forEach(({ element }) => {
      this.observer.observe(element);
    });
  }

  destroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}