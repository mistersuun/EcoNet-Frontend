import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { IconComponent } from '../../shared/components/icon.component';
import { ScrollFxDirective } from '../../shared/scroll-fx.directive';
import { ADD_ONS, FREQUENCY_DISCOUNTS, SERVICE_PRICES, ServicePrice } from '../../shared/pricing';

interface Plan extends ServicePrice {
  /** Key under PRICING.PLANS */
  key: string;
  popular?: boolean;
}

/** Rows of the comparison table; columns follow `plans` order. */
const COMPARISON: { key: string; included: boolean[] }[] = [
  { key: 'GENERAL_CLEANING',       included: [true,  true,  true,  true] },
  { key: 'DISINFECTION',           included: [true,  true,  true,  true] },
  { key: 'INTERIOR_WINDOWS',       included: [true,  true,  false, true] },
  { key: 'APPLIANCE_INTERIOR',     included: [false, true,  false, false] },
  { key: 'SPECIALIZED_EQUIPMENT',  included: [false, true,  true,  true] },
  { key: 'POST_CONSTRUCTION',      included: [false, false, false, true] },
  { key: 'SATISFACTION_GUARANTEE', included: [true,  true,  true,  true] },
];

@Component({
  selector: 'app-pricing',
  standalone: true,
  imports: [RouterLink, TranslocoPipe, IconComponent, ScrollFxDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="ui-hero">
      <div class="ui-hero-inner">
        <p class="ui-eyebrow">{{ 'PRICING.HERO.BADGE' | transloco }}</p>
        <h1 class="ui-hero-title">
          {{ 'PRICING.HERO.TITLE' | transloco }}
          <span class="accent">{{ 'PRICING.HERO.TITLE_ACCENT' | transloco }}</span>
        </h1>
        <p class="ui-hero-subtitle">{{ 'PRICING.HERO.SUBTITLE' | transloco }}</p>
      </div>
    </section>

    <!-- Plans -->
    <section class="plans-section">
      <div class="ui-wrap wide">
        <div class="plans">
          @for (plan of plans; track plan.id; let i = $index) {
            <article class="plan ui-reveal" scrollFx [class.popular]="plan.popular" [style.--delay]="(i * 80) + 'ms'">
              @if (plan.popular) {
                <span class="plan-badge">{{ 'PRICING.POPULAR' | transloco }}</span>
              }
              <span class="ui-chip lg"><app-icon [name]="plan.icon" [size]="24" /></span>
              <h2 class="plan-name">{{ 'PRICING.PLANS.' + plan.key + '.NAME' | transloco }}</h2>
              <p class="plan-desc">{{ 'PRICING.PLANS.' + plan.key + '.DESCRIPTION' | transloco }}</p>
              <p class="plan-price">
                <span class="from">{{ 'PRICING.STARTING_FROM' | transloco }}</span>
                <span class="amount">{{ plan.from }}&nbsp;$</span>
              </p>
              @if (plan.bookable) {
                <a routerLink="/booking" class="ui-pill" [class.ghost]="!plan.popular">{{ 'PRICING.BOOK' | transloco }}</a>
              } @else {
                <a routerLink="/contact" class="ui-pill ghost">{{ 'PRICING.QUOTE' | transloco }}</a>
              }
              <ul class="checks">
                @for (feature of list('PRICING.PLANS.' + plan.key + '.FEATURES'); track $index) {
                  <li><app-icon name="check" [size]="16" [stroke]="2.25" />{{ feature }}</li>
                }
              </ul>
            </article>
          }
        </div>
        <p class="taxes-note">{{ 'PRICING.TAXES_NOTE' | transloco }}</p>
      </div>
    </section>

    <!-- Frequency discounts -->
    <section class="ui-section alt">
      <div class="ui-wrap">
        <header class="ui-head ui-reveal" scrollFx>
          <p class="ui-eyebrow">{{ 'PRICING.DISCOUNTS.EYEBROW' | transloco }}</p>
          <h2 class="ui-title">
            {{ 'PRICING.DISCOUNTS.TITLE' | transloco }}
            <span class="muted">{{ 'PRICING.DISCOUNTS.TITLE_ACCENT' | transloco }}</span>
          </h2>
          <p class="ui-lead">{{ 'PRICING.DISCOUNTS.SUBTITLE' | transloco }}</p>
        </header>
        <div class="bars" scrollFx>
          @for (d of discounts; track d.key; let i = $index) {
            <div class="bar-col" [style.--i]="i">
              <span class="bar-value">{{ d.percent ? '−' + d.percent + ' %' : '—' }}</span>
              <span class="bar" [style.--h]="0.18 + d.percent / 15 * 0.82"></span>
              <span class="bar-name">{{ 'BOOKING.FREQUENCY_OPTIONS.' + d.key + '.NAME' | transloco }}</span>
            </div>
          }
        </div>
      </div>
    </section>

    <!-- Add-ons and adjustments -->
    <section class="ui-section">
      <div class="ui-wrap extras">
        <div class="extra-card ui-reveal" scrollFx>
          <h2 class="extra-title">{{ 'PRICING.ADDONS.TITLE' | transloco }}</h2>
          <p class="extra-sub">{{ 'PRICING.ADDONS.SUBTITLE' | transloco }}</p>
          <ul class="price-rows">
            @for (addon of addOns; track addon.id) {
              <li><span>{{ addon.name | transloco }}</span><span class="dots"></span><strong>+{{ addon.price }}&nbsp;$</strong></li>
            }
          </ul>
        </div>
        <div class="extra-card ui-reveal" scrollFx style="--delay: 100ms">
          <h2 class="extra-title">{{ 'PRICING.ADJUST.TITLE' | transloco }}</h2>
          <p class="extra-sub">{{ 'PRICING.ADJUST.SUBTITLE' | transloco }}</p>
          @for (factor of factors; track factor.key) {
            <h3 class="factor-name"><app-icon [name]="factor.icon" [size]="18" /> {{ 'PRICING.FACTORS.' + factor.key + '.NAME' | transloco }}</h3>
            <ul class="price-rows compact">
              @for (item of list('PRICING.FACTORS.' + factor.key + '.ITEMS'); track $index) {
                <li><span>{{ label(item) }}</span><span class="dots"></span><strong>{{ value(item) }}</strong></li>
              }
            </ul>
          }
        </div>
      </div>
    </section>

    <!-- Comparison -->
    <section class="ui-section alt">
      <div class="ui-wrap">
        <header class="ui-head ui-reveal" scrollFx>
          <p class="ui-eyebrow">{{ 'PRICING.COMPARISON.EYEBROW' | transloco }}</p>
          <h2 class="ui-title">{{ 'PRICING.COMPARISON.TITLE' | transloco }}</h2>
        </header>

        <div class="compare ui-reveal" scrollFx>
          <table>
            <thead>
              <tr>
                <th scope="col"><span class="sr-only">{{ 'PRICING.COMPARISON.FEATURES' | transloco }}</span></th>
                @for (plan of plans; track plan.id) {
                  <th scope="col">
                    <app-icon [name]="plan.icon" [size]="20" />
                    <span>{{ 'PRICING.PLANS.' + plan.key + '.NAME' | transloco }}</span>
                  </th>
                }
              </tr>
            </thead>
            <tbody>
              @for (row of comparison; track row.key) {
                <tr>
                  <th scope="row">{{ 'PRICING.COMPARISON.' + row.key | transloco }}</th>
                  @for (yes of row.included; track $index) {
                    <td [class.no]="!yes">
                      <app-icon [name]="yes ? 'check' : 'x'" [size]="yes ? 20 : 16" [stroke]="2.25" />
                      <span class="sr-only">{{ (yes ? 'PRICING.COMPARISON.YES' : 'PRICING.COMPARISON.NO') | transloco }}</span>
                    </td>
                  }
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- Guarantees -->
    <section class="ui-section">
      <div class="ui-wrap">
        <header class="ui-head ui-reveal" scrollFx>
          <h2 class="ui-title">{{ 'PRICING.GUARANTEE.TITLE' | transloco }}</h2>
        </header>
        <div class="guarantees">
          @for (g of guarantees; track g.key; let i = $index) {
            <div class="guarantee ui-reveal" scrollFx [style.--delay]="(i * 100) + 'ms'">
              <span class="ui-chip lg"><app-icon [name]="g.icon" [size]="24" /></span>
              <h3>{{ 'PRICING.GUARANTEE.' + g.key + '.TITLE' | transloco }}</h3>
              <p>{{ 'PRICING.GUARANTEE.' + g.key + '.DESCRIPTION' | transloco }}</p>
            </div>
          }
        </div>
      </div>
    </section>

    <!-- FAQ -->
    <section class="ui-section alt">
      <div class="ui-wrap narrow">
        <header class="ui-head ui-reveal" scrollFx>
          <h2 class="ui-title">{{ 'PRICING.FAQ.TITLE' | transloco }}</h2>
        </header>
        <div class="faq ui-reveal" scrollFx>
          @for (q of faq; track q) {
            <details>
              <summary>
                {{ 'PRICING.FAQ.' + q + '.QUESTION' | transloco }}
                <app-icon name="plus" [size]="20" />
              </summary>
              <p>{{ 'PRICING.FAQ.' + q + '.ANSWER' | transloco }}</p>
            </details>
          }
        </div>
      </div>
    </section>

    <section class="ui-cta" scrollFx>
      <div class="ui-wrap ui-cta-inner">
        <app-icon name="calculator" [size]="40" [stroke]="1.5" class="ui-cta-mark" />
        <h2 class="ui-cta-title">{{ 'PRICING.CTA.TITLE' | transloco }}</h2>
        <p class="ui-cta-subtitle">{{ 'PRICING.CTA.SUBTITLE' | transloco }}</p>
        <div class="ui-actions center">
          <a routerLink="/booking" class="ui-pill light">{{ 'PRICING.CTA.BOOK_NOW' | transloco }}</a>
          <a routerLink="/contact" class="ui-link light">
            {{ 'PRICING.CTA.GET_QUOTE' | transloco }} <app-icon name="chevron-right" [size]="16" [stroke]="2.25" />
          </a>
        </div>
      </div>
    </section>
  `,
  styles: [`
    :host { display: block; background: #fff; color: var(--ui-ink); }
    .ui-wrap.wide { max-width: 1280px; }
    .ui-wrap.narrow { max-width: 820px; }
    .sr-only {
      position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
      overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0;
    }
    .checks { list-style: none; margin: 0; padding: 0; display: grid; gap: 12px; }
    .checks li { display: flex; align-items: flex-start; gap: 10px; line-height: 1.45; font-size: 0.9375rem; color: var(--ui-ink); }
    .checks app-icon { color: var(--ui-green-deep); margin-top: 2px; }

    /* ---------- plans ---------- */
    .plans-section { padding: 0 0 clamp(80px, 10vw, 128px); }
    .plans { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; align-items: stretch; }
    .plan {
      position: relative; display: flex; flex-direction: column; align-items: flex-start;
      padding: 32px 28px; border-radius: 28px; background: var(--ui-surface);
    }
    .plan.popular { background: #fff; box-shadow: inset 0 0 0 2px var(--ui-green-deep), 0 30px 60px -30px rgba(31, 58, 48, 0.35); }
    .plan-badge {
      position: absolute; top: 28px; right: 24px;
      font-size: 0.75rem; font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase;
      color: var(--ui-green-deep); background: var(--ui-mint); padding: 6px 10px; border-radius: 980px;
    }
    .plan .ui-chip { margin-bottom: 24px; }
    .plan-name { font-size: 1.5rem; font-weight: 600; letter-spacing: -0.02em; margin: 0 0 6px; color: var(--ui-ink); }
    .plan-desc { color: var(--ui-muted); margin: 0 0 24px; line-height: 1.5; min-height: 3em; }
    .plan-price { display: flex; flex-direction: column; margin: 0 0 24px; }
    .plan-price .from { font-size: 0.875rem; color: var(--ui-muted); }
    .plan-price .amount { font-size: 3rem; font-weight: 600; letter-spacing: -0.04em; line-height: 1.05; color: var(--ui-ink); }
    .plan .ui-pill { width: 100%; margin-bottom: 28px; }
    .plan .checks { padding-top: 24px; border-top: 1px solid var(--ui-line); width: 100%; }
    .taxes-note { text-align: center; color: var(--ui-muted); font-size: 0.875rem; margin: 32px 0 0; }

    /* ---------- discount bars ---------- */
    .bars {
      display: grid; grid-template-columns: repeat(4, 1fr); gap: clamp(12px, 3vw, 32px);
      align-items: end; max-width: 760px; margin: 0 auto; height: 360px;
    }
    .bar-col { display: flex; flex-direction: column; align-items: center; justify-content: flex-end; height: 100%; gap: 12px; }
    .bar-value { font-size: clamp(1.25rem, 3vw, 2rem); font-weight: 600; letter-spacing: -0.03em; color: var(--ui-ink); }
    .bar {
      width: 100%; border-radius: 16px 16px 6px 6px;
      height: calc(var(--h) * 240px);
      background: linear-gradient(180deg, var(--ui-green), var(--ui-green-deep));
      transform-origin: bottom;
      /* bars grow in turn as the chart enters the viewport */
      transform: scaleY(clamp(0.04, calc(var(--enter, 1) * 1.6 - var(--i) * 0.15), 1));
    }
    .bar-col:first-child .bar { background: #d2d2d7; }
    .bar-name { font-size: 0.9375rem; font-weight: 500; color: var(--ui-muted); text-align: center; }

    /* ---------- extras ---------- */
    .extras { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    .extra-card { background: var(--ui-surface); border-radius: 28px; padding: clamp(28px, 4vw, 44px); }
    .extra-title { font-size: 1.75rem; font-weight: 600; letter-spacing: -0.02em; margin: 0 0 8px; color: var(--ui-ink); }
    .extra-sub { color: var(--ui-muted); margin: 0 0 28px; line-height: 1.5; }
    .factor-name {
      display: flex; align-items: center; gap: 8px; margin: 24px 0 8px;
      font-size: 1rem; font-weight: 600; color: var(--ui-green-deep);
    }
    .price-rows { list-style: none; margin: 0; padding: 0; }
    .price-rows li {
      display: flex; align-items: baseline; gap: 12px; padding: 14px 0;
      border-bottom: 1px solid var(--ui-line); color: var(--ui-ink);
    }
    .price-rows.compact li { padding: 10px 0; font-size: 0.9375rem; }
    .price-rows li:last-child { border-bottom: 0; }
    .price-rows .dots { flex: 1; }
    .price-rows strong { font-weight: 600; white-space: nowrap; }

    /* ---------- comparison ---------- */
    .compare { overflow-x: auto; border-radius: 28px; background: #fff; }
    table { width: 100%; border-collapse: collapse; min-width: 640px; }
    th, td { padding: 18px 16px; text-align: center; border-bottom: 1px solid var(--ui-line); }
    thead th {
      font-size: 0.9375rem; font-weight: 600; color: var(--ui-ink); vertical-align: bottom;
    }
    thead th app-icon { display: flex; justify-content: center; color: var(--ui-green-deep); margin-bottom: 8px; }
    tbody th { text-align: left; font-weight: 500; color: var(--ui-ink); }
    tbody tr:last-child th, tbody tr:last-child td { border-bottom: 0; }
    td { color: var(--ui-green-deep); }
    td.no { color: #c7c7cc; }
    tbody tr:hover { background: var(--ui-mint); }
    th:first-child { position: sticky; left: 0; background: inherit; }
    thead th:first-child, tbody th { background: #fff; }
    tbody tr:hover th { background: var(--ui-mint); }

    /* ---------- guarantees ---------- */
    .guarantees { display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px; }
    .guarantee { text-align: center; }
    .guarantee .ui-chip { margin-bottom: 20px; }
    .guarantee h3 { font-size: 1.375rem; font-weight: 600; letter-spacing: -0.015em; margin: 0 0 8px; color: var(--ui-ink); }
    .guarantee p { color: var(--ui-muted); line-height: 1.55; margin: 0 auto; max-width: 300px; }

    /* ---------- FAQ ---------- */
    .faq { border-top: 1px solid var(--ui-line); }
    details { border-bottom: 1px solid var(--ui-line); }
    summary {
      list-style: none; cursor: pointer;
      display: flex; align-items: center; justify-content: space-between; gap: 24px;
      padding: 24px 0; font-size: 1.1875rem; font-weight: 600; color: var(--ui-ink);
    }
    summary::-webkit-details-marker { display: none; }
    summary app-icon { color: var(--ui-green-deep); transition: transform 0.4s var(--ui-ease); }
    details[open] summary app-icon { transform: rotate(45deg); }
    summary:focus-visible { outline: 3px solid var(--ui-green); outline-offset: 4px; border-radius: 8px; }
    details p { margin: 0 0 24px; color: var(--ui-muted); line-height: 1.6; max-width: 680px; }

    @media (max-width: 1100px) {
      .plans { grid-template-columns: repeat(2, 1fr); }
    }
    @media (max-width: 900px) {
      .extras, .guarantees { grid-template-columns: 1fr; }
    }
    @media (max-width: 600px) {
      .plans { grid-template-columns: 1fr; }
      .plan-desc { min-height: 0; }
      .bars { height: 300px; }
      .bar { height: calc(var(--h) * 190px); }
      .bar-name { font-size: 0.8125rem; }
      table { min-width: 520px; }
      th, td { padding: 14px 8px; }
      thead th { font-size: 0.75rem; line-height: 1.3; }
      tbody th { font-size: 0.875rem; min-width: 128px; }
      .compare { border-radius: 20px; }
      summary { font-size: 1.0625rem; }
    }
  `]
})
export class PricingComponent {
  private transloco = inject(TranslocoService);

  readonly plans: Plan[] = [
    { ...SERVICE_PRICES.residential, key: 'RESIDENTIAL', popular: true },
    { ...SERVICE_PRICES.deep_cleaning, key: 'DEEPCLEANING' },
    { ...SERVICE_PRICES.commercial, key: 'COMMERCIAL' },
    { ...SERVICE_PRICES.post_construction, key: 'POSTCONSTRUCTION' },
  ];

  readonly comparison = COMPARISON;
  readonly addOns = ADD_ONS;

  readonly discounts = [
    { key: 'ONE_TIME', percent: FREQUENCY_DISCOUNTS['one-time'] * 100 },
    { key: 'MONTHLY', percent: FREQUENCY_DISCOUNTS['monthly'] * 100 },
    { key: 'BI_WEEKLY', percent: FREQUENCY_DISCOUNTS['bi-weekly'] * 100 },
    { key: 'WEEKLY', percent: FREQUENCY_DISCOUNTS['weekly'] * 100 },
  ];

  readonly factors = [
    { key: 'AREA', icon: 'ruler' },
    { key: 'PROPERTY_TYPE', icon: 'home' },
  ];

  readonly guarantees = [
    { key: 'TRANSPARENT', icon: 'dollar' },
    { key: 'SATISFACTION', icon: 'shield-check' },
    { key: 'BEST_PRICE', icon: 'award' },
  ];

  readonly faq = ['PAYMENT_METHODS', 'ADVANCE_PAYMENT', 'EXTRA_FEES', 'MODIFY_BOOKING', 'LOCATION_PRICING', 'CUSTOM_QUOTE'];

  list(key: string): string[] {
    const value = this.transloco.translate(key);
    return Array.isArray(value) ? value : [];
  }

  /** Factor items are written "Label : value"; show them as a priced row. */
  label(item: string): string {
    return item.split(/\s*:\s*/)[0];
  }

  value(item: string): string {
    return item.split(/\s*:\s*/).slice(1).join(': ');
  }
}
