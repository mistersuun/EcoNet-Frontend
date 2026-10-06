import { Directive, ElementRef, Injectable, NgZone, OnDestroy, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * One rAF-throttled scroll loop shared by every [scrollFx] element.
 *
 * Each element gets CSS custom properties that styles can animate from:
 *   --progress  0 → 1 while the element travels from the bottom of the viewport
 *               until its bottom edge leaves the top (full pass).
 *   --enter     0 → 1 while its top edge moves from the viewport bottom to the middle.
 *   --sticky    0 → 1 across the element's own scroll length (for tall sections
 *               with a position: sticky child): 0 when its top hits the viewport top,
 *               1 when its bottom reaches the viewport bottom.
 *   --exit      0 → 1 as the element scrolls up out of view (0 while its top is at
 *               or below the viewport top).
 * and the class `is-visible` the first time it enters the viewport.
 *
 * With prefers-reduced-motion every value is pinned to 1 and nothing listens to scroll.
 */
@Injectable({ providedIn: 'root' })
export class ScrollFxService {
  private zone = inject(NgZone);
  private elements = new Set<HTMLElement>();
  private active = new Set<HTMLElement>();
  private observer?: IntersectionObserver;
  private ticking = false;
  private listening = false;
  readonly reducedMotion = typeof window !== 'undefined'
    && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  register(el: HTMLElement): void {
    if (this.reducedMotion) {
      for (const v of ['--progress', '--enter', '--sticky']) el.style.setProperty(v, '1');
      el.style.setProperty('--exit', '0');
      el.classList.add('is-visible');
      return;
    }
    this.ensureListening();
    this.elements.add(el);
    this.observer!.observe(el);
    this.measure(el);
  }

  unregister(el: HTMLElement): void {
    this.elements.delete(el);
    this.active.delete(el);
    this.observer?.unobserve(el);
    if (this.elements.size === 0) this.stopListening();
  }

  private ensureListening(): void {
    if (this.listening) return;
    this.listening = true;
    this.observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        const el = entry.target as HTMLElement;
        if (entry.isIntersecting) {
          this.active.add(el);
          el.classList.add('is-visible');
        } else {
          this.active.delete(el);
          this.measure(el); // settle at 0 or 1 when it leaves
        }
      }
    }, { rootMargin: '0px 0px -8% 0px' });

    // Scroll work never needs Angular change detection.
    this.zone.runOutsideAngular(() => {
      window.addEventListener('scroll', this.onScroll, { passive: true });
      window.addEventListener('resize', this.onScroll, { passive: true });
    });
  }

  private stopListening(): void {
    window.removeEventListener('scroll', this.onScroll);
    window.removeEventListener('resize', this.onScroll);
    this.observer?.disconnect();
    this.observer = undefined;
    this.listening = false;
  }

  private onScroll = (): void => {
    if (this.ticking) return;
    this.ticking = true;
    requestAnimationFrame(() => {
      this.active.forEach(el => this.measure(el));
      this.ticking = false;
    });
  };

  private measure(el: HTMLElement): void {
    const vh = window.innerHeight;
    const r = el.getBoundingClientRect();
    const clamp = (n: number) => Math.min(1, Math.max(0, n));
    const progress = clamp((vh - r.top) / (vh + r.height));
    const enter = clamp((vh - r.top) / (vh / 2));
    const stickyLen = r.height - vh;
    const sticky = stickyLen > 0 ? clamp(-r.top / stickyLen) : progress;
    el.style.setProperty('--progress', progress.toFixed(4));
    el.style.setProperty('--enter', enter.toFixed(4));
    el.style.setProperty('--sticky', sticky.toFixed(4));
    el.style.setProperty('--exit', clamp(-r.top / r.height).toFixed(4));
  }
}

@Directive({
  selector: '[scrollFx]',
  standalone: true
})
export class ScrollFxDirective implements OnInit, OnDestroy {
  private el = inject(ElementRef<HTMLElement>);
  private fx = inject(ScrollFxService);
  private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  ngOnInit(): void {
    if (this.isBrowser) this.fx.register(this.el.nativeElement);
  }

  ngOnDestroy(): void {
    if (this.isBrowser) this.fx.unregister(this.el.nativeElement);
  }
}

/**
 * Keep `--header-h` on `host` equal to the fixed site header's height (it changes per
 * breakpoint), so sticky elements can sit right below it. Returns a cleanup function.
 */
export function observeHeaderHeight(host: HTMLElement): () => void {
  const header = document.querySelector<HTMLElement>('.header');
  if (!header || typeof ResizeObserver === 'undefined') return () => {};
  const ro = new ResizeObserver(() => host.style.setProperty('--header-h', `${header.offsetHeight}px`));
  ro.observe(header);
  return () => ro.disconnect();
}
