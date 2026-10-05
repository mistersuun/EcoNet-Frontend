import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnDestroy, PLATFORM_ID, QueryList, ViewChild, ViewChildren, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { IconComponent } from '../../shared/components/icon.component';
import { ScrollFxDirective, observeHeaderHeight } from '../../shared/scroll-fx.directive';
import { FREQUENCY_DISCOUNTS, SERVICE_PRICES } from '../../shared/pricing';

const IMG = (id: string, w: number, h: number) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&auto=format&q=80`;

interface ServiceOption {
  /** Key under SERVICES.PAGE.SERVICE_LIST */
  key: string;
  from: number;
  bookable: boolean;
}

interface Chapter {
  id: string;
  /** Key under SERVICES.PAGE.CHAPTERS */
  key: string;
  icon: string;
  image: string;
  options: ServiceOption[];
}

const option = (key: string, price: { from: number; bookable: boolean }): ServiceOption =>
  ({ key, from: price.from, bookable: price.bookable });

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [RouterLink, TranslocoPipe, IconComponent, ScrollFxDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="ui-hero">
      <div class="ui-hero-inner">
        <p class="ui-eyebrow">{{ 'SERVICES.PAGE.HERO.BADGE' | transloco }}</p>
        <h1 class="ui-hero-title">
          {{ 'SERVICES.PAGE.HERO.TITLE' | transloco }}
          <span class="accent">{{ 'SERVICES.PAGE.HERO.TITLE_ACCENT' | transloco }}</span>
        </h1>
        <p class="ui-hero-subtitle">{{ 'SERVICES.PAGE.HERO.SUBTITLE' | transloco }}</p>
      </div>
    </section>

    <!-- Sticky chapter navigation -->
    <nav class="chapter-nav" [attr.aria-label]="'SERVICES.PAGE.NAV_LABEL' | transloco">
      <div class="chapter-nav-track" #navTrack>
        @for (chapter of chapters; track chapter.id) {
          <a [href]="'#' + chapter.id" class="chapter-tab" [attr.data-id]="chapter.id" [class.active]="active() === chapter.id"
             [attr.aria-current]="active() === chapter.id ? 'true' : null"
             (click)="goTo($event, chapter.id)">
            <app-icon [name]="chapter.icon" [size]="16" />
            {{ 'SERVICES.PAGE.CHAPTERS.' + chapter.key + '.NAV' | transloco }}
          </a>
        }
      </div>
    </nav>

    @for (chapter of chapters; track chapter.id; let odd = $odd) {
      <section class="chapter" [id]="chapter.id" [class.alt]="odd" #chapterEl>
        <div class="ui-wrap">
          <div class="chapter-head" [class.flip]="odd">
            <div class="chapter-media ui-mask" scrollFx>
              <img [src]="chapter.image" [alt]="'SERVICES.PAGE.CHAPTERS.' + chapter.key + '.NAV' | transloco" loading="lazy">
            </div>
            <div class="chapter-copy ui-reveal" scrollFx>
              <p class="ui-eyebrow eyebrow-icon">
                <span class="ui-chip"><app-icon [name]="chapter.icon" /></span>
                {{ 'SERVICES.PAGE.CHAPTERS.' + chapter.key + '.NAV' | transloco }}
              </p>
              <h2 class="ui-title">
                {{ 'SERVICES.PAGE.CHAPTERS.' + chapter.key + '.TITLE' | transloco }}
                <span class="muted">{{ 'SERVICES.PAGE.CHAPTERS.' + chapter.key + '.TITLE_ACCENT' | transloco }}</span>
              </h2>
              <p class="ui-lead">{{ 'SERVICES.PAGE.CHAPTERS.' + chapter.key + '.DESCRIPTION' | transloco }}</p>
            </div>
          </div>

          @if (chapter.options.length) {
            <div class="options" [class.single]="chapter.options.length === 1">
              @for (opt of chapter.options; track opt.key; let i = $index) {
                <article class="option ui-reveal" scrollFx [style.--delay]="(i * 100) + 'ms'">
                  <header class="option-head">
                    <h3>{{ 'SERVICES.PAGE.SERVICE_LIST.' + opt.key + '.TITLE' | transloco }}</h3>
                    <p class="option-desc">{{ 'SERVICES.PAGE.SERVICE_LIST.' + opt.key + '.DESCRIPTION' | transloco }}</p>
                  </header>
                  <div class="option-price">
                    <span class="from">{{ 'SERVICES.PAGE.LABELS.FROM' | transloco }}</span>
                    <span class="amount">{{ opt.from }}&nbsp;$</span>
                    <span class="meta"><app-icon name="clock" [size]="14" /> {{ 'SERVICES.PAGE.SERVICE_LIST.' + opt.key + '.DURATION' | transloco }}</span>
                  </div>
                  <ul class="checks">
                    @for (feature of features(opt.key); track $index) {
                      <li><app-icon name="check" [size]="16" [stroke]="2.25" />{{ feature }}</li>
                    }
                  </ul>
                  <div class="option-actions">
                    @if (opt.bookable) {
                      <a routerLink="/booking" class="ui-pill sm">{{ 'SERVICES.PAGE.LABELS.BOOK' | transloco }}</a>
                    } @else {
                      <a routerLink="/contact" class="ui-pill sm">{{ 'SERVICES.PAGE.LABELS.QUOTE' | transloco }}</a>
                    }
                  </div>
                </article>
              }
            </div>
          } @else {
            <!-- Regular maintenance: frequency discounts -->
            <div class="discounts">
              @for (d of discounts; track d.key; let i = $index) {
                <a routerLink="/booking" class="discount ui-reveal" scrollFx [style.--delay]="(i * 100) + 'ms'">
                  <span class="discount-value">{{ d.percent }}&nbsp;%</span>
                  <span class="discount-off">{{ 'SERVICES.PAGE.LABELS.OFF' | transloco }}</span>
                  <span class="discount-name">{{ 'BOOKING.FREQUENCY_OPTIONS.' + d.key + '.NAME' | transloco }}</span>
                </a>
              }
            </div>
            <ul class="checks inline ui-reveal" scrollFx>
              @for (feature of features('MAINTENANCE'); track $index) {
                <li><app-icon name="check" [size]="16" [stroke]="2.25" />{{ feature }}</li>
              }
            </ul>
          }
        </div>
      </section>
    }

    <!-- Why EcoNet -->
    <section class="ui-section why">
      <div class="ui-wrap">
        <header class="ui-head ui-reveal" scrollFx>
          <h2 class="ui-title">{{ 'SERVICES.PAGE.WHY.TITLE' | transloco }}</h2>
        </header>
        <div class="why-grid">
          @for (item of why; track item.key; let i = $index) {
            <div class="why-item ui-reveal" scrollFx [style.--delay]="(i * 100) + 'ms'">
              <span class="ui-chip lg"><app-icon [name]="item.icon" [size]="24" /></span>
              <h3>{{ 'SERVICES.PAGE.WHY.FEATURES.' + item.key + '.TITLE' | transloco }}</h3>
              <p>{{ 'SERVICES.PAGE.WHY.FEATURES.' + item.key + '.DESCRIPTION' | transloco }}</p>
            </div>
          }
        </div>
        <p class="pricing-link ui-reveal" scrollFx>
          <a routerLink="/pricing" class="ui-link">
            {{ 'SERVICES.PAGE.LABELS.SEE_PRICING' | transloco }} <app-icon name="chevron-right" [size]="16" [stroke]="2.25" />
          </a>
        </p>
      </div>
    </section>

    <section class="ui-cta" scrollFx>
      <div class="ui-wrap ui-cta-inner">
        <app-icon name="leaf" [size]="40" [stroke]="1.5" class="ui-cta-mark" />
        <h2 class="ui-cta-title">{{ 'SERVICES.PAGE.CTA.TITLE' | transloco }}</h2>
        <p class="ui-cta-subtitle">{{ 'SERVICES.PAGE.CTA.SUBTITLE' | transloco }}</p>
        <div class="ui-actions center">
          <a routerLink="/booking" class="ui-pill light">{{ 'SERVICES.PAGE.CTA.BOOK_NOW' | transloco }}</a>
          <a routerLink="/contact" class="ui-link light">
            {{ 'SERVICES.PAGE.CTA.GET_QUOTE' | transloco }} <app-icon name="chevron-right" [size]="16" [stroke]="2.25" />
          </a>
        </div>
      </div>
    </section>
  `,
  styles: [`
    :host { display: block; background: #fff; color: var(--ui-ink); }

    /* ---------- sticky chapter nav ---------- */
    .chapter-nav {
      position: sticky; top: var(--header-h, 76px); z-index: 50;
      background: rgba(255, 255, 255, 0.78);
      backdrop-filter: saturate(180%) blur(20px); -webkit-backdrop-filter: saturate(180%) blur(20px);
      border-bottom: 1px solid var(--ui-line);
    }
    .chapter-nav-track {
      position: relative; /* offsetParent for tab positions */
      display: flex; justify-content: center; gap: 8px; padding: 12px 24px;
      overflow-x: auto; scrollbar-width: none;
    }
    .chapter-nav-track::-webkit-scrollbar { display: none; }
    .chapter-tab {
      display: inline-flex; align-items: center; gap: 8px; flex-shrink: 0;
      padding: 8px 16px; border-radius: 980px;
      font-size: 0.9375rem; font-weight: 500; color: var(--ui-muted); text-decoration: none;
      transition: background-color 0.3s var(--ui-ease), color 0.3s var(--ui-ease);
    }
    .chapter-tab:hover { color: var(--ui-ink); }
    .chapter-tab.active { background: var(--ui-green-ink); color: #fff; }
    .chapter-tab:focus-visible { outline: 3px solid var(--ui-green); outline-offset: 2px; }

    /* ---------- chapters ---------- */
    .chapter {
      padding: clamp(80px, 11vw, 140px) 0;
      scroll-margin-top: calc(var(--header-h, 76px) + 56px);
    }
    .chapter.alt { background: var(--ui-surface); }
    .chapter-head {
      display: grid; grid-template-columns: 1.1fr 1fr; gap: clamp(40px, 7vw, 96px); align-items: center;
      margin-bottom: clamp(48px, 7vw, 80px);
    }
    .chapter-head.flip .chapter-media { order: 2; }
    .chapter-media {
      position: relative; aspect-ratio: 5 / 4; border-radius: 28px; overflow: hidden; background: var(--ui-mint);
    }
    .eyebrow-icon { display: inline-flex; align-items: center; gap: 12px; }

    /* ---------- option cards ---------- */
    .options { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
    .options.single { grid-template-columns: minmax(0, 640px); justify-content: center; }
    .option {
      display: flex; flex-direction: column;
      background: #fff; border-radius: 28px; padding: clamp(28px, 4vw, 40px);
      box-shadow: inset 0 0 0 1px var(--ui-line);
    }
    .chapter.alt .option { box-shadow: none; }
    .option-head h3 { font-size: 1.5rem; font-weight: 600; letter-spacing: -0.02em; margin: 0 0 8px; color: var(--ui-ink); }
    .option-desc { color: var(--ui-muted); line-height: 1.55; margin: 0; }
    .option-price {
      display: flex; align-items: baseline; flex-wrap: wrap; gap: 4px 10px;
      margin: 24px 0; padding: 20px 0; border-top: 1px solid var(--ui-line); border-bottom: 1px solid var(--ui-line);
    }
    .option-price .from { font-size: 0.875rem; color: var(--ui-muted); }
    .option-price .amount { font-size: 2.25rem; font-weight: 600; letter-spacing: -0.03em; color: var(--ui-ink); }
    .option-price .meta {
      margin-left: auto; display: inline-flex; align-items: center; gap: 6px;
      font-size: 0.875rem; color: var(--ui-muted);
    }
    .checks { list-style: none; margin: 0 0 28px; padding: 0; display: grid; gap: 12px; }
    .checks li { display: flex; align-items: flex-start; gap: 12px; line-height: 1.45; color: var(--ui-ink); }
    .checks app-icon { color: var(--ui-green-deep); margin-top: 3px; }
    .checks.inline {
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); margin: 40px auto 0; max-width: 900px;
    }
    .option-actions { margin-top: auto; }

    /* ---------- maintenance discounts ---------- */
    .discounts { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
    .discount {
      display: flex; flex-direction: column; align-items: flex-start;
      padding: 32px; border-radius: 28px; text-decoration: none;
      background: var(--ui-green-ink); color: #fff;
      transition: transform 0.6s var(--ui-ease), opacity 0.9s var(--ui-ease) var(--delay, 0ms);
    }
    .discount:nth-child(2) { background: var(--ui-green-deep); }
    .discount:nth-child(3) { background: #fff; color: var(--ui-ink); box-shadow: inset 0 0 0 1px var(--ui-line); }
    .discount.ui-reveal.is-visible:hover { transform: translateY(-4px); }
    .discount-value { font-size: clamp(3rem, 6vw, 4.5rem); font-weight: 600; letter-spacing: -0.04em; line-height: 1; }
    .discount-off { font-size: 1rem; opacity: 0.75; margin: 4px 0 24px; }
    .discount-name { font-size: 1.125rem; font-weight: 600; }

    /* ---------- why ---------- */
    .why-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px; }
    .why-item { text-align: center; }
    .why-item .ui-chip { margin-bottom: 20px; }
    .why-item h3 { font-size: 1.375rem; font-weight: 600; letter-spacing: -0.015em; margin: 0 0 8px; color: var(--ui-ink); }
    .why-item p { color: var(--ui-muted); line-height: 1.55; margin: 0 auto; max-width: 300px; }
    .pricing-link { text-align: center; margin: 56px 0 0; }

    @media (max-width: 900px) {
      .chapter-head { grid-template-columns: 1fr; }
      .chapter-head.flip .chapter-media { order: 0; }
      .chapter-media { aspect-ratio: 4 / 3; }
      .options, .discounts, .why-grid { grid-template-columns: 1fr; }
    }
    @media (max-width: 600px) {
      .chapter-nav-track { justify-content: flex-start; }
      .option, .discount { border-radius: 24px; }
      .option-price .meta { margin-left: 0; width: 100%; }
    }
  `]
})
export class ServicesComponent implements AfterViewInit, OnDestroy {
  private transloco = inject(TranslocoService);
  private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private observer?: IntersectionObserver;
  private stopHeaderObserver?: () => void;
  private host = inject(ElementRef<HTMLElement>);

