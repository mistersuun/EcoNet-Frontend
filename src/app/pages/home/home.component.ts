import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnDestroy, PLATFORM_ID, ViewChild, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { map } from 'rxjs';
import { IconComponent } from '../../shared/components/icon.component';
import { ScrollFxDirective, ScrollFxService, observeHeaderHeight } from '../../shared/scroll-fx.directive';
import { FREQUENCY_DISCOUNTS, SERVICE_PRICES } from '../../shared/pricing';

const IMG = (id: string, w: number, h: number) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&auto=format&q=80`;

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, TranslocoPipe, IconComponent, ScrollFxDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Hero copy: drifts up and fades as you leave it -->
    <section class="hero" scrollFx>
      <div class="hero-copy">
        <p class="ui-eyebrow">{{ 'HOME.HERO.BADGE' | transloco }}</p>
        <h1 class="hero-title">
          {{ 'HOME.HERO.TITLE' | transloco }}
          <span class="accent">{{ 'HOME.HERO.TITLE_ACCENT' | transloco }}</span>
        </h1>
        <p class="hero-subtitle">{{ 'HOME.HERO.SUBTITLE' | transloco }}</p>
        <div class="ui-actions">
          <a routerLink="/booking" class="ui-pill">{{ 'HOME.HERO.CTA_BUTTON' | transloco }}</a>
          <a routerLink="/pricing" class="ui-link">
            {{ 'HOME.HERO.SECONDARY' | transloco }} <app-icon name="chevron-right" [size]="16" [stroke]="2.25" />
          </a>
        </div>
      </div>
    </section>

    <!-- Photo grows from an inset card to full bleed; two cards float up over it at different speeds -->
    <section class="hero-media" scrollFx>
      <div class="hero-media-sticky">
        <div class="hero-media-frame">
          <img [src]="img.hero" [alt]="'HOME.ALT_TEXTS.HERO_IMAGE' | transloco" fetchpriority="high">
        </div>
        <div class="float-card fc-1" aria-hidden="true">
          <app-icon name="leaf" [size]="20" /> {{ 'HOME.HERO_CARDS.ECO' | transloco }}
        </div>
        <div class="float-card fc-2" aria-hidden="true">
          <app-icon name="clock" [size]="20" /> {{ 'HOME.HERO_CARDS.RESPONSE' | transloco }}
        </div>
      </div>
    </section>

    <!-- Statement: words light up one by one -->
    <section class="statement" scrollFx>
      <div class="statement-sticky">
        <p class="statement-text" [style.--n]="statementWords().length">
          @for (word of statementWords(); track $index) {
            <span [style.--i]="$index">{{ word }} </span>
          }
        </p>
      </div>
    </section>

    <!-- Cities: two oversized rows sliding in opposite directions with the scroll -->
    <section class="areas" scrollFx [attr.aria-label]="'HOME.AREAS_LABEL' | transloco">
      @for (row of [0, 1]; track row) {
        <div class="marquee" [class.reverse]="row === 1" aria-hidden="true">
          @for (city of marqueeCities; track $index) {
            <span class="city">{{ 'FOOTER.SERVICE_AREAS.' + city | transloco }}</span>
            <app-icon name="leaf" class="sep" [size]="28" [stroke]="1.5" />
          }
        </div>
      }
      <ul class="sr-only">
        @for (city of cities; track city) { <li>{{ 'FOOTER.SERVICE_AREAS.' + city | transloco }}</li> }
      </ul>
    </section>

    <!-- Products: the photo opens through a growing mask -->
    <section class="ui-section alt">
      <div class="ui-wrap split">
        <div class="split-media ui-mask" scrollFx>
          <img [src]="img.products" [alt]="'HOME.ALT_TEXTS.PRODUCTS_IMAGE' | transloco" loading="lazy">
        </div>
        <div class="split-copy ui-reveal" scrollFx>
          <p class="ui-eyebrow">{{ 'HOME.PRODUCTS.EYEBROW' | transloco }}</p>
          <h2 class="ui-title">
            {{ 'HOME.PRODUCTS.TITLE' | transloco }}
            <span class="muted">{{ 'HOME.PRODUCTS.TITLE_ACCENT' | transloco }}</span>
          </h2>
          <p class="ui-lead">{{ 'HOME.PRODUCTS.DESCRIPTION' | transloco }}</p>
          <ul class="feature-list">
            <li><app-icon name="leaf" [size]="22" />{{ 'HOME.PRODUCTS.FEATURES.BIODEGRADABLE' | transloco }}</li>
            <li><app-icon name="heart" [size]="22" />{{ 'HOME.PRODUCTS.FEATURES.NON_TOXIC' | transloco }}</li>
            <li><app-icon name="droplet" [size]="22" />{{ 'HOME.PRODUCTS.FEATURES.ZERO_RESIDUE' | transloco }}</li>
          </ul>
        </div>
      </div>
    </section>

    <!-- Services: section pins and vertical scroll moves the cards sideways -->
    <section class="gallery" scrollFx #gallery [class.pinned]="pinned()"
             [style.height]="pinned() ? 'calc(100vh + ' + overflow() + 'px)' : null">
      <div class="gallery-sticky">
        <header class="ui-wrap gallery-head">
          <div>
            <p class="ui-eyebrow">{{ 'HOME.GALLERY.EYEBROW' | transloco }}</p>
            <h2 class="ui-title">{{ 'HOME.GALLERY.TITLE' | transloco }}</h2>
          </div>
          <span class="gallery-progress" aria-hidden="true"><span></span></span>
        </header>
        <div class="gallery-viewport">
          <div class="gallery-track" #track [style.--shift]="overflow() + 'px'">
            @for (card of services; track card.key) {
              <a [routerLink]="card.link" class="g-card">
                <img [src]="card.image" alt="" loading="lazy">
                <div class="g-copy">
                  <h3>{{ card.title | transloco }}</h3>
                  <p>{{ card.description | transloco }}</p>
                  <span class="g-price">
                    @if (card.from) {
                      {{ 'HOME.GALLERY.FROM' | transloco }} <strong>{{ card.from }}&nbsp;$</strong>
                    } @else {
                      {{ 'HOME.GALLERY.QUOTE' | transloco }}
                    }
                    <app-icon name="arrow-right" [size]="18" [stroke]="2" />
                  </span>
                </div>
              </a>
            }
            <a routerLink="/pricing" class="g-card g-dark">
              <span class="g-big">−{{ weeklyDiscount }}&nbsp;%</span>
              <div class="g-copy">
                <h3>{{ 'HOME.SERVICES.RECURRING.TITLE' | transloco }}</h3>
                <p>{{ 'HOME.SERVICES.RECURRING.DESCRIPTION' | transloco }}</p>
                <span class="g-price">{{ 'HOME.SERVICES.LEARN_MORE' | transloco }} <app-icon name="arrow-right" [size]="18" [stroke]="2" /></span>
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- How it works: cards pin and stack; each one shrinks and dims as the next covers it -->
    <section class="ui-section alt steps">
      <div class="ui-wrap">
        <header class="ui-head ui-reveal" scrollFx>
          <p class="ui-eyebrow">{{ 'HOME.STEPS.EYEBROW' | transloco }}</p>
          <h2 class="ui-title">{{ 'HOME.STEPS.TITLE' | transloco }}</h2>
        </header>
        <ol class="stack" scrollFx [style.--n]="steps.length">
          @for (step of steps; track step.key; let i = $index) {
            <li class="stack-card" [class]="'tone-' + i" [style.--i]="i">
              <span class="stack-num">{{ i + 1 }}</span>
              <div class="stack-copy">
                <app-icon [name]="step.icon" [size]="36" [stroke]="1.5" />
                <h3>{{ 'HOME.STEPS.' + step.key + '.TITLE' | transloco }}</h3>
                <p>{{ 'HOME.STEPS.' + step.key + '.DESCRIPTION' | transloco }}</p>
              </div>
            </li>
          }
        </ol>
      </div>
    </section>

    <section class="ui-cta" scrollFx>
      <div class="ui-wrap ui-cta-inner">
        <h2 class="ui-cta-title">{{ 'HOME.CTA.TITLE' | transloco }}</h2>
        <p class="ui-cta-subtitle">{{ 'HOME.CTA.SUBTITLE' | transloco }}</p>
        <div class="ui-actions center">
          <a routerLink="/booking" class="ui-pill light">{{ 'HOME.CTA.GET_QUOTE' | transloco }}</a>
          <a routerLink="/contact" class="ui-link light">
            {{ 'HOME.CTA.DISCOVER_SERVICES' | transloco }} <app-icon name="chevron-right" [size]="16" [stroke]="2.25" />
          </a>
        </div>
      </div>
    </section>
  `,
  styles: [`
    :host { display: block; color: var(--ui-ink); background: #fff; }
    .sr-only {
      position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
      overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0;
    }

    /* ---------- hero ---------- */
    .hero {
      padding: clamp(150px, 20vh, 220px) 24px clamp(40px, 6vh, 72px);
      text-align: center; background: #fff;
    }
    .hero-copy {
      max-width: 900px; margin: 0 auto;
      opacity: calc(1 - var(--exit, 0) * 1.6);
      transform: translateY(calc(var(--exit, 0) * -80px));
      animation: ui-rise 1.1s var(--ui-ease) backwards;
    }
    .hero-title {
      font-size: clamp(3rem, 8.5vw, 6.5rem); font-weight: 600; line-height: 0.98;
      letter-spacing: -0.045em; margin: 0 0 28px; color: var(--ui-ink);
    }
    .hero-title .accent { display: block; color: var(--ui-green-deep); }
    .hero-subtitle {
      font-size: clamp(1.125rem, 2vw, 1.375rem); line-height: 1.5; color: var(--ui-muted);
      max-width: 600px; margin: 0 auto 36px;
    }
    .hero .ui-actions { justify-content: center; }

    .hero-media { height: 180vh; position: relative; }
    .hero-media-sticky {
      position: sticky; top: 0; height: 100vh; overflow: hidden;
      display: flex; align-items: center; justify-content: center;
    }
    .hero-media-frame {
      width: 100%; height: 100%;
      clip-path: inset(calc((1 - var(--sticky, 0)) * 14vh) calc((1 - var(--sticky, 0)) * 12vw)
                       round calc((1 - var(--sticky, 0)) * 36px));
      will-change: clip-path;
    }
    .hero-media-frame img {
      width: 100%; height: 100%; object-fit: cover; display: block;
      transform: scale(calc(1.2 - var(--sticky, 0) * 0.2));
      will-change: transform;
    }
    .float-card {
      position: absolute; display: inline-flex; align-items: center; gap: 10px;
      padding: 14px 20px; border-radius: 18px;
      background: rgba(255, 255, 255, 0.86);
      backdrop-filter: saturate(180%) blur(18px); -webkit-backdrop-filter: saturate(180%) blur(18px);
      box-shadow: 0 20px 40px -24px rgba(16, 32, 26, 0.45);
      font-size: 1rem; font-weight: 600; color: var(--ui-green-ink);
      opacity: clamp(0, calc(var(--sticky, 0) * 2.5 - 0.2), 1);
      will-change: transform;
    }
    .float-card app-icon { color: var(--ui-green-deep); }
    /* the two cards travel at different speeds, which reads as depth */
    .fc-1 { left: 16vw; bottom: 18vh; transform: translateY(calc((1 - var(--sticky, 0)) * 34vh)); }
    .fc-2 { right: 15vw; top: 24vh; transform: translateY(calc((1 - var(--sticky, 0)) * 60vh)); }

    /* ---------- statement ---------- */
    .statement { height: 200vh; position: relative; }
    .statement-sticky {
      position: sticky; top: 0; height: 100vh;
      display: flex; align-items: center; justify-content: center; padding: 0 24px;
    }
    .statement-text {
      max-width: 1000px; margin: 0; text-align: center; color: var(--ui-ink);
      font-size: clamp(1.875rem, 5vw, 4rem); font-weight: 600; line-height: 1.12; letter-spacing: -0.03em;
    }
    .statement-text span {
      opacity: clamp(0.12, calc((var(--sticky, 0) * 1.25 * var(--n) - var(--i))), 1);
      transition: opacity 0.15s linear;
    }

    /* ---------- cities marquee ---------- */
    .areas { padding: clamp(40px, 8vw, 96px) 0; overflow: hidden; background: #fff; }
    .marquee {
      display: flex; align-items: center; gap: clamp(20px, 3vw, 48px); white-space: nowrap; width: max-content;
      transform: translate3d(calc(var(--progress, 0.5) * -35%), 0, 0);
      will-change: transform;
    }
    .marquee.reverse { transform: translate3d(calc(-35% + var(--progress, 0.5) * 35%), 0, 0); margin-top: 8px; }
    .city {
      font-size: clamp(3.25rem, 10vw, 9rem); font-weight: 600; letter-spacing: -0.05em; line-height: 1.05;
      color: var(--ui-ink);
    }
    .marquee.reverse .city { color: transparent; -webkit-text-stroke: 1.5px var(--ui-green); }
    .sep { color: var(--ui-green); }

    /* ---------- products ---------- */
    .split { display: grid; grid-template-columns: 1.1fr 1fr; gap: clamp(40px, 7vw, 96px); align-items: center; }
    .split-media { position: relative; aspect-ratio: 4 / 5; overflow: hidden; border-radius: 32px; }
    .feature-list { list-style: none; margin: 36px 0 0; padding: 0; display: grid; gap: 18px; }
    .feature-list li { display: flex; align-items: center; gap: 14px; font-size: 1.125rem; font-weight: 500; }
    .feature-list app-icon { color: var(--ui-green-deep); }

    /* ---------- horizontal services gallery ---------- */
    .gallery { position: relative; background: #fff; }
    .gallery-sticky { padding: clamp(80px, 10vw, 120px) 0 clamp(60px, 8vw, 96px); }
    .gallery.pinned .gallery-sticky {
      position: sticky; top: 0; height: 100vh; padding: var(--header-h, 100px) 0 0;
      display: flex; flex-direction: column; justify-content: center; gap: clamp(24px, 4vh, 48px);
      overflow: hidden;
    }
    .gallery-head { display: flex; align-items: flex-end; justify-content: space-between; gap: 24px; }
    .gallery-head .ui-title { margin: 0; }
    .gallery-progress {
      flex: 0 0 160px; height: 2px; border-radius: 2px; background: var(--ui-line); overflow: hidden; margin-bottom: 14px;
    }
    .gallery-progress span {
      display: block; height: 100%; background: var(--ui-green-deep);
      transform-origin: left; transform: scaleX(var(--sticky, 0));
    }
    .gallery:not(.pinned) .gallery-progress { display: none; }
    .gallery-viewport { overflow: hidden; }
    .gallery:not(.pinned) .gallery-viewport {
      overflow-x: auto; scroll-snap-type: x mandatory; scrollbar-width: none;
    }
    .gallery-viewport::-webkit-scrollbar { display: none; }
    .gallery-track {
      display: flex; gap: 20px; width: max-content;
      padding: 0 max(24px, calc((100vw - var(--ui-wrap)) / 2 + 24px));
    }
    .gallery.pinned .gallery-track {
      transform: translate3d(calc(var(--sticky, 0) * var(--shift, 0px) * -1), 0, 0);
      will-change: transform;
    }
    .g-card {
      position: relative; flex: 0 0 auto; width: clamp(280px, 30vw, 420px); height: min(62vh, 560px);
      border-radius: 28px; overflow: hidden; text-decoration: none; color: #fff;
      display: flex; flex-direction: column; justify-content: flex-end; scroll-snap-align: center;
      background: var(--ui-green-ink);
    }
    .g-card img {
      position: absolute; top: 0; left: -10%; width: 120%; max-width: none; height: 100%; object-fit: cover;
      /* image drifts slower than its card: parallax inside the frame */
      transform: translate3d(calc(var(--sticky, 0) * 14% - 7%), 0, 0);
      transition: scale 1.2s var(--ui-ease);
    }
    .g-card:hover img { scale: 1.04; }
    .g-card::after {
      content: ''; position: absolute; inset: 0;
      background: linear-gradient(180deg, rgba(0, 0, 0, 0) 40%, rgba(8, 22, 17, 0.82) 100%);
    }
    .g-copy { position: relative; z-index: 1; padding: 28px; }
    .g-copy h3 { font-size: 1.75rem; font-weight: 600; letter-spacing: -0.025em; margin: 0 0 8px; color: inherit; }
    .g-copy p { margin: 0 0 18px; line-height: 1.5; color: rgba(255, 255, 255, 0.8); }
    .g-price { display: inline-flex; align-items: center; gap: 8px; font-size: 0.9375rem; color: rgba(255, 255, 255, 0.85); }
    .g-price strong { color: #fff; font-size: 1.125rem; }
    .g-price app-icon { transition: transform 0.4s var(--ui-ease); }
    .g-card:hover .g-price app-icon { transform: translateX(4px); }
    .g-dark { background: var(--ui-green-deep); justify-content: space-between; }
    .g-dark::after { display: none; }
    .g-big {
      position: relative; z-index: 1; padding: 28px;
      font-size: clamp(4.5rem, 9vw, 7.5rem); font-weight: 600; letter-spacing: -0.06em; line-height: 0.9;
    }
    .g-card:focus-visible { outline: 3px solid var(--ui-green); outline-offset: 4px; }

    /* ---------- stacking steps ---------- */
    .stack { list-style: none; margin: 0 auto; padding: 0; max-width: 960px; }
    .stack-card {
      position: sticky; top: calc(var(--header-h, 100px) + 24px + var(--i) * 18px);
      display: grid; grid-template-columns: auto 1fr; gap: clamp(24px, 5vw, 72px); align-items: center;
      min-height: min(54vh, 460px); padding: clamp(32px, 5vw, 64px);
      margin-bottom: 14vh; border-radius: 32px; overflow: hidden;
      transform-origin: center top;
      /* shrink and dim once the next card starts covering this one */
      --covered: clamp(0, calc(var(--sticky, 0) * var(--n) - var(--i) - 0.55), 1);
      transform: scale(calc(1 - var(--covered) * 0.06));
    }
    .stack-card:last-child { margin-bottom: 0; --covered: 0; }
    .stack-card::after {
      content: ''; position: absolute; inset: 0; pointer-events: none;
      background: #0b1712; opacity: calc(var(--covered) * 0.18);
    }
    .tone-0 { background: #fff; color: var(--ui-ink); }
    .tone-1 { background: var(--ui-mint); color: var(--ui-green-ink); }
    .tone-2 { background: var(--ui-green-ink); color: #fff; }
    .stack-num {
      font-size: clamp(6rem, 16vw, 13rem); font-weight: 600; letter-spacing: -0.07em; line-height: 0.8;
      color: var(--ui-green);
    }
    .tone-2 .stack-num { color: #a4c3b2; }
    .stack-copy app-icon { color: var(--ui-green-deep); margin-bottom: 20px; }
    .tone-2 .stack-copy app-icon { color: #a4c3b2; }
    .stack-copy h3 {
      font-size: clamp(1.75rem, 3.5vw, 2.75rem); font-weight: 600; letter-spacing: -0.03em;
      margin: 0 0 12px; color: inherit;
    }
    .stack-copy p { font-size: clamp(1.0625rem, 1.6vw, 1.25rem); line-height: 1.5; margin: 0; opacity: 0.75; max-width: 440px; color: inherit; }

    /* ---------- responsive ---------- */
    @media (max-width: 900px) {
      .split { grid-template-columns: 1fr; }
      .split-media { aspect-ratio: 4 / 3; }
      .gallery-head { align-items: flex-start; flex-direction: column; }
    }
    @media (max-width: 600px) {
      .hero-media { height: 140vh; }
      .hero-media-sticky { height: 72vh; top: 14vh; }
      .float-card { font-size: 0.875rem; padding: 10px 14px; }
      .fc-1 { left: 20px; bottom: 6vh; }
      .fc-2 { right: 20px; top: 8vh; }
      .statement { height: 160vh; }
      .g-card { width: 82vw; height: 440px; }
      .stack-card { grid-template-columns: 1fr; gap: 8px; min-height: 0; margin-bottom: 8vh; }
      .stack-num { font-size: 5.5rem; }
    }

    @media (prefers-reduced-motion: reduce) {
      .hero-copy { opacity: 1; transform: none; animation: none; }
      .hero-media { height: auto; }
      .hero-media-sticky { position: static; height: 70vh; }
      .float-card { opacity: 1; transform: none; }
      .statement { height: auto; padding: 120px 0; }
      .statement-sticky { position: static; height: auto; }
      .marquee, .marquee.reverse { transform: none; flex-wrap: wrap; width: auto; justify-content: center; }
      .stack-card { position: static; transform: none; margin-bottom: 20px; }
      .stack-card::after { display: none; }
    }
  `]
})
export class HomeComponent implements AfterViewInit, OnDestroy {
  private transloco = inject(TranslocoService);
  private fx = inject(ScrollFxService);
  private host = inject(ElementRef<HTMLElement>);
  private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private cleanups: (() => void)[] = [];

