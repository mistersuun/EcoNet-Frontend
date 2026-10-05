import { Component, DestroyRef, ElementRef, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { NgTemplateOutlet, isPlatformBrowser } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { EmailService, BookingFormData } from '../../services/email.service';
import { SuccessModalComponent } from '../../shared/components/success-modal.component';
import { IconComponent } from '../../shared/components/icon.component';
import {
  ADD_ONS, AREA_MULTIPLIERS, AreaRange, Estimate, FREQUENCY_DISCOUNTS, PROPERTY_TYPE_MULTIPLIERS,
  PropertyType, SERVICE_PRICES, ServiceId, estimatePrice,
} from '../../shared/pricing';

interface Step {
  /** Key under BOOKING.STEPS */
  key: string;
  /** Controls validated before leaving the step */
  controls: string[];
}

const STEPS: Step[] = [
  { key: 'SERVICE', controls: ['service'] },
  { key: 'PROPERTY', controls: ['propertyType', 'area'] },
  { key: 'SCHEDULE', controls: ['preferredDate', 'timeSlot', 'frequency'] },
  { key: 'CONTACT', controls: ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'postalCode'] },
  { key: 'REVIEW', controls: [] },
];

/** i18n key (under BOOKING.ERRORS) for each control's validation error */
const ERROR_KEYS: Record<string, Record<string, string>> = {
  service: { required: 'SERVICE' },
  propertyType: { required: 'PROPERTY_TYPE' },
  area: { required: 'SIZE' },
  preferredDate: { required: 'DATE', past: 'DATE_PAST' },
  timeSlot: { required: 'TIME' },
  firstName: { required: 'FIRST_NAME' },
  lastName: { required: 'LAST_NAME' },
  email: { required: 'EMAIL', email: 'EMAIL_FORMAT' },
  phone: { required: 'PHONE', phone: 'PHONE_FORMAT' },
  address: { required: 'ADDRESS' },
  city: { required: 'CITY' },
  postalCode: { required: 'POSTAL_CODE', pattern: 'POSTAL_CODE_FORMAT' },
};

const SERVICES: { id: ServiceId; key: string; popular?: boolean }[] = [
  { id: 'residential', key: 'RESIDENTIAL', popular: true },
  { id: 'deep_cleaning', key: 'DEEP_CLEANING' },
  { id: 'commercial', key: 'COMMERCIAL' },
];

const RESIDENTIAL_TYPES: PropertyType[] = ['apartment', 'house', 'townhouse'];
const COMMERCIAL_TYPES: PropertyType[] = ['office', 'retail'];
const AREAS = Object.keys(AREA_MULTIPLIERS) as AreaRange[];

const BEDROOMS = [
  { value: '0', key: 'B0' }, { value: '1', key: 'B1' }, { value: '2', key: 'B2' },
  { value: '3', key: 'B3' }, { value: '4', key: 'B4' }, { value: '5+', key: 'B5' },
];
const BATHROOMS = [
  { value: '1', key: 'BA1' }, { value: '1.5', key: 'BA15' }, { value: '2', key: 'BA2' },
  { value: '2.5', key: 'BA25' }, { value: '3+', key: 'BA3' },
];

// Every slot is offered; the team confirms availability with the customer.
const TIME_SLOTS = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

const FREQUENCIES = [
  { value: 'one-time', key: 'ONE_TIME' },
  { value: 'monthly', key: 'MONTHLY' },
  { value: 'bi-weekly', key: 'BI_WEEKLY' },
  { value: 'weekly', key: 'WEEKLY' },
];

