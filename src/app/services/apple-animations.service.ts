import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

interface AnimationConfig {
  element: Element;
  animation: 'fadeInUp' | 'slideInLeft' | 'slideInRight' | 'scaleIn' | 'rotateIn' | 'parallax';
  delay?: number;
  duration?: number;
  easing?: string;
  callback?: () => void;
}

interface ParallaxConfig {
  element: HTMLElement;
  speed: number;
  direction: 'vertical' | 'horizontal';
}

@Injectable({
  providedIn: 'root'
})
export class AppleAnimationsService {
  private observer!: IntersectionObserver;
  private parallaxElements: ParallaxConfig[] = [];
  private isScrolling = false;
  private reducedMotion = false;

  // Apple's signature easing curves
  readonly APPLE_EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';
  readonly APPLE_SPRING = 'cubic-bezier(0.175, 0.885, 0.32, 1.275)';
  readonly APPLE_SMOOTH = 'cubic-bezier(0.4, 0, 0.2, 1)';

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      this.checkReducedMotion();
    }
  }

  private checkReducedMotion(): void {
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  initializeScrollAnimations(configs: AnimationConfig[]): void {
    if (!isPlatformBrowser(this.platformId) || this.reducedMotion) return;

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const config = configs.find(c => c.element === entry.target);
            if (config) {
              this.triggerAnimation(config);
              this.observer.unobserve(entry.target);
            }
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    configs.forEach(config => {
      this.observer.observe(config.element);
      this.prepareElement(config);
    });
  }

  private prepareElement(config: AnimationConfig): void {
    const element = config.element as HTMLElement;
    element.style.transition = `all ${config.duration || 0.8}s ${config.easing || this.APPLE_EASE}`;
    element.style.transitionDelay = `${config.delay || 0}s`;

    switch (config.animation) {
      case 'fadeInUp':
        element.style.opacity = '0';
        element.style.transform = 'translateY(50px)';
        break;
      case 'slideInLeft':
        element.style.opacity = '0';
        element.style.transform = 'translateX(-100px)';
        break;
      case 'slideInRight':
        element.style.opacity = '0';
        element.style.transform = 'translateX(100px)';
        break;
      case 'scaleIn':
        element.style.opacity = '0';
        element.style.transform = 'scale(0.8)';
        break;
      case 'rotateIn':
        element.style.opacity = '0';
        element.style.transform = 'rotateY(-15deg) scale(0.9)';
        break;
    }
  }

  private triggerAnimation(config: AnimationConfig): void {
    const element = config.element as HTMLElement;

    requestAnimationFrame(() => {
      element.style.opacity = '1';
      element.style.transform = 'translateY(0) translateX(0) scale(1) rotateY(0)';

      if (config.callback) {
        setTimeout(config.callback, (config.duration || 0.8) * 1000);
      }
    });
  }

  initializeParallax(configs: ParallaxConfig[]): void {
    if (!isPlatformBrowser(this.platformId) || this.reducedMotion) return;

    this.parallaxElements = configs;
    this.bindScrollEvents();
  }

  private bindScrollEvents(): void {
    let ticking = false;

    const updateParallax = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          this.updateParallaxElements();
          ticking = false;
        });
        ticking = true;
      }
    };

    // Listen to scroll on the Apple container instead of window
    const scrollContainer = document.querySelector('.apple-scroll-container');
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', updateParallax, { passive: true });
    } else {
      // Fallback to window scroll if container not found
      window.addEventListener('scroll', updateParallax, { passive: true });
    }
  }

  private updateParallaxElements(): void {
    // Get scroll from the Apple scroll container, not window
    const scrollContainer = document.querySelector('.apple-scroll-container') as HTMLElement;
    if (!scrollContainer) return;

    const scrollTop = scrollContainer.scrollTop;
    const containerHeight = scrollContainer.clientHeight;

    this.parallaxElements.forEach(config => {
      const rect = config.element.getBoundingClientRect();
      const elementTop = config.element.offsetTop;

      // Calculate relative position within the scroll container
      const relativeTop = elementTop - scrollTop;
      const elementCenter = relativeTop + rect.height / 2;
      const containerCenter = containerHeight / 2;

      // Calculate distance from center for parallax effect
      const distance = elementCenter - containerCenter;
      const rate = distance * config.speed;

      // Apply transform based on scroll position and speed
      if (config.direction === 'vertical') {
        config.element.style.transform = `translate3d(0, ${rate}px, 0)`;
      } else {
        config.element.style.transform = `translate3d(${rate}px, 0, 0)`;
      }

      config.element.style.willChange = 'transform';
    });
  }

  createHoverEffect(element: HTMLElement, type: 'lift' | 'scale' | 'glow' | 'rotate'): void {
    if (!isPlatformBrowser(this.platformId) || this.reducedMotion) return;

    element.style.transition = `all 0.3s ${this.APPLE_SMOOTH}`;
    element.style.cursor = 'pointer';

    const mouseEnter = () => {
      switch (type) {
        case 'lift':
          element.style.transform = 'translateY(-8px) scale(1.02)';
          element.style.boxShadow = '0 20px 40px rgba(0,0,0,0.1)';
          break;
        case 'scale':
          element.style.transform = 'scale(1.05)';
          break;
        case 'glow':
          element.style.boxShadow = '0 0 30px rgba(var(--primary-rgb), 0.3)';
          break;
        case 'rotate':
          element.style.transform = 'rotateY(5deg) scale(1.02)';
          break;
      }
    };

    const mouseLeave = () => {
      element.style.transform = 'translateY(0) scale(1) rotateY(0)';
      element.style.boxShadow = '';
    };

    element.addEventListener('mouseenter', mouseEnter);
    element.addEventListener('mouseleave', mouseLeave);
  }

  createMagneticButton(button: HTMLElement): void {
    if (!isPlatformBrowser(this.platformId) || this.reducedMotion) return;

    const strength = 50;
    let rect = button.getBoundingClientRect();

    const updateRect = () => {
      rect = button.getBoundingClientRect();
    };

    window.addEventListener('resize', updateRect);

    const mousemove = (e: MouseEvent) => {
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const distance = Math.sqrt(x * x + y * y);
      const maxDistance = Math.max(rect.width, rect.height);

      if (distance < maxDistance) {
        const moveX = (x / maxDistance) * strength;
        const moveY = (y / maxDistance) * strength;

        button.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.02)`;
      }
    };

    const mouseleave = () => {
      button.style.transform = 'translate(0px, 0px) scale(1)';
    };

    button.addEventListener('mousemove', mousemove);
    button.addEventListener('mouseleave', mouseleave);
  }

  createTextRevealAnimation(element: HTMLElement): void {
    if (!isPlatformBrowser(this.platformId) || this.reducedMotion) return;

    const text = element.textContent || '';
    const words = text.split(' ');

    element.innerHTML = words
      .map(word => `<span class="word" style="display: inline-block; opacity: 0; transform: translateY(20px); transition: all 0.5s ${this.APPLE_EASE};">${word}&nbsp;</span>`)
      .join('');

    const wordElements = element.querySelectorAll('.word');

    let delay = 0;
    wordElements.forEach((word) => {
      setTimeout(() => {
        (word as HTMLElement).style.opacity = '1';
        (word as HTMLElement).style.transform = 'translateY(0)';
      }, delay);
      delay += 100;
    });
  }

  // Simplified: No fixed viewport, no continuous scroll handlers
  // Apple.com uses CSS transforms and one-time Intersection Observer triggers only

  destroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}