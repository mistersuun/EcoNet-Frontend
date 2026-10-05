import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { map } from 'rxjs';
import { IconComponent } from '../../shared/components/icon.component';
import { ScrollFxDirective } from '../../shared/scroll-fx.directive';

const IMG = (id: string, w: number, h: number) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&auto=format&q=80`;

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, TranslocoPipe, IconComponent, ScrollFxDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Hero: headline first, then the image grows to full width as you scroll -->
    <section class="hero" scrollFx>
      <div class="hero-copy">
        <p class="eyebrow">{{ 'HOME.HERO.BADGE' | transloco }}</p>
        <h1 class="hero-title">
          {{ 'HOME.HERO.TITLE' | transloco }}
          <span class="accent">{{ 'HOME.HERO.TITLE_ACCENT' | transloco }}</span>
        </h1>
        <p class="hero-subtitle">{{ 'HOME.HERO.SUBTITLE' | transloco }}</p>
        <div class="actions">
          <a routerLink="/booking" class="pill pill-primary">{{ 'HOME.HERO.CTA_BUTTON' | transloco }}</a>
          <a routerLink="/pricing" class="text-link">
            {{ 'HOME.HERO.SECONDARY' | transloco }} <app-icon name="chevron-right" [size]="16" [stroke]="2.25" />
          </a>
        </div>
      </div>
    </section>

    <section class="hero-media" scrollFx>
      <div class="hero-media-sticky">
        <div class="hero-media-frame">
          <img [src]="img.hero" [alt]="'HOME.ALT_TEXTS.HERO_IMAGE' | transloco" fetchpriority="high">
        </div>
      </div>
    </section>

    <!-- Statement: words light up as you scroll through -->
    <section class="statement" scrollFx>
      <div class="statement-sticky">
        <p class="statement-text" [style.--n]="statementWords().length">
          @for (word of statementWords(); track $index) {
            <span [style.--i]="$index">{{ word }} </span>
          }
        </p>
      </div>
    </section>

    <!-- Products -->
    <section class="section products">
      <div class="wrap split">
        <div class="split-media parallax" scrollFx>
          <img [src]="img.products" [alt]="'HOME.ALT_TEXTS.PRODUCTS_IMAGE' | transloco" loading="lazy">
          <span class="media-badge"><app-icon name="leaf" [size]="16" /> {{ 'HOME.PRODUCTS.BADGE' | transloco }}</span>
        </div>
        <div class="split-copy reveal" scrollFx>
          <p class="eyebrow">{{ 'HOME.PRODUCTS.EYEBROW' | transloco }}</p>
          <h2 class="title">
            {{ 'HOME.PRODUCTS.TITLE' | transloco }}
            <span class="muted">{{ 'HOME.PRODUCTS.TITLE_ACCENT' | transloco }}</span>
          </h2>
          <p class="lead">{{ 'HOME.PRODUCTS.DESCRIPTION' | transloco }}</p>
          <ul class="feature-list">
            <li><span class="icon-chip"><app-icon name="leaf" /></span>{{ 'HOME.PRODUCTS.FEATURES.BIODEGRADABLE' | transloco }}</li>
            <li><span class="icon-chip"><app-icon name="heart" /></span>{{ 'HOME.PRODUCTS.FEATURES.NON_TOXIC' | transloco }}</li>
            <li><span class="icon-chip"><app-icon name="droplet" /></span>{{ 'HOME.PRODUCTS.FEATURES.ZERO_RESIDUE' | transloco }}</li>
          </ul>
        </div>
      </div>
    </section>

    <!-- Services bento -->
    <section class="section services">
      <div class="wrap">
        <header class="section-head reveal" scrollFx>
          <p class="eyebrow">{{ 'HOME.SERVICES.EYEBROW' | transloco }}</p>
          <h2 class="title">{{ 'HOME.SERVICES.TITLE' | transloco }}</h2>
        </header>

        <div class="bento">
          <a routerLink="/services" class="tile tile-photo tile-tall reveal" scrollFx>
            <img [src]="img.residential" [alt]="'HOME.ALT_TEXTS.RESIDENTIAL_IMAGE' | transloco" loading="lazy">
            <div class="tile-copy">
              <span class="tile-icon"><app-icon name="home" /></span>
              <h3>{{ 'HOME.SERVICES.RESIDENTIAL.TITLE' | transloco }}</h3>
              <p>{{ 'HOME.SERVICES.RESIDENTIAL.DESCRIPTION' | transloco }}</p>
              <span class="text-link light">{{ 'HOME.SERVICES.LEARN_MORE' | transloco }} <app-icon name="chevron-right" [size]="16" [stroke]="2.25" /></span>
            </div>
          </a>

          <a routerLink="/services" class="tile tile-photo reveal" scrollFx style="--delay: 80ms">
            <img [src]="img.commercial" [alt]="'HOME.ALT_TEXTS.COMMERCIAL_IMAGE' | transloco" loading="lazy">
            <div class="tile-copy">
              <span class="tile-icon"><app-icon name="building" /></span>
              <h3>{{ 'HOME.SERVICES.COMMERCIAL.TITLE' | transloco }}</h3>
              <p>{{ 'HOME.SERVICES.COMMERCIAL.DESCRIPTION' | transloco }}</p>
            </div>
          </a>

          <div class="tile-row">
            <a routerLink="/services" class="tile tile-plain reveal" scrollFx style="--delay: 160ms">
              <span class="icon-chip lg"><app-icon name="hammer" [size]="24" /></span>
              <h3>{{ 'HOME.SERVICES.POST_CONSTRUCTION.TITLE' | transloco }}</h3>
              <p>{{ 'HOME.SERVICES.POST_CONSTRUCTION.DESCRIPTION' | transloco }}</p>
            </a>
            <a routerLink="/pricing" class="tile tile-dark reveal" scrollFx style="--delay: 240ms">
              <span class="icon-chip lg on-dark"><app-icon name="refresh" [size]="24" /></span>
              <h3>{{ 'HOME.SERVICES.RECURRING.TITLE' | transloco }}</h3>
              <p>{{ 'HOME.SERVICES.RECURRING.DESCRIPTION' | transloco }}</p>
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- How it works -->
    <section class="section steps" scrollFx>
      <div class="wrap">
        <header class="section-head reveal" scrollFx>
          <p class="eyebrow">{{ 'HOME.STEPS.EYEBROW' | transloco }}</p>
          <h2 class="title">{{ 'HOME.STEPS.TITLE' | transloco }}</h2>
        </header>
        <div class="step-track">
        <span class="step-line" aria-hidden="true"></span>
        <ol class="step-list">
          @for (step of steps; track step.key; let i = $index) {
            <li class="step reveal" scrollFx [style.--delay]="(i * 120) + 'ms'">
              <span class="step-icon"><app-icon [name]="step.icon" [size]="26" /></span>
              <span class="step-num">{{ i + 1 }}</span>
              <h3>{{ 'HOME.STEPS.' + step.key + '.TITLE' | transloco }}</h3>
              <p>{{ 'HOME.STEPS.' + step.key + '.DESCRIPTION' | transloco }}</p>
            </li>
          }
        </ol>
        </div>
      </div>
    </section>

    <!-- Closing CTA -->
    <section class="cta" scrollFx>
      <div class="wrap cta-inner">
        <app-icon name="leaf" [size]="40" [stroke]="1.5" class="cta-mark" />
        <h2 class="cta-title">{{ 'HOME.CTA.TITLE' | transloco }}</h2>
        <p class="cta-subtitle">{{ 'HOME.CTA.SUBTITLE' | transloco }}</p>
        <div class="actions center">
          <a routerLink="/booking" class="pill pill-light">{{ 'HOME.CTA.GET_QUOTE' | transloco }}</a>
          <a routerLink="/contact" class="text-link light">
            {{ 'HOME.CTA.DISCOVER_SERVICES' | transloco }} <app-icon name="chevron-right" [size]="16" [stroke]="2.25" />
          </a>
        </div>
      </div>
    </section>
  `,
  styles: [`
    :host {
      --ink: #1d1d1f;
      --muted: #6e6e73;
      --green: #6b9080;
      --green-deep: #3f6b5a;
      --green-ink: #1f3a30;
      --mint: #eaf4f1;
      --surface: #f5f5f7;
      --ease: cubic-bezier(0.22, 1, 0.36, 1);
      --wrap: 1120px;
      display: block;
      color: var(--ink);
      background: #fff;
    }

    .wrap { width: 100%; max-width: var(--wrap); margin: 0 auto; padding: 0 24px; }
    .section { padding: clamp(80px, 12vw, 160px) 0; }

    /* ---------- type ---------- */
    .eyebrow {
      font-size: 0.8125rem; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase;
      color: var(--green-deep); margin: 0 0 16px;
    }
    .title {
      font-size: clamp(2rem, 5vw, 3.5rem); font-weight: 600; line-height: 1.05;
      letter-spacing: -0.025em; margin: 0 0 20px; color: var(--ink);
    }
    .title .muted { display: block; color: var(--muted); }
    .lead { font-size: clamp(1.0625rem, 1.6vw, 1.25rem); line-height: 1.55; color: var(--muted); margin: 0; }

    /* ---------- buttons ---------- */
    .actions { display: flex; align-items: center; gap: 28px; flex-wrap: wrap; }
    .actions.center { justify-content: center; }
    .pill {
      display: inline-flex; align-items: center; justify-content: center;
      min-height: 48px; padding: 0 28px; border-radius: 980px;
      font-size: 1.0625rem; font-weight: 500; text-decoration: none;
      transition: transform 0.3s var(--ease), background-color 0.3s var(--ease);
    }
    .pill:active { transform: scale(0.97); }
    .pill-primary { background: var(--green-deep); color: #fff; }
    .pill-primary:hover { background: var(--green-ink); }
    .pill-light { background: #fff; color: var(--green-ink); }
    .pill-light:hover { background: var(--mint); }
    .text-link {
      display: inline-flex; align-items: center; gap: 2px;
      font-size: 1.0625rem; font-weight: 500; color: var(--green-deep); text-decoration: none;
    }
    .text-link:hover { text-decoration: underline; text-underline-offset: 4px; }
    .text-link app-icon { transition: transform 0.3s var(--ease); }
    .text-link:hover app-icon { transform: translateX(3px); }
    .text-link.light { color: #fff; }
    .pill:focus-visible, .text-link:focus-visible, .tile:focus-visible {
      outline: 3px solid var(--green); outline-offset: 3px;
    }

    /* ---------- reveal (shared) ---------- */
    .reveal {
      opacity: 0; transform: translateY(32px);
      transition: opacity 0.9s var(--ease) var(--delay, 0ms), transform 0.9s var(--ease) var(--delay, 0ms);
    }
    .reveal.is-visible { opacity: 1; transform: none; }

    /* ---------- hero ---------- */
    .hero {
      padding: clamp(120px, 16vh, 180px) 24px clamp(48px, 8vh, 80px);
      text-align: center;
      background: radial-gradient(120% 80% at 50% 0%, var(--mint) 0%, #fff 70%);
    }
    .hero-copy {
      max-width: 880px; margin: 0 auto;
      /* drifts up and fades as the hero scrolls away */
      opacity: calc(1 - var(--exit, 0) * 1.6);
      transform: translateY(calc(var(--exit, 0) * -80px)) scale(calc(1 - var(--exit, 0) * 0.04));
      animation: rise 1.1s var(--ease) backwards;
    }
    .hero-title {
      font-size: clamp(2.75rem, 8vw, 6rem); font-weight: 600; line-height: 1;
      letter-spacing: -0.035em; margin: 0 0 24px; color: var(--ink);
    }
    .hero-title .accent {
      display: block;
      background: linear-gradient(90deg, var(--green-deep), var(--green) 60%, #8fb5a3);
      -webkit-background-clip: text; background-clip: text; color: transparent;
      padding-bottom: 0.08em;
    }
    .hero-subtitle {
      font-size: clamp(1.125rem, 2vw, 1.375rem); line-height: 1.5; color: var(--muted);
      max-width: 620px; margin: 0 auto 36px;
    }
    .hero .actions { justify-content: center; }
    @keyframes rise { from { opacity: 0; transform: translateY(24px); } }

    /* Image starts inset with rounded corners, then expands edge-to-edge */
    .hero-media { height: 170vh; position: relative; }
    .hero-media-sticky {
      position: sticky; top: 0; height: 100vh;
      display: flex; align-items: center; justify-content: center; overflow: hidden;
    }
    .hero-media-frame {
      width: 100%; height: 100%;
      clip-path: inset(calc((1 - var(--sticky, 0)) * 12vh) calc((1 - var(--sticky, 0)) * 10vw)
                       round calc((1 - var(--sticky, 0)) * 32px));
      will-change: clip-path;
    }
    .hero-media-frame img {
      width: 100%; height: 100%; object-fit: cover; display: block;
      transform: scale(calc(1.15 - var(--sticky, 0) * 0.15));
      will-change: transform;
    }

    /* ---------- statement ---------- */
    .statement { height: 200vh; position: relative; }
    .statement-sticky {
      position: sticky; top: 0; height: 100vh;
      display: flex; align-items: center; justify-content: center; padding: 0 24px;
    }
    .statement-text {
      max-width: 980px; margin: 0; text-align: center; color: var(--ink);
      font-size: clamp(1.875rem, 5vw, 3.75rem); font-weight: 600; line-height: 1.15; letter-spacing: -0.025em;
    }
    .statement-text span {
      /* each word brightens in turn as --sticky goes 0 → 1 */
      opacity: clamp(0.14, calc((var(--sticky, 0) * 1.25 * var(--n) - var(--i))), 1);
      transition: opacity 0.15s linear;
    }

    /* ---------- products (split) ---------- */
    .products { background: var(--surface); }
    .split { display: grid; grid-template-columns: 1.1fr 1fr; gap: clamp(40px, 7vw, 96px); align-items: center; }
    .split-media {
      position: relative; aspect-ratio: 4 / 5; border-radius: 28px; overflow: hidden; background: var(--mint);
    }
    .parallax img {
      width: 100%; height: 118%; object-fit: cover; display: block;
      transform: translate3d(0, calc((var(--progress, 0.5) - 0.5) * -14%), 0);
      will-change: transform;
    }
    .media-badge {
      position: absolute; left: 20px; bottom: 20px;
      display: inline-flex; align-items: center; gap: 8px;
      padding: 10px 16px; border-radius: 980px;
      background: rgba(255, 255, 255, 0.8); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
      font-size: 0.875rem; font-weight: 600; color: var(--green-ink);
    }
    .feature-list { list-style: none; margin: 36px 0 0; padding: 0; display: grid; gap: 16px; }
    .feature-list li { display: flex; align-items: center; gap: 16px; font-size: 1.0625rem; font-weight: 500; }
    .icon-chip {
      width: 40px; height: 40px; border-radius: 12px; flex-shrink: 0;
      display: inline-flex; align-items: center; justify-content: center;
      background: var(--mint); color: var(--green-deep);
    }
    .icon-chip.lg { width: 52px; height: 52px; border-radius: 16px; margin-bottom: 20px; }
    .icon-chip.on-dark { background: rgba(255, 255, 255, 0.12); color: #fff; }

    /* ---------- services bento ---------- */
    .section-head { text-align: center; max-width: 720px; margin: 0 auto clamp(40px, 6vw, 72px); }
    .bento {
      display: grid; gap: 20px;
      grid-template-columns: 1fr 1fr;
      grid-template-rows: auto auto;
    }
    .tile {
      position: relative; display: flex; flex-direction: column; justify-content: flex-end;
      border-radius: 28px; overflow: hidden; text-decoration: none; color: inherit;
      padding: 32px; min-height: 280px;
      transition: transform 0.6s var(--ease), box-shadow 0.6s var(--ease),
                  opacity 0.9s var(--ease) var(--delay, 0ms);
    }
    .tile.reveal.is-visible:hover { transform: translateY(-4px); box-shadow: 0 24px 48px -24px rgba(31, 58, 48, 0.35); }
    .tile h3 { color: inherit; font-size: 1.75rem; font-weight: 600; letter-spacing: -0.02em; margin: 0 0 8px; }
    .tile p { font-size: 1.0625rem; line-height: 1.5; margin: 0; }
    .tile-tall { grid-row: span 2; min-height: 580px; }
    .tile-photo { color: #fff; }
    .tile-photo img {
      position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;
      transition: transform 1.2s var(--ease);
    }
    .tile-photo:hover img { transform: scale(1.04); }
    .tile-photo::after {
      content: ''; position: absolute; inset: 0;
      background: linear-gradient(180deg, rgba(0,0,0,0) 35%, rgba(10, 25, 20, 0.78) 100%);
    }
    .tile-copy { position: relative; z-index: 1; }
    .tile-copy p { color: rgba(255, 255, 255, 0.85); max-width: 420px; margin-bottom: 12px; }
    .tile-icon {
      width: 44px; height: 44px; border-radius: 14px; margin-bottom: 16px;
      display: inline-flex; align-items: center; justify-content: center;
      background: rgba(255, 255, 255, 0.18); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
    }
    .tile-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    .tile-row .tile { justify-content: flex-start; min-height: 280px; }
    .tile-plain { background: var(--surface); }
    .tile-plain p { color: var(--muted); }
    .tile-dark { background: var(--green-ink); color: #fff; }
    .tile-dark p { color: rgba(255, 255, 255, 0.75); }

    /* ---------- steps ---------- */
    .steps { background: var(--surface); }
    .step-track { position: relative; }
    .step-list {
      list-style: none; margin: 0; padding: 0;
      display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px;
    }
    .step-line {
      position: absolute; top: 36px; left: 16.66%; right: 16.66%; height: 2px;
      background: linear-gradient(90deg, var(--green), var(--green-deep));
      transform-origin: left; transform: scaleX(clamp(0, calc(var(--enter, 0) * 1.25 - 0.25), 1));
    }
    .step { text-align: center; position: relative; }
    .step-icon {
      width: 72px; height: 72px; border-radius: 50%; margin: 0 auto 20px;
      display: flex; align-items: center; justify-content: center; position: relative; z-index: 1;
      background: #fff; color: var(--green-deep);
      box-shadow: 0 0 0 8px var(--surface), 0 12px 24px -12px rgba(31, 58, 48, 0.35);
    }
    .step-num {
      display: block; font-size: 0.8125rem; font-weight: 600; letter-spacing: 0.08em; color: var(--green);
      margin-bottom: 6px;
    }
    .step h3 { color: var(--ink); font-size: 1.375rem; font-weight: 600; letter-spacing: -0.015em; margin: 0 0 8px; }
    .step p { color: var(--muted); line-height: 1.55; margin: 0 auto; max-width: 280px; }

    /* ---------- CTA ---------- */
    .cta {
      background: radial-gradient(100% 120% at 50% 100%, #2c5244 0%, var(--green-ink) 60%);
      color: #fff; text-align: center; padding: clamp(96px, 14vw, 180px) 0;
      overflow: hidden;
    }
    .cta-inner {
      max-width: 760px;
      transform: scale(calc(0.95 + var(--enter, 1) * 0.05));
    }
    .cta-mark { color: #a4c3b2; margin-bottom: 24px; }
    .cta-title {
      font-size: clamp(2.25rem, 6vw, 4.5rem); font-weight: 600; line-height: 1.05;
      letter-spacing: -0.03em; margin: 0 0 20px; color: #fff;
    }
    .cta-subtitle { font-size: clamp(1.0625rem, 1.8vw, 1.3125rem); color: rgba(255, 255, 255, 0.75); margin: 0 0 40px; }

    /* ---------- responsive ---------- */
    @media (max-width: 900px) {
      .split { grid-template-columns: 1fr; }
      .split-media { aspect-ratio: 4 / 3; }
      .bento { grid-template-columns: 1fr; }
      .tile-tall { grid-row: auto; min-height: 460px; }
      .step-list { grid-template-columns: 1fr; gap: 48px; }
      .step-line { display: none; }
    }
    @media (max-width: 600px) {
      .hero-media { height: 130vh; }
      .hero-media-sticky { height: 70vh; top: 15vh; }
      .statement { height: 160vh; }
      .tile { padding: 24px; border-radius: 24px; }
      .tile-row { grid-template-columns: 1fr; }
      .tile-row .tile { min-height: 0; }
      .tile h3 { color: inherit; font-size: 1.5rem; }
      .actions { gap: 20px; flex-direction: column; }
      .pill { width: 100%; max-width: 320px; }
    }

    @media (prefers-reduced-motion: reduce) {
      .reveal, .hero-copy { opacity: 1; transform: none; animation: none; transition: none; }
      .hero-media { height: auto; }
      .hero-media-sticky { position: static; height: 70vh; }
      .statement { height: auto; padding: 120px 0; }
      .statement-sticky { position: static; height: auto; }
    }
  `]
})
export class HomeComponent {
  private transloco = inject(TranslocoService);

  readonly img = {
    hero: IMG('1581578731548-c64695cc6952', 2000, 1200),
    products: IMG('1527515637462-cff94eecc1ac', 900, 1100),
    residential: IMG('1558618666-fcd25c85cd64', 900, 1200),
    commercial: IMG('1497366216548-37526070297c', 900, 600),
  };

  readonly steps = [
    { key: 'BOOK', icon: 'calendar' },
    { key: 'CONFIRM', icon: 'check-circle' },
    { key: 'CLEAN', icon: 'sparkles' },
  ];

  readonly statementWords = toSignal(
    this.transloco.selectTranslate<string>('HOME.STATEMENT').pipe(map(text => text.split(/\s+/))),
    { initialValue: [] as string[] }
  );
}