/** Local YYYY-MM-DD for today + `days` */
function localDate(days = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function futureDate(control: AbstractControl): ValidationErrors | null {
  return control.value && control.value < localDate(1) ? { past: true } : null;
}

function phoneNumber(control: AbstractControl): ValidationErrors | null {
  if (!control.value) return null;
  const digits = String(control.value).replace(/\D/g, '');
  return digits.length === 10 || (digits.length === 11 && digits.startsWith('1')) ? null : { phone: true };
}

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [NgTemplateOutlet, ReactiveFormsModule, RouterLink, TranslocoPipe, SuccessModalComponent, IconComponent],
  template: `
    <section class="ui-hero bk-hero">
      <div class="ui-hero-inner">
        <p class="ui-eyebrow">{{ 'BOOKING.HERO.EYEBROW' | transloco }}</p>
        <h1 class="ui-hero-title">
          {{ 'BOOKING.HERO.TITLE' | transloco }}
          <span class="accent">{{ 'BOOKING.HERO.TITLE_ACCENT' | transloco }}</span>
        </h1>
        <p class="ui-hero-subtitle">{{ 'BOOKING.HERO.SUBTITLE' | transloco }}</p>
      </div>
    </section>

    <section class="bk">
      <div class="ui-wrap bk-wrap">

        <!-- Step indicator -->
        <nav class="stepper" [attr.aria-label]="'BOOKING.STEPS.PROGRESS' | transloco: { current: current + 1, total: steps.length }">
          <ol>
            @for (step of steps; track step.key; let i = $index) {
              <li [class.current]="i === current" [class.done]="isStepDone(i)">
                <button type="button" class="step-btn" [disabled]="!canGoTo(i)" (click)="goTo(i)"
                        [attr.aria-current]="i === current ? 'step' : null">
                  <span class="step-dot" aria-hidden="true">
                    @if (isStepDone(i)) { <app-icon name="check" [size]="16" [stroke]="2.5" /> } @else { {{ i + 1 }} }
                  </span>
                  <span class="step-label">{{ 'BOOKING.STEPS.' + step.key | transloco }}</span>
                  @if (isStepDone(i)) { <span class="sr-only">({{ 'BOOKING.STEPS.COMPLETED' | transloco }})</span> }
                </button>
              </li>
            }
          </ol>
          <p class="stepper-progress" aria-hidden="true">
            {{ 'BOOKING.STEPS.PROGRESS' | transloco: { current: current + 1, total: steps.length } }}
            · <strong>{{ 'BOOKING.STEPS.' + steps[current].key | transloco }}</strong>
          </p>
        </nav>

        <div class="bk-grid">
          <form id="booking-form" class="bk-form" [formGroup]="form" (ngSubmit)="primaryAction()" novalidate>

            @if (showErrors[current] && stepErrors().length) {
              <div class="error-summary" role="alert" tabindex="-1">
                <p><app-icon name="alert-triangle" [size]="18" /> {{ 'BOOKING.ERRORS.SUMMARY' | transloco }}</p>
                <ul>
                  @for (err of stepErrors(); track err.control) {
                    <li><a [href]="'#f-' + err.control" (click)="focusField(err.control, $event)">{{ 'BOOKING.ERRORS.' + err.key | transloco }}</a></li>
                  }
                </ul>
              </div>
            }

            @switch (current) {
              <!-- 1. Service -->
              @case (0) {
                <header class="step-head">
                  <h2 class="step-title" tabindex="-1">{{ 'BOOKING.STEP_1.TITLE' | transloco }}</h2>
                  <p class="step-sub">{{ 'BOOKING.STEP_1.SUBTITLE' | transloco }}</p>
                </header>
                <fieldset class="group" id="f-service" [attr.aria-invalid]="invalid('service')">
                  <legend class="sr-only">{{ 'BOOKING.STEPS.SERVICE' | transloco }}</legend>
                  <div class="services">
                    @for (s of services; track s.id) {
                      <label class="choice service" [class.selected]="form.value.service === s.id">
                        <input type="radio" class="sr-only" formControlName="service" [value]="s.id">
                        <span class="card-top">
                          <span class="ui-chip lg"><app-icon [name]="price(s.id).icon" [size]="24" /></span>
                          @if (s.popular) { <span class="badge">{{ 'BOOKING.STEP_1.POPULAR' | transloco }}</span> }
                          <span class="tick" aria-hidden="true"><app-icon name="check" [size]="14" [stroke]="3" /></span>
                        </span>
                        <span class="card-title">{{ 'BOOKING.SERVICES.' + s.key + '.NAME' | transloco }}</span>
                        <span class="card-desc">{{ 'BOOKING.SERVICES.' + s.key + '.DESCRIPTION' | transloco }}</span>
                        <span class="card-meta">
                          <span><span class="muted from">{{ 'BOOKING.STEP_1.FROM' | transloco }}</span><strong>{{ money(price(s.id).from) }}</strong></span>
                          <span class="muted"><app-icon name="clock" [size]="15" /> {{ 'BOOKING.SERVICES.' + s.key + '.DURATION' | transloco }}</span>
                        </span>
                      </label>
                    }
                  </div>
                  @if (showMessage('service')) { <p class="field-error"><app-icon name="alert-triangle" [size]="15" /> {{ errorKey('service') | transloco }}</p> }
                </fieldset>
                <p class="aside-link">
                  {{ 'BOOKING.STEP_1.POST_CONSTRUCTION' | transloco }}
                  <a routerLink="/contact" class="ui-link">{{ 'BOOKING.STEP_1.POST_CONSTRUCTION_LINK' | transloco }} <app-icon name="chevron-right" [size]="16" [stroke]="2.25" /></a>
                </p>
              }

              <!-- 2. Property -->
              @case (1) {
                <header class="step-head">
                  <h2 class="step-title" tabindex="-1">{{ 'BOOKING.STEP_2.TITLE' | transloco }}</h2>
                  <p class="step-sub">{{ 'BOOKING.STEP_2.SUBTITLE' | transloco }}</p>
                </header>

                <fieldset class="group" id="f-propertyType" [attr.aria-invalid]="invalid('propertyType')">
                  <legend class="group-label">{{ 'BOOKING.STEP_2.PROPERTY_TYPE' | transloco }}</legend>
                  <div class="options cols-3">
                    @for (t of propertyTypes(); track t) {
                      <label class="choice option" [class.selected]="form.value.propertyType === t">
                        <input type="radio" class="sr-only" formControlName="propertyType" [value]="t">
                        <span class="option-name">{{ 'BOOKING.PROPERTY_TYPES.' + t.toUpperCase() | transloco }}</span>
                        <span class="option-effect">{{ typeEffect(t) }}</span>
                        <span class="tick" aria-hidden="true"><app-icon name="check" [size]="14" [stroke]="3" /></span>
                      </label>
                    }
                  </div>
                  @if (showMessage('propertyType')) { <p class="field-error"><app-icon name="alert-triangle" [size]="15" /> {{ errorKey('propertyType') | transloco }}</p> }
                  @if (typeMultiplier() > 1) {
                    <p class="note"><app-icon name="help-circle" [size]="16" /> {{ 'BOOKING.STEP_2.HOUSE_NOTE' | transloco: { percent: pct(typeMultiplier() - 1) } }}</p>
                  }
                </fieldset>

                <fieldset class="group" id="f-area" [attr.aria-invalid]="invalid('area')">
                  <legend class="group-label">{{ 'BOOKING.STEP_2.SIZE' | transloco }}</legend>
                  <div class="options cols-4">
                    @for (a of areas; track a) {
                      <label class="choice option" [class.selected]="form.value.area === a">
                        <input type="radio" class="sr-only" formControlName="area" [value]="a">
                        <span class="option-name">{{ 'BOOKING.SIZES.' + a | transloco }}</span>
                        <span class="option-effect">{{ areaEffect(a) }}</span>
                        <span class="tick" aria-hidden="true"><app-icon name="check" [size]="14" [stroke]="3" /></span>
                      </label>
                    }
                  </div>
                  @if (showMessage('area')) { <p class="field-error"><app-icon name="alert-triangle" [size]="15" /> {{ errorKey('area') | transloco }}</p> }
                  @if (estimate.quoteRequired) {
                    <p class="note"><app-icon name="ruler" [size]="16" /> {{ 'BOOKING.STEP_2.QUOTE_NOTE' | transloco }}</p>
                  }
                </fieldset>

                @if (isResidential()) {
                  <div class="row-2">
                    <div class="field">
                      <label for="f-bedrooms">{{ 'BOOKING.STEP_2.BEDROOMS' | transloco }} <span class="opt">({{ 'BOOKING.STEP_2.OPTIONAL' | transloco }})</span></label>
                      <select id="f-bedrooms" formControlName="bedrooms" class="input">
                        <option value="">{{ 'BOOKING.STEP_2.SELECT' | transloco }}</option>
                        @for (b of bedrooms; track b.value) { <option [value]="b.value">{{ 'BOOKING.BEDROOM_OPTIONS.' + b.key | transloco }}</option> }
                      </select>
                    </div>
                    <div class="field">
                      <label for="f-bathrooms">{{ 'BOOKING.STEP_2.BATHROOMS' | transloco }} <span class="opt">({{ 'BOOKING.STEP_2.OPTIONAL' | transloco }})</span></label>
                      <select id="f-bathrooms" formControlName="bathrooms" class="input">
                        <option value="">{{ 'BOOKING.STEP_2.SELECT' | transloco }}</option>
                        @for (b of bathrooms; track b.value) { <option [value]="b.value">{{ 'BOOKING.BATHROOM_OPTIONS.' + b.key | transloco }}</option> }
                      </select>
                    </div>
                  </div>
                }

                <fieldset class="group">
                  <legend class="group-label">{{ 'BOOKING.STEP_2.ADD_ONS' | transloco }}</legend>
                  <p class="group-hint">{{ 'BOOKING.STEP_2.ADD_ONS_HINT' | transloco }}</p>
                  <div class="options cols-addons">
                    @for (addon of addOns; track addon.id) {
                      <label class="choice option addon" [class.selected]="form.get('addon_' + addon.id)?.value">
                        <input type="checkbox" class="sr-only" [formControlName]="'addon_' + addon.id">
                        <span class="box" aria-hidden="true"><app-icon name="check" [size]="14" [stroke]="3" /></span>
                        <span class="option-name">{{ addon.name | transloco }}</span>
                        <span class="option-price">+{{ money(addon.price) }}</span>
                      </label>
                    }
                  </div>
                </fieldset>

                <div class="field">
                  <label for="f-specialInstructions">{{ 'BOOKING.STEP_2.SPECIAL_INSTRUCTIONS' | transloco }} <span class="opt">({{ 'BOOKING.STEP_2.OPTIONAL' | transloco }})</span></label>
                  <textarea id="f-specialInstructions" formControlName="specialInstructions" class="input" rows="4"
                            [placeholder]="'BOOKING.STEP_2.SPECIAL_INSTRUCTIONS_PLACEHOLDER' | transloco"></textarea>
                </div>
              }

              <!-- 3. Schedule -->
              @case (2) {
                <header class="step-head">
                  <h2 class="step-title" tabindex="-1">{{ 'BOOKING.STEP_3.TITLE' | transloco }}</h2>
                  <p class="step-sub">{{ 'BOOKING.STEP_3.SUBTITLE' | transloco }}</p>
                </header>

                <div class="field date-field">
                  <label for="f-preferredDate">{{ 'BOOKING.STEP_3.DATE' | transloco }}</label>
                  <input id="f-preferredDate" type="date" formControlName="preferredDate" class="input" [min]="minDate"
                         [attr.aria-invalid]="invalid('preferredDate')" [attr.aria-describedby]="showMessage('preferredDate') ? 'e-preferredDate' : null">
                  @if (showMessage('preferredDate')) { <p class="field-error" id="e-preferredDate"><app-icon name="alert-triangle" [size]="15" /> {{ errorKey('preferredDate') | transloco }}</p> }
                </div>

                <fieldset class="group" id="f-timeSlot" [attr.aria-invalid]="invalid('timeSlot')">
                  <legend class="group-label">{{ 'BOOKING.STEP_3.TIME' | transloco }}</legend>
                  <div class="slots">
                    @for (slot of timeSlots; track slot) {
                      <label class="slot" [class.selected]="form.value.timeSlot === slot">
                        <input type="radio" class="sr-only" formControlName="timeSlot" [value]="slot">
                        {{ slot }}
                      </label>
                    }
                  </div>
                  @if (showMessage('timeSlot')) { <p class="field-error"><app-icon name="alert-triangle" [size]="15" /> {{ errorKey('timeSlot') | transloco }}</p> }
                </fieldset>

                <fieldset class="group" id="f-frequency">
                  <legend class="group-label">{{ 'BOOKING.STEP_3.FREQUENCY' | transloco }}</legend>
                  <p class="group-hint">{{ 'BOOKING.STEP_3.FREQUENCY_HINT' | transloco }}</p>
                  <div class="options cols-4">
                    @for (f of frequencies; track f.value) {
                      <label class="choice option" [class.selected]="form.value.frequency === f.value">
                        <input type="radio" class="sr-only" formControlName="frequency" [value]="f.value">
                        <span class="option-name">{{ 'BOOKING.FREQUENCY_OPTIONS.' + f.key + '.NAME' | transloco }}</span>
                        <span class="option-effect" [class.save]="discount(f.value)">
                          @if (discount(f.value)) {
                            {{ 'BOOKING.STEP_3.SAVE' | transloco: { percent: pct(discount(f.value)) } }}
                          } @else {
                            {{ 'BOOKING.STEP_3.FULL_PRICE' | transloco }}
                          }
                        </span>
                        <span class="tick" aria-hidden="true"><app-icon name="check" [size]="14" [stroke]="3" /></span>
                      </label>
                    }
                  </div>
                </fieldset>
              }

              <!-- 4. Contact -->
              @case (3) {
                <header class="step-head">
                  <h2 class="step-title" tabindex="-1">{{ 'BOOKING.STEP_4.TITLE' | transloco }}</h2>
                  <p class="step-sub">{{ 'BOOKING.STEP_4.SUBTITLE' | transloco }}</p>
                </header>
                <div class="row-2">
                  <ng-container *ngTemplateOutlet="field; context: { name: 'firstName', label: 'BOOKING.STEP_4.FIRST_NAME', type: 'text', auto: 'given-name' }" />
                  <ng-container *ngTemplateOutlet="field; context: { name: 'lastName', label: 'BOOKING.STEP_4.LAST_NAME', type: 'text', auto: 'family-name' }" />
                </div>
                <div class="row-2">
                  <ng-container *ngTemplateOutlet="field; context: { name: 'email', label: 'BOOKING.STEP_4.EMAIL', type: 'email', auto: 'email' }" />
                  <ng-container *ngTemplateOutlet="field; context: { name: 'phone', label: 'BOOKING.STEP_4.PHONE', type: 'tel', auto: 'tel', placeholder: '514 555-0123' }" />
                </div>
                <ng-container *ngTemplateOutlet="field; context: { name: 'address', label: 'BOOKING.STEP_4.ADDRESS', type: 'text', auto: 'street-address', placeholderKey: 'BOOKING.STEP_4.ADDRESS_PLACEHOLDER' }" />
                <div class="row-2">
                  <ng-container *ngTemplateOutlet="field; context: { name: 'city', label: 'BOOKING.STEP_4.CITY', type: 'text', auto: 'address-level2', placeholder: 'Montréal' }" />
                  <ng-container *ngTemplateOutlet="field; context: { name: 'postalCode', label: 'BOOKING.STEP_4.POSTAL_CODE', type: 'text', auto: 'postal-code', placeholder: 'H2X 1Y4' }" />
                </div>
              }

              <!-- 5. Review -->
              @case (4) {
                <header class="step-head">
                  <h2 class="step-title" tabindex="-1">{{ 'BOOKING.STEP_5.TITLE' | transloco }}</h2>
                  <p class="step-sub">{{ 'BOOKING.STEP_5.SUBTITLE' | transloco }}</p>
                </header>
                <div class="review">
                  <div class="review-block">
                    <div class="review-head"><h3>{{ 'BOOKING.STEP_5.SERVICE' | transloco }}</h3>
                      <button type="button" class="edit" (click)="goTo(0)">{{ 'BOOKING.STEP_5.EDIT' | transloco }}</button></div>
                    <p>{{ serviceNameKey() | transloco }}</p>
                  </div>
                  <div class="review-block">
                    <div class="review-head"><h3>{{ 'BOOKING.STEP_5.PROPERTY' | transloco }}</h3>
                      <button type="button" class="edit" (click)="goTo(1)">{{ 'BOOKING.STEP_5.EDIT' | transloco }}</button></div>
                    <p>
                      {{ 'BOOKING.PROPERTY_TYPES.' + (form.value.propertyType || '').toUpperCase() | transloco }}
                      · {{ 'BOOKING.SIZES.' + form.value.area | transloco }}
                      @if (form.value.bedrooms) { · {{ 'BOOKING.BEDROOM_OPTIONS.' + roomKey(bedrooms, form.value.bedrooms) | transloco }} }
                      @if (form.value.bathrooms) { · {{ 'BOOKING.BATHROOM_OPTIONS.' + roomKey(bathrooms, form.value.bathrooms) | transloco }} }
                    </p>
                    @if (estimate.addOns.length) {
                      <p class="muted">{{ addOnNames() }}</p>
                    }
                    @if (form.value.specialInstructions) { <p class="muted quote">“{{ form.value.specialInstructions }}”</p> }
                  </div>
                  <div class="review-block">
                    <div class="review-head"><h3>{{ 'BOOKING.STEP_5.SCHEDULE' | transloco }}</h3>
                      <button type="button" class="edit" (click)="goTo(2)">{{ 'BOOKING.STEP_5.EDIT' | transloco }}</button></div>
                    <p>{{ formatDate(form.value.preferredDate) }} {{ 'BOOKING.STEP_5.AT' | transloco }} {{ form.value.timeSlot }}</p>
                    <p class="muted">{{ 'BOOKING.FREQUENCY_OPTIONS.' + frequencyKey() + '.NAME' | transloco }}</p>
                  </div>
                  <div class="review-block">
                    <div class="review-head"><h3>{{ 'BOOKING.STEP_5.CONTACT' | transloco }}</h3>
                      <button type="button" class="edit" (click)="goTo(3)">{{ 'BOOKING.STEP_5.EDIT' | transloco }}</button></div>
                    <p>{{ form.value.firstName }} {{ form.value.lastName }}</p>
                    <p class="muted">{{ form.value.email }} · {{ form.value.phone }}</p>
                    <p class="muted">{{ form.value.address }}, {{ form.value.city }} {{ (form.value.postalCode || "").toUpperCase() }}</p>
                  </div>
                </div>
              }
            }

            <div class="actions">
              @if (current > 0) {
                <button type="button" class="ui-pill ghost back" (click)="back()">
                  <app-icon name="chevron-left" [size]="18" [stroke]="2.25" /> {{ 'BOOKING.NAV.BACK' | transloco }}
                </button>
              }
              <button type="submit" class="ui-pill primary" [disabled]="isSubmitting">
                <ng-container *ngTemplateOutlet="primaryLabel" />
              </button>
            </div>
          </form>

          <!-- Estimate -->
          <aside class="summary" aria-live="polite">
            <h2 class="summary-title">{{ 'BOOKING.SUMMARY.TITLE' | transloco }}</h2>
            @if (!form.value.service) {
              <p class="summary-empty">{{ 'BOOKING.SUMMARY.EMPTY' | transloco }}</p>
            } @else {
              <div class="summary-service">
                <span class="ui-chip"><app-icon [name]="price(form.value.service).icon" [size]="20" /></span>
                <div>
                  <strong>{{ serviceNameKey() | transloco }}</strong>
                  <span>
                    {{ form.value.area ? ('BOOKING.SIZES.' + form.value.area | transloco) : ('BOOKING.STEPS.PROPERTY' | transloco) + ' : ' + ('BOOKING.SUMMARY.NOT_SELECTED' | transloco) }}
                  </span>
                </div>
              </div>
              <ul class="lines">
                <li><span>{{ 'BOOKING.SUMMARY.BASE' | transloco }}</span><span>{{ money(estimate.base) }}</span></li>
                @if (!estimate.quoteRequired && estimate.areaAdjustment) {
                  <li><span>{{ 'BOOKING.SUMMARY.SIZE_ADJ' | transloco }} <em>({{ 'BOOKING.EFFECT.PLUS' | transloco: { percent: pct(estimate.areaMultiplier - 1) } }})</em></span><span>+{{ money(estimate.areaAdjustment) }}</span></li>
                }
                @if (!estimate.quoteRequired && estimate.propertyTypeAdjustment) {
                  <li><span>{{ 'BOOKING.SUMMARY.TYPE_ADJ' | transloco }} <em>({{ 'BOOKING.EFFECT.PLUS' | transloco: { percent: pct(estimate.propertyTypeMultiplier - 1) } }})</em></span><span>+{{ money(estimate.propertyTypeAdjustment) }}</span></li>
                }
                @for (a of estimate.addOns; track a.id) {
                  <li><span>{{ a.name | transloco }}</span><span>+{{ money(a.price) }}</span></li>
                }
                @if (!estimate.quoteRequired && estimate.discount) {
                  <li class="save"><span>{{ 'BOOKING.SUMMARY.DISCOUNT' | transloco }} <em>({{ 'BOOKING.EFFECT.MINUS' | transloco: { percent: pct(estimate.discountRate) } }})</em></span><span>−{{ money(estimate.discount) }}</span></li>
                }
              </ul>
              @if (estimate.quoteRequired) {
                <div class="quote-box">
                  <strong>{{ 'BOOKING.SUMMARY.QUOTE' | transloco }}</strong>
                  <p>{{ 'BOOKING.SUMMARY.QUOTE_TEXT' | transloco }}</p>
                </div>
              } @else {
                <ul class="lines totals">
                  <li><span>{{ 'BOOKING.SUMMARY.SUBTOTAL' | transloco }}</span><span>{{ money(estimate.subtotal) }}</span></li>
                  <li><span>{{ 'BOOKING.SUMMARY.TAXES' | transloco }}</span><span>{{ money(estimate.taxes) }}</span></li>
                </ul>
                <p class="total"><span>{{ 'BOOKING.SUMMARY.TOTAL' | transloco }}</span><strong>{{ money(estimate.total) }}</strong></p>
              }
              <p class="disclaimer">{{ 'BOOKING.SUMMARY.DISCLAIMER' | transloco }}</p>
            }
          </aside>
        </div>
      </div>
    </section>

    <!-- Mobile bottom bar -->
    <div class="mobile-bar">
      <div class="bar-total">
        <span>{{ 'BOOKING.SUMMARY.ESTIMATE' | transloco }}</span>
        <strong>
          @if (!form.value.service) { — }
          @else if (estimate.quoteRequired) { {{ 'BOOKING.SUMMARY.QUOTE' | transloco }} }
          @else { {{ money(estimate.total) }} }
        </strong>
      </div>
      <button type="submit" form="booking-form" class="ui-pill sm" [disabled]="isSubmitting">
        <ng-container *ngTemplateOutlet="primaryLabel" />
      </button>
    </div>

    <ng-template #primaryLabel>
      @if (isSubmitting) {
        {{ 'BOOKING.NAV.SUBMITTING' | transloco }}
      } @else if (current === steps.length - 1) {
        {{ 'BOOKING.NAV.CONFIRM' | transloco }}
      } @else {
        {{ 'BOOKING.NAV.CONTINUE' | transloco }} <app-icon name="chevron-right" [size]="18" [stroke]="2.25" />
      }
    </ng-template>

    <ng-template #field let-name="name" let-label="label" let-type="type" let-auto="auto" let-placeholder="placeholder" let-placeholderKey="placeholderKey">
      <div class="field" [formGroup]="form">
        <label [for]="'f-' + name">{{ label | transloco }}</label>
        <input [id]="'f-' + name" [type]="type" [formControlName]="name" class="input" [attr.autocomplete]="auto"
               [placeholder]="placeholderKey ? (placeholderKey | transloco) : (placeholder || '')"
               [attr.aria-invalid]="invalid(name)" [attr.aria-describedby]="showMessage(name) ? 'e-' + name : null">
        @if (showMessage(name)) { <p class="field-error" [id]="'e-' + name"><app-icon name="alert-triangle" [size]="15" /> {{ errorKey(name) | transloco }}</p> }
      </div>
    </ng-template>

    <app-success-modal
      [isVisible]="showSuccessModal"
      [title]="'BOOKING.SUCCESS_TITLE' | transloco"
      [message]="'BOOKING.SUCCESS_MESSAGE' | transloco"
      [primaryButtonText]="'COMMON.RETURN_HOME'"
      [redirectTo]="'/'"
      [autoRedirect]="true"
      [redirectDelay]="5000"
      (close)="showSuccessModal = false" />

    @if (showErrorModal) {
      <app-success-modal
        [isVisible]="showErrorModal"
        [title]="'COMMON.ERROR'"
        [message]="'BOOKING.ERROR_MESSAGE' | transloco"
        [primaryButtonText]="'COMMON.CLOSE'"
        (close)="showErrorModal = false" />
    }
  `,
  styles: [`
    :host { display: block; background: #fff; color: var(--ui-ink); }
    .sr-only {
      position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
      overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0;
    }
    .muted { color: var(--ui-muted); }

    .bk-hero { padding-bottom: clamp(32px, 5vh, 56px); }
    .bk-hero .ui-hero-title { font-size: clamp(2.5rem, 6.5vw, 4.5rem); }
    .bk { padding: 0 0 clamp(80px, 10vw, 128px); }
    .bk-wrap { max-width: 1200px; }

    /* ---------- step indicator ---------- */
    .stepper { margin: 0 auto clamp(32px, 5vw, 56px); max-width: 860px; }
    .stepper ol { list-style: none; margin: 0; padding: 0; display: flex; align-items: center; }
    .stepper li { flex: 1; display: flex; align-items: center; }
    .stepper li:not(:last-child)::after {
      content: ''; flex: 1; height: 2px; margin: 0 12px; border-radius: 2px; background: var(--ui-line);
      transition: background-color 0.4s var(--ui-ease);
    }
    .stepper li.done:not(:last-child)::after { background: var(--ui-green); }
    .stepper li:last-child { flex: 0 0 auto; }
    .step-btn {
      display: flex; align-items: center; gap: 10px; padding: 4px; border: 0; background: none;
      font: inherit; color: var(--ui-muted); cursor: pointer; border-radius: 980px; white-space: nowrap;
    }
    .step-btn:disabled { cursor: default; }
    .step-btn:focus-visible { outline: 3px solid var(--ui-green); outline-offset: 2px; }
    .step-dot {
      width: 32px; height: 32px; border-radius: 50%; flex-shrink: 0;
      display: inline-flex; align-items: center; justify-content: center;
      font-size: 0.875rem; font-weight: 600; background: var(--ui-surface); color: var(--ui-muted);
      transition: background-color 0.3s var(--ui-ease), color 0.3s var(--ui-ease);
    }
    .step-label { font-size: 0.9375rem; font-weight: 500; }
    li.current .step-dot { background: var(--ui-green-deep); color: #fff; }
    li.current .step-btn { color: var(--ui-ink); }
    li.current .step-label { font-weight: 600; }
    li.done .step-dot { background: var(--ui-mint); color: var(--ui-green-deep); }
    li.done .step-btn { color: var(--ui-ink); }
    li.done .step-btn:hover .step-label { text-decoration: underline; text-underline-offset: 3px; }
    .stepper-progress { display: none; margin: 14px 0 0; text-align: center; font-size: 0.875rem; color: var(--ui-muted); }
    .stepper-progress strong { color: var(--ui-ink); font-weight: 600; }

    /* ---------- layout ---------- */
    .bk-grid { display: grid; grid-template-columns: minmax(0, 1fr) 360px; gap: clamp(32px, 4vw, 64px); align-items: start; }
    .bk-form { min-width: 0; }
    .step-head { margin-bottom: 32px; }
    .step-title {
      font-size: clamp(1.75rem, 3.6vw, 2.5rem); font-weight: 600; letter-spacing: -0.025em; line-height: 1.1;
      margin: 0 0 10px; color: var(--ui-ink); outline: none;
    }
    .step-sub { margin: 0; color: var(--ui-muted); font-size: 1.0625rem; line-height: 1.5; }

    /* ---------- groups & cards ---------- */
    fieldset { border: 0; padding: 0; margin: 0; min-width: 0; }
    .group { margin-bottom: 36px; }
    .group-label { padding: 0; font-size: 1.0625rem; font-weight: 600; color: var(--ui-ink); margin-bottom: 14px; }
    .group-hint { margin: -8px 0 14px; color: var(--ui-muted); font-size: 0.9375rem; }

    .choice {
      position: relative; display: flex; flex-direction: column; cursor: pointer;
      background: var(--ui-surface); border-radius: 20px; color: var(--ui-ink);
      box-shadow: inset 0 0 0 1.5px transparent;
      transition: box-shadow 0.25s var(--ui-ease), background-color 0.25s var(--ui-ease), transform 0.25s var(--ui-ease);
    }
    .choice:hover { background: #eeeef0; }
    .choice.selected { background: #fff; box-shadow: inset 0 0 0 2px var(--ui-green-deep), 0 18px 40px -24px rgba(31, 58, 48, 0.35); }
    .choice:active { transform: scale(0.99); }
    .choice:has(input:focus-visible), .slot:has(input:focus-visible) { outline: 3px solid var(--ui-green); outline-offset: 3px; }
    .tick {
      position: absolute; top: 16px; right: 16px; width: 24px; height: 24px; border-radius: 50%;
      display: inline-flex; align-items: center; justify-content: center;
      box-shadow: inset 0 0 0 1.5px #c7c7cc; color: transparent; background: #fff;
      transition: all 0.25s var(--ui-ease);
    }
    .selected .tick { background: var(--ui-green-deep); box-shadow: none; color: #fff; }

    .services { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
    .choice.service { padding: 24px; border-radius: 28px; }
    .card-top { display: flex; align-items: center; gap: 10px; margin-bottom: 20px; }
    .choice.service .tick { top: 24px; right: 24px; }
    .badge {
      font-size: 0.6875rem; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase;
      color: var(--ui-green-deep); background: var(--ui-mint); padding: 5px 9px; border-radius: 980px;
    }
    .card-title { font-size: 1.25rem; font-weight: 600; letter-spacing: -0.015em; margin-bottom: 6px; }
    .card-desc { color: var(--ui-muted); font-size: 0.9375rem; line-height: 1.45; margin-bottom: 20px; flex: 1; }
    .card-meta {
      display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 8px;
      padding-top: 16px; border-top: 1px solid var(--ui-line); font-size: 0.9375rem;
    }
    .card-meta .from { margin-right: 6px; }
    .card-meta strong { font-size: 1.125rem; font-weight: 600; }
    .card-meta .muted { display: inline-flex; align-items: center; gap: 4px; }
    .aside-link { margin: 8px 0 0; color: var(--ui-muted); display: flex; flex-wrap: wrap; align-items: center; gap: 4px 12px; }
    .aside-link .ui-link { font-size: 1rem; }

    .options { display: grid; gap: 12px; }
    .options.cols-3 { grid-template-columns: repeat(3, 1fr); }
    .options.cols-4 { grid-template-columns: repeat(4, 1fr); }
    .options.cols-addons { grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); }
    .choice.option { padding: 18px 48px 18px 18px; min-height: 84px; justify-content: center; gap: 4px; }
    .option-name { font-weight: 600; font-size: 1rem; line-height: 1.3; }
    .option-effect { font-size: 0.875rem; color: var(--ui-muted); }
    .option-effect.save { color: var(--ui-green-deep); font-weight: 500; }
    .choice.option.addon { flex-direction: row; align-items: center; justify-content: flex-start; gap: 14px; padding: 16px 18px; min-height: 64px; }
    .addon .option-name { flex: 1; font-weight: 500; }
    .option-price { font-weight: 600; white-space: nowrap; }
    .box {
      width: 22px; height: 22px; border-radius: 7px; flex-shrink: 0; background: #fff;
      display: inline-flex; align-items: center; justify-content: center;
      box-shadow: inset 0 0 0 1.5px #c7c7cc; color: transparent; transition: all 0.2s var(--ui-ease);
    }
    .selected .box { background: var(--ui-green-deep); box-shadow: none; color: #fff; }

    .note {
      display: flex; gap: 10px; align-items: flex-start; margin: 14px 0 0; padding: 14px 16px;
      background: var(--ui-mint); color: var(--ui-green-ink); border-radius: 14px; font-size: 0.9375rem; line-height: 1.45;
    }
    .note app-icon { margin-top: 2px; color: var(--ui-green-deep); }

    .slots { display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px; }
    .slot {
      display: flex; align-items: center; justify-content: center; min-height: 52px; border-radius: 14px; cursor: pointer;
      background: var(--ui-surface); font-weight: 500; font-variant-numeric: tabular-nums;
      box-shadow: inset 0 0 0 1.5px transparent; transition: all 0.2s var(--ui-ease);
    }
    .slot:hover { background: #eeeef0; }
    .slot.selected { background: var(--ui-green-deep); color: #fff; }

    /* ---------- inputs ---------- */
    .row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .field { margin-bottom: 24px; min-width: 0; }
    .field label { display: block; font-weight: 600; font-size: 0.9375rem; margin-bottom: 8px; color: var(--ui-ink); }
    .opt { font-weight: 400; color: var(--ui-muted); }
    .input {
      display: block; width: 100%; min-height: 54px; padding: 14px 16px; box-sizing: border-box;
      font: inherit; font-size: 1.0625rem; color: var(--ui-ink); background: #fff;
      border: 1.5px solid #d2d2d7; border-radius: 14px; appearance: none; -webkit-appearance: none;
      transition: border-color 0.2s var(--ui-ease), box-shadow 0.2s var(--ui-ease);
    }
    .input::placeholder { color: #a1a1a6; }
    .input:hover { border-color: #b0b0b5; }
    .input:focus { outline: none; border-color: var(--ui-green-deep); box-shadow: 0 0 0 4px rgba(107, 144, 128, 0.22); }
    .input[aria-invalid="true"] { border-color: #d70015; }
    .input[aria-invalid="true"]:focus { box-shadow: 0 0 0 4px rgba(215, 0, 21, 0.15); }
    textarea.input { resize: vertical; min-height: 120px; line-height: 1.5; }
    select.input {
      padding-right: 44px; cursor: pointer;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236e6e73' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
      background-repeat: no-repeat; background-position: right 16px center;
    }
    .date-field { max-width: 320px; }
    .field-error {
      display: flex; align-items: center; gap: 6px; margin: 8px 0 0;
      color: #d70015; font-size: 0.875rem; font-weight: 500;
    }

    .error-summary {
      margin-bottom: 28px; padding: 18px 20px; border-radius: 16px;
      background: #fff2f3; color: #a3000f; outline: none;
    }
    .error-summary p { color: inherit; display: flex; align-items: center; gap: 8px; margin: 0 0 8px; font-weight: 600; }
    .error-summary ul { margin: 0; padding-left: 26px; }
    .error-summary li { margin: 4px 0; }
    .error-summary a { color: inherit; text-decoration: underline; text-underline-offset: 3px; }

    /* ---------- review ---------- */
    .review { display: grid; gap: 12px; }
    .review-block { background: var(--ui-surface); border-radius: 20px; padding: 20px 22px; }
    .review-head { display: flex; justify-content: space-between; align-items: center; gap: 12px; margin-bottom: 6px; }
    .review-head h3 { margin: 0; font-size: 0.8125rem; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; color: var(--ui-green-deep); }
    .review p { color: var(--ui-ink); margin: 4px 0 0; line-height: 1.5; overflow-wrap: anywhere; }
    .review .muted { color: var(--ui-muted); }
    .review .quote { font-style: italic; }
    .edit {
      border: 0; background: none; font: inherit; font-size: 0.9375rem; font-weight: 500; color: var(--ui-green-deep);
      cursor: pointer; padding: 4px 6px; border-radius: 8px;
    }
    .edit:hover { text-decoration: underline; text-underline-offset: 3px; }
    .edit:focus-visible { outline: 3px solid var(--ui-green); }

    /* ---------- actions ---------- */
    .actions { display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-top: 40px; padding-top: 28px; border-top: 1px solid var(--ui-line); }
    .actions .primary { margin-left: auto; min-width: 200px; }
    .ui-pill:disabled { opacity: 0.6; cursor: progress; }
    .ui-pill.back { padding: 0 22px 0 16px; }

    /* ---------- summary ---------- */
    .summary {
      position: sticky; top: 172px; background: var(--ui-surface); border-radius: 28px; padding: 28px;
    }
    .summary-title { font-size: 1.25rem; font-weight: 600; letter-spacing: -0.015em; margin: 0 0 20px; }
    .summary-empty { margin: 0; color: var(--ui-muted); line-height: 1.5; }
    .summary-service { display: flex; gap: 12px; align-items: center; padding-bottom: 18px; border-bottom: 1px solid var(--ui-line); }
    .summary-service div { display: flex; flex-direction: column; min-width: 0; }
    .summary-service strong { font-weight: 600; }
    .summary-service span { font-size: 0.875rem; color: var(--ui-muted); }
    .lines { list-style: none; margin: 0; padding: 14px 0; border-bottom: 1px solid var(--ui-line); }
    .lines li { display: flex; justify-content: space-between; gap: 12px; padding: 6px 0; font-size: 0.9375rem; }
    .lines li span:last-child { white-space: nowrap; font-variant-numeric: tabular-nums; }
    .lines em { font-style: normal; color: var(--ui-muted); }
    .lines li.save span:last-child { color: var(--ui-green-deep); font-weight: 600; }
    .lines.totals li span:first-child { color: var(--ui-muted); }
    .total { color: var(--ui-ink); display: flex; justify-content: space-between; align-items: baseline; gap: 12px; margin: 16px 0 0; font-weight: 600; }
    .total strong { font-size: 2rem; letter-spacing: -0.03em; font-variant-numeric: tabular-nums; }
    .quote-box { margin-top: 16px; padding: 16px; border-radius: 16px; background: #fff; }
    .quote-box strong { font-size: 1.25rem; letter-spacing: -0.015em; }
    .quote-box p { margin: 6px 0 0; color: var(--ui-muted); font-size: 0.9375rem; line-height: 1.45; }
    .disclaimer { margin: 16px 0 0; font-size: 0.8125rem; line-height: 1.45; color: var(--ui-muted); }

    .mobile-bar { display: none; }

    @media (max-width: 1000px) {
      .bk-grid { grid-template-columns: 1fr; }
      .summary { position: static; }
      .services { grid-template-columns: 1fr; }
      .choice.service .card-desc { flex: 0 0 auto; }
    }

    @media (max-width: 760px) {
      .stepper ol { justify-content: center; }
      .stepper li { flex: 1; }
      .stepper li:not(:last-child)::after { margin: 0 6px; }
      .step-label { display: none; }
      .stepper-progress { display: block; }
      .options.cols-3, .options.cols-4 { grid-template-columns: 1fr 1fr; }
      .slots { grid-template-columns: repeat(4, 1fr); }
      .row-2 { grid-template-columns: 1fr; gap: 0; }
      .date-field { max-width: none; }
      .actions { margin-top: 24px; padding-top: 0; border-top: 0; }
      .actions .primary { display: none; }
      .bk { padding-bottom: 120px; }

      .mobile-bar {
        display: flex; align-items: center; justify-content: space-between; gap: 16px;
        position: fixed; left: 0; right: 0; bottom: 0; z-index: 900;
        padding: 12px 16px calc(12px + env(safe-area-inset-bottom));
        background: rgba(255, 255, 255, 0.86); backdrop-filter: saturate(180%) blur(20px); -webkit-backdrop-filter: saturate(180%) blur(20px);
        border-top: 1px solid var(--ui-line);
      }
      .bar-total { display: flex; flex-direction: column; min-width: 0; }
      .bar-total span { font-size: 0.75rem; color: var(--ui-muted); }
      .bar-total strong { font-size: 1.25rem; font-weight: 600; letter-spacing: -0.02em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .mobile-bar .ui-pill { flex-shrink: 0; min-height: 46px; }
    }

    @media (max-width: 420px) {
      .choice.option { padding: 16px 40px 16px 14px; }
      .tick { top: 12px; right: 12px; }
      .summary { padding: 22px; border-radius: 24px; }
    }
  `]
})
export class BookingComponent implements OnInit {
  private fb = inject(FormBuilder);
  private transloco = inject(TranslocoService);
  private emailService = inject(EmailService);
  private destroyRef = inject(DestroyRef);
  private host = inject(ElementRef<HTMLElement>);
  private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  readonly steps = STEPS;
  readonly services = SERVICES;
  readonly areas = AREAS;
  readonly addOns = ADD_ONS;
  readonly bedrooms = BEDROOMS;
  readonly bathrooms = BATHROOMS;
  readonly timeSlots = TIME_SLOTS;
  readonly frequencies = FREQUENCIES;
  readonly minDate = localDate(1);