  @ViewChildren('chapterEl') private chapterEls!: QueryList<ElementRef<HTMLElement>>;
  @ViewChild('navTrack') private navTrack?: ElementRef<HTMLElement>;

  readonly active = signal('residential');

  readonly chapters: Chapter[] = [
    {
      id: 'residential', key: 'RESIDENTIAL', icon: 'home',
      image: IMG('1558618666-fcd25c85cd64', 1100, 880),
      options: [
        option('RESIDENTIAL_BASIC', SERVICE_PRICES.residential),
        option('RESIDENTIAL_DEEP', SERVICE_PRICES.deep_cleaning),
      ],
    },
    {
      id: 'commercial', key: 'COMMERCIAL', icon: 'building',
      image: IMG('1497366216548-37526070297c', 1100, 880),
      options: [
        option('COMMERCIAL_OFFICE', SERVICE_PRICES.commercial),
        option('COMMERCIAL_RETAIL', SERVICE_PRICES.commercial),
      ],
    },
    {
      id: 'construction', key: 'CONSTRUCTION', icon: 'hammer',
      image: IMG('1504307651254-35680f356dfd', 1100, 880),
      options: [option('CONSTRUCTION_CLEANUP', SERVICE_PRICES.post_construction)],
    },
    {
      id: 'maintenance', key: 'MAINTENANCE', icon: 'refresh',
      image: IMG('1581578731548-c64695cc6952', 1100, 880),
      options: [],
    },
  ];