  @ViewChild('track') private track?: ElementRef<HTMLElement>;

  /** Pixels the service track overflows the viewport; the pinned section scrolls exactly that far. */
  readonly overflow = signal(0);
  /** Wide screens pin the gallery and drive it with vertical scroll; phones swipe it natively. */
  readonly pinned = signal(false);

  readonly img = {
    hero: IMG('1581578731548-c64695cc6952', 2000, 1200),
    products: IMG('1527515637462-cff94eecc1ac', 900, 1100),
  };

  readonly cities = ['MONTREAL', 'LAVAL', 'LONGUEUIL', 'BROSSARD'];
  readonly marqueeCities = [...this.cities, ...this.cities, ...this.cities];

  readonly services = [
    { key: 'residential', link: '/services', from: SERVICE_PRICES.residential.from,
      title: 'HOME.SERVICES.RESIDENTIAL.TITLE', description: 'HOME.SERVICES.RESIDENTIAL.DESCRIPTION',
      image: IMG('1558618666-fcd25c85cd64', 900, 1200) },
    { key: 'deep', link: '/services', from: SERVICE_PRICES.deep_cleaning.from,
      title: 'HOME.GALLERY.DEEP.TITLE', description: 'HOME.GALLERY.DEEP.DESCRIPTION',
      image: IMG('1556909114-f6e7ad7d3136', 900, 1200) },
    { key: 'commercial', link: '/services', from: SERVICE_PRICES.commercial.from,
      title: 'HOME.SERVICES.COMMERCIAL.TITLE', description: 'HOME.SERVICES.COMMERCIAL.DESCRIPTION',
      image: IMG('1497366216548-37526070297c', 900, 1200) },
    { key: 'construction', link: '/services', from: SERVICE_PRICES.post_construction.from,
      title: 'HOME.SERVICES.POST_CONSTRUCTION.TITLE', description: 'HOME.SERVICES.POST_CONSTRUCTION.DESCRIPTION',
      image: IMG('1504307651254-35680f356dfd', 900, 1200) },
  ];
  readonly weeklyDiscount = FREQUENCY_DISCOUNTS['weekly'] * 100;

  readonly steps = [
    { key: 'BOOK', icon: 'calendar' },
    { key: 'CONFIRM', icon: 'check-circle' },
    { key: 'CLEAN', icon: 'sparkles' },
  ];

  readonly statementWords = toSignal(
    this.transloco.selectTranslate<string>('HOME.STATEMENT').pipe(map(text => text.split(/\s+/))),
    { initialValue: [] as string[] }
  );

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;
    this.cleanups.push(observeHeaderHeight(this.host.nativeElement));

    const wide = window.matchMedia('(min-width: 768px)');
    const measure = () => {
      this.pinned.set(wide.matches && !this.fx.reducedMotion);
      const track = this.track?.nativeElement;
      if (track) this.overflow.set(Math.max(0, track.scrollWidth - window.innerWidth));
    };
    const ro = new ResizeObserver(measure);
    if (this.track) ro.observe(this.track.nativeElement);
    window.addEventListener('resize', measure, { passive: true });
    measure();
    this.cleanups.push(() => ro.disconnect(), () => window.removeEventListener('resize', measure));
  }

  ngOnDestroy(): void {
    this.cleanups.forEach(fn => fn());
  }
}