  form!: FormGroup;
  estimate!: Estimate;
  current = 0;
  /** Steps the customer tried to leave, so their errors show */
  showErrors: boolean[] = STEPS.map(() => false);
  isSubmitting = false;
  showSuccessModal = false;
  showErrorModal = false;
  private lang = 'fr';

  ngOnInit(): void {
    const controls: Record<string, unknown> = {
      service: ['', Validators.required],
      propertyType: ['', Validators.required],
      area: ['', Validators.required],
      bedrooms: [''],
      bathrooms: [''],
      specialInstructions: [''],
      preferredDate: ['', [Validators.required, futureDate]],
      timeSlot: ['', Validators.required],
      frequency: ['one-time', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, phoneNumber]],
      address: ['', Validators.required],
      city: ['', Validators.required],
      postalCode: ['', [Validators.required, Validators.pattern(/^\s*[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d\s*$/)]],
    };
    for (const addon of ADD_ONS) controls['addon_' + addon.id] = [false];
    this.form = this.fb.group(controls);

    this.updateEstimate();
    this.form.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.updateEstimate());

    // Property types depend on the service (homes vs. commercial spaces).
    this.form.get('service')!.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      const type = this.form.get('propertyType')!;
      if (type.value && !this.propertyTypes().includes(type.value)) type.reset('');
      if (!this.isResidential()) this.form.patchValue({ bedrooms: '', bathrooms: '' });
    });

    this.lang = this.transloco.getActiveLang();
    this.transloco.langChanges$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(lang => this.lang = lang);
  }

  private updateEstimate(): void {
    const v = this.form.getRawValue();
    this.estimate = estimatePrice({
      service: v.service,
      area: v.area,
      propertyType: v.propertyType,
      addOnIds: ADD_ONS.filter(a => v['addon_' + a.id]).map(a => a.id),
      frequency: v.frequency,
    });
  }

  // ---------- template helpers ----------

  price(id: ServiceId) {
    return SERVICE_PRICES[id];
  }

  propertyTypes(): PropertyType[] {
    return this.form.value.service === 'commercial' ? COMMERCIAL_TYPES : RESIDENTIAL_TYPES;
  }

  isResidential(): boolean {
    return this.form.value.service !== 'commercial';
  }

  typeMultiplier(): number {
    const t = this.form.value.propertyType as PropertyType | '';
    return t ? PROPERTY_TYPE_MULTIPLIERS[t] : 1;
  }

  discount(frequency: string): number {
    return FREQUENCY_DISCOUNTS[frequency] ?? 0;
  }

  pct(rate: number): number {
    return Math.round(rate * 100);
  }

  areaEffect(area: AreaRange): string {
    const m = AREA_MULTIPLIERS[area];
    if (m === null) return this.transloco.translate('BOOKING.EFFECT.QUOTE');
    if (m === 1) return this.transloco.translate('BOOKING.EFFECT.BASE');
    return this.transloco.translate('BOOKING.EFFECT.PLUS', { percent: this.pct(m - 1) });
  }

  typeEffect(type: PropertyType): string {
    const m = PROPERTY_TYPE_MULTIPLIERS[type];
    if (m > 1) return this.transloco.translate('BOOKING.EFFECT.PLUS', { percent: this.pct(m - 1) });
    return this.transloco.translate(COMMERCIAL_TYPES.includes(type) ? 'BOOKING.EFFECT.COMMERCIAL' : 'BOOKING.EFFECT.STANDARD');
  }

  /** CAD amount in the active language; cents only when there are some. */
  money(n: number): string {
    return new Intl.NumberFormat(this.lang === 'en' ? 'en-CA' : 'fr-CA', {
      style: 'currency', currency: 'CAD', currencyDisplay: 'narrowSymbol',
      minimumFractionDigits: Number.isInteger(n) ? 0 : 2, maximumFractionDigits: 2,
    }).format(n);
  }

  serviceNameKey(): string {
    const s = SERVICES.find(x => x.id === this.form.value.service);
    return s ? `BOOKING.SERVICES.${s.key}.NAME` : 'BOOKING.SUMMARY.NOT_SELECTED';
  }

  addOnNames(): string {
    return this.estimate.addOns.map(a => this.transloco.translate(a.name)).join(', ');
  }

  frequencyKey(): string {
    return FREQUENCIES.find(f => f.value === this.form.value.frequency)?.key ?? 'ONE_TIME';
  }

  roomKey(options: { value: string; key: string }[], value: string): string {
    return options.find(o => o.value === value)?.key ?? '';
  }

  formatDate(value: string): string {
    if (!value) return this.transloco.translate('BOOKING.SUMMARY.NOT_SELECTED');
    const [y, m, d] = value.split('-').map(Number);
    return new Date(y, m - 1, d).toLocaleDateString(this.lang === 'en' ? 'en-CA' : 'fr-CA', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });
  }

  // ---------- validation ----------

  /** Red border: after the field was left or a Continue attempt (no layout shift). */
  invalid(name: string): boolean {
    const c = this.form.get(name);
    return !!c && c.invalid && (c.touched || this.showErrors[this.current]);
  }

  /**
   * Error text only after a Continue attempt: showing it on blur would move the
   * Continue button under the pointer and swallow the click.
   */
  showMessage(name: string): boolean {
    return this.showErrors[this.current] && !!this.form.get(name)?.invalid;
  }

  errorKey(name: string): string {
    const errors = this.form.get(name)?.errors;
    if (!errors) return '';
    const map = ERROR_KEYS[name] ?? {};
    const first = Object.keys(errors).find(k => map[k]) ?? 'required';
    return 'BOOKING.ERRORS.' + (map[first] ?? map['required']);
  }

  stepErrors(step = this.current): { control: string; key: string }[] {
    return STEPS[step].controls
      .filter(name => this.form.get(name)?.invalid)
      .map(name => ({ control: name, key: this.errorKey(name).replace('BOOKING.ERRORS.', '') }));
  }

  private stepValid(step: number): boolean {
    return this.stepErrors(step).length === 0;
  }

  focusField(name: string, event?: Event): void {
    event?.preventDefault();
    const el = this.host.nativeElement.querySelector(`#f-${name}`) as HTMLElement | null;
    const target = el?.matches('input, select, textarea') ? el : el?.querySelector<HTMLElement>('input:checked, input');
    target?.focus();
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  // ---------- navigation ----------

  isStepDone(i: number): boolean {
    return i !== this.current && i < STEPS.length - 1 && this.canGoTo(i + 1) && this.stepValid(i);
  }

  /** A step is reachable when every step before it is valid. */
  canGoTo(i: number): boolean {
    for (let s = 0; s < i; s++) if (!this.stepValid(s)) return false;
    return true;
  }

  goTo(i: number): void {
    if (i === this.current || !this.canGoTo(i)) return;
    this.current = i;
    this.afterStepChange();
  }

  back(): void {
    if (this.current > 0) {
      this.current--;
      this.afterStepChange();
    }
  }

  primaryAction(): void {
    if (this.isSubmitting) return;
    if (!this.stepValid(this.current)) {
      this.showErrors[this.current] = true;
      STEPS[this.current].controls.forEach(c => this.form.get(c)?.markAsTouched());
      this.focusErrorSummary();
      return;
    }
    if (this.current < STEPS.length - 1) {
      this.current++;
      this.afterStepChange();
    } else {
      this.confirmBooking();
    }
  }

  private afterStepChange(): void {
    if (!this.isBrowser) return;
    setTimeout(() => {
      const root = this.host.nativeElement as HTMLElement;
      const stepper = root.querySelector('.stepper') as HTMLElement | null;
      if (stepper) {
        // Keep the step indicator just below the fixed site header.
        const header = document.querySelector('.header')?.getBoundingClientRect().height ?? 80;
        const top = stepper.getBoundingClientRect().top + window.scrollY - header - 24;
        if (window.scrollY > top) window.scrollTo({ top, behavior: 'smooth' });
      }
      (root.querySelector('.step-title') as HTMLElement | null)?.focus({ preventScroll: true });
    });
  }

  private focusErrorSummary(): void {
    if (!this.isBrowser) return;
    setTimeout(() => {
      const summary = this.host.nativeElement.querySelector('.error-summary') as HTMLElement | null;
      summary?.focus({ preventScroll: true });
      summary?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

  // ---------- submit ----------

  async confirmBooking(): Promise<void> {
    const firstInvalid = STEPS.findIndex((_, i) => !this.stepValid(i));
    if (firstInvalid !== -1) {
      this.current = firstInvalid;
      this.showErrors[firstInvalid] = true;
      this.form.markAllAsTouched();
      this.focusErrorSummary();
      return;
    }

    this.isSubmitting = true;
    const v = this.form.getRawValue();
    const e = this.estimate;
    const service = SERVICES.find(s => s.id === v.service)!;

    try {
      const bookingData: BookingFormData = {
        serviceType: v.service,
        serviceName: this.transloco.translate(`BOOKING.SERVICES.${service.key}.NAME`),
        servicePrice: e.base,

        propertyType: v.propertyType,
        propertySizeRange: v.area,
        bedrooms: v.bedrooms || undefined,
        bathrooms: v.bathrooms || undefined,
        address: v.address.trim(),
        city: v.city.trim(),
        postalCode: v.postalCode.trim().toUpperCase(),

        preferredDate: v.preferredDate,
        preferredTime: v.timeSlot,
        frequency: v.frequency,

        additionalServices: e.addOns.map(a => `${this.transloco.translate(a.name)} (+${a.price}$)`),
        specialInstructions: v.specialInstructions,

        firstName: v.firstName.trim(),
        lastName: v.lastName.trim(),
        email: v.email.trim(),
        phone: v.phone.trim(),

        // A custom quote has no online price.
        subtotal: e.quoteRequired ? 0 : e.subtotal,
        taxes: e.quoteRequired ? 0 : e.taxes,
        total: e.quoteRequired ? 0 : e.total,
        estimate: {
          basePrice: e.base,
          areaMultiplier: e.areaMultiplier,
          areaAdjustment: e.areaAdjustment,
          propertyTypeMultiplier: e.propertyTypeMultiplier,
          propertyTypeAdjustment: e.propertyTypeAdjustment,
          addOnsTotal: e.addOnsTotal,
          frequencyDiscountRate: e.discountRate,
          frequencyDiscount: e.discount,
          quoteRequired: e.quoteRequired,
        },
      };

      const result = await this.emailService.sendBookingForm(bookingData, this.lang === 'en' ? 'en' : 'fr');
      if (result.success) {
        this.showSuccessModal = true; // the modal redirects home after 5 seconds
      } else {
        this.showErrorModal = true;
      }
    } catch (error) {
      console.error('Error sending booking:', error);
      this.showErrorModal = true;
    } finally {
      this.isSubmitting = false;
    }
  }
}