  readonly discounts = [
    { key: 'WEEKLY', percent: FREQUENCY_DISCOUNTS['weekly'] * 100 },
    { key: 'BI_WEEKLY', percent: FREQUENCY_DISCOUNTS['bi-weekly'] * 100 },
    { key: 'MONTHLY', percent: FREQUENCY_DISCOUNTS['monthly'] * 100 },
  ];

  readonly why = [
    { key: 'ECO', icon: 'leaf' },
    { key: 'EXPERTISE', icon: 'award' },
    { key: 'INSURANCE', icon: 'shield-check' },
  ];

  features(key: string): string[] {
    const list = this.transloco.translate(`SERVICES.PAGE.SERVICE_LIST.${key}.FEATURES`);
    return Array.isArray(list) ? list : [];
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;
    // Pin the chapter nav right below the fixed site header.
    this.stopHeaderObserver = observeHeaderHeight(this.host.nativeElement);
    // The chapter crossing the upper third of the viewport is the active tab.
    this.observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) this.setActive((entry.target as HTMLElement).id);
      }
    }, { rootMargin: '-30% 0px -65% 0px' });
    this.chapterEls.forEach(el => this.observer!.observe(el.nativeElement));
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    this.stopHeaderObserver?.();
  }

  goTo(event: Event, id: string): void {
    event.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    this.setActive(id);
  }

  /** Highlight a tab and, on narrow screens, scroll the tab strip so it stays visible. */
  private setActive(id: string): void {
    this.active.set(id);
    const track = this.navTrack?.nativeElement;
    const tab = track?.querySelector<HTMLElement>(`[data-id="${id}"]`);
    if (track && tab && track.scrollWidth > track.clientWidth) {
      track.scrollTo({ left: tab.offsetLeft - (track.clientWidth - tab.offsetWidth) / 2, behavior: 'smooth' });
    }
  }
}
