import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit, Inject, PLATFORM_ID, HostListener } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { ScrollAnimationService } from '../../services/scroll-animation.service';
import { EmailService } from '../../services/email.service';
import { SuccessModalComponent } from '../../shared/components/success-modal.component';

interface ContactMethod {
  icon: string;
  title: string;
  value: string;
  description: string;
  action: string;
}

interface OfficeLocation {
  id: string;
  address: string;
  phone: string;
  email: string;
  hoursKey: string;
  image: string;
}

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, TranslocoPipe, SuccessModalComponent],
  template: `
    <section class="hero wave-border-bottom-only" #heroSection>
      <div class="container">
        <div class="hero-content">
          <div class="hero-text fade-in-up" [class.visible]="isHeroVisible">
            <div class="hero-badge">{{ 'CONTACT.HERO.BADGE' | transloco }}</div>
            <h1 class="hero-title">{{ 'CONTACT.TITLE' | transloco }}</h1>
            <p class="hero-subtitle">{{ 'CONTACT.SUBTITLE' | transloco }}</p>
          </div>
        </div>
      </div>
    </section>

    <section #contactMethodsSection class="contact-methods section">
      <div class="container">
        <div class="section-header text-center fade-in-up" [class.visible]="areContactMethodsVisible">
          <h2 class="section-title stagger-1">{{ 'CONTACT.METHODS_TITLE' | transloco }}</h2>
          <p class="section-subtitle stagger-2">{{ 'CONTACT.METHODS_SUBTITLE' | transloco }}</p>
        </div>

        <div class="contact-grid">
          <div class="contact-card card scale-in" [class.visible]="areContactMethodsVisible" *ngFor="let method of contactMethods; let i = index" [class]="'stagger-' + (i + 3)">
            <div class="contact-icon">{{method.icon}}</div>
            <h3>{{ method.title | transloco }}</h3>
            <div class="contact-value">{{method.value}}</div>
            <p class="contact-description">{{ method.description | transloco }}</p>
            <a [href]="getContactLink(method)" class="btn btn-secondary btn-sm">{{ method.action | transloco }}</a>
          </div>
        </div>
      </div>
    </section>

    <section #contactFormSection class="contact-form-section section">
      <div class="container">
        <div class="contact-form-container">
          <div class="form-content fade-in-left" [class.visible]="isContactFormVisible">
            <div class="form-header stagger-1">
              <h2>{{ 'CONTACT.FORM_TITLE' | transloco }}</h2>
              <p>{{ 'CONTACT.FORM_SUBTITLE' | transloco }}</p>
            </div>

            <form [formGroup]="contactForm" (ngSubmit)="onSubmit()" class="contact-form stagger-2">
              <div class="form-row">
                <div class="form-group">
                  <label for="firstName">{{ 'CONTACT.FIRST_NAME' | transloco }} *</label>
                  <input
                    type="text"
                    id="firstName"
                    formControlName="firstName"
                    class="form-control"
                    [class.error]="contactForm.get('firstName')?.invalid && contactForm.get('firstName')?.touched">
                  <div class="error-message" *ngIf="contactForm.get('firstName')?.invalid && contactForm.get('firstName')?.touched">
                    Le prénom est requis
                  </div>
                </div>

                <div class="form-group">
                  <label for="lastName">{{ 'CONTACT.LAST_NAME' | transloco }} *</label>
                  <input
                    type="text"
                    id="lastName"
                    formControlName="lastName"
                    class="form-control"
                    [class.error]="contactForm.get('lastName')?.invalid && contactForm.get('lastName')?.touched">
                  <div class="error-message" *ngIf="contactForm.get('lastName')?.invalid && contactForm.get('lastName')?.touched">
                    Le nom de famille est requis
                  </div>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="email">{{ 'CONTACT.EMAIL_ADDRESS' | transloco }} *</label>
                  <input
                    type="email"
                    id="email"
                    formControlName="email"
                    class="form-control"
                    [class.error]="contactForm.get('email')?.invalid && contactForm.get('email')?.touched">
                  <div class="error-message" *ngIf="contactForm.get('email')?.invalid && contactForm.get('email')?.touched">
                    Une adresse courriel valide est requise
                  </div>
                </div>

                <div class="form-group">
                  <label for="phone">{{ 'CONTACT.PHONE_NUMBER' | transloco }}</label>
                  <input
                    type="tel"
                    id="phone"
                    formControlName="phone"
                    class="form-control"
                    placeholder="(514) 123-4567">
                </div>
              </div>

              <div class="form-group">
                <label>{{ 'CONTACT.SERVICE_TYPE' | transloco }}</label>
                <div class="custom-dropdown" [class.open]="dropdownStates['serviceType']">
                  <div class="dropdown-trigger" (click)="toggleDropdown('serviceType')">
                    <span class="selected-text">{{getSelectedServiceLabel()}}</span>
                    <svg class="dropdown-icon" [class.rotated]="dropdownStates['serviceType']" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="6,9 12,15 18,9"></polyline>
                    </svg>
                  </div>
                  <div class="dropdown-menu" *ngIf="dropdownStates['serviceType']">
                    <div class="dropdown-option"
                         *ngFor="let option of serviceTypeOptions"
                         [class.selected]="contactForm.get('serviceType')?.value === option.value"
                         (click)="selectDropdownOption('serviceType', option.value)">
                      {{option.label | transloco}}
                    </div>
                  </div>
                </div>
              </div>

              <div class="form-group">
                <label>{{ 'CONTACT.PROPERTY_SIZE' | transloco }}</label>
                <div class="custom-dropdown" [class.open]="dropdownStates['propertySize']">
                  <div class="dropdown-trigger" (click)="toggleDropdown('propertySize')">
                    <span class="selected-text">{{getSelectedSizeLabel()}}</span>
                    <svg class="dropdown-icon" [class.rotated]="dropdownStates['propertySize']" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="6,9 12,15 18,9"></polyline>
                    </svg>
                  </div>
                  <div class="dropdown-menu" *ngIf="dropdownStates['propertySize']">
                    <div class="dropdown-option"
                         *ngFor="let option of propertySizeOptions"
                         [class.selected]="contactForm.get('propertySize')?.value === option.value"
                         (click)="selectDropdownOption('propertySize', option.value)">
                      {{option.label | transloco}}
                    </div>
                  </div>
                </div>
              </div>

              <div class="form-group">
                <label for="preferredDate">{{ 'CONTACT.PREFERRED_DATE' | transloco }}</label>
                <input type="date"
                       formControlName="preferredDate"
                       id="preferredDate"
                       class="form-control date-picker"
                       [min]="getTomorrowDate()">
              </div>

              <div class="form-group">
                <label for="message">{{ 'CONTACT.MESSAGE' | transloco }} *</label>
                <textarea
                  id="message"
                  formControlName="message"
                  class="form-control"
                  rows="5"
                  [placeholder]="'CONTACT.MESSAGE_PLACEHOLDER' | transloco"
                  [class.error]="contactForm.get('message')?.invalid && contactForm.get('message')?.touched">
                </textarea>
                <div class="error-message" *ngIf="contactForm.get('message')?.invalid && contactForm.get('message')?.touched">
                  {{ 'CONTACT.MESSAGE_REQUIRED' | transloco }}
                </div>
              </div>

              <div class="form-group">
                <label class="checkbox-container">
                  <input type="checkbox" formControlName="urgentRequest">
                  <span class="checkbox-custom"></span>
                  <span class="checkbox-text">{{ 'CONTACT.URGENT_REQUEST' | transloco }}</span>
                </label>
              </div>

              <button
                type="submit"
                class="btn btn-primary btn-lg submit-btn"
                [disabled]="contactForm.invalid || isSubmitting">
                <span *ngIf="!isSubmitting">{{ 'CONTACT.SEND_REQUEST' | transloco }}</span>
                <span *ngIf="isSubmitting">{{ 'CONTACT.SENDING' | transloco }}</span>
              </button>
            </form>
          </div>

          <div class="form-image fade-in-right" [class.visible]="isContactFormVisible">
            <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=800&fit=crop&auto=format&q=80"
                 [alt]="'CONTACT.CUSTOMER_SERVICE_ALT' | transloco" class="img-cover stagger-3">
          </div>
        </div>
      </div>
    </section>

    <section #officeLocationsSection class="office-locations section">
      <div class="container">
        <div class="section-header text-center fade-in-up" [class.visible]="areOfficeLocationsVisible">
          <h2 class="section-title stagger-1">{{ 'CONTACT.OFFICES_TITLE' | transloco }}</h2>
          <p class="section-subtitle stagger-2">{{ 'CONTACT.OFFICES_SUBTITLE' | transloco }}</p>
        </div>

        <div class="locations-grid">
          <div class="location-card card slide-up" [class.visible]="areOfficeLocationsVisible" *ngFor="let location of officeLocations; let i = index" [class]="'stagger-' + (i + 3)">
            <div class="location-image">
              <img [src]="location.image" [alt]="getOfficeName(location.id)" class="img-cover">
            </div>
            <div class="location-info">
              <h3>{{ getOfficeName(location.id) }}</h3>
              <div class="location-details">
                <div class="detail-item">
                  <span class="detail-icon">📍</span>
                  <span>{{location.address}}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-icon">📞</span>
                  <span>{{location.phone}}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-icon">📧</span>
                  <span>{{location.email}}</span>
                </div>
              </div>
              <div class="location-hours">
                <h4>{{ 'CONTACT.HOURS_TITLE' | transloco }}</h4>
                <ul>
                  <li *ngFor="let hour of getOfficeHours(location.id)">{{hour}}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section #faqPreviewSection class="faq-preview section">
      <div class="container">
        <div class="faq-content text-center fade-in-up" [class.visible]="isFaqPreviewVisible">
          <h2 class="stagger-1">{{ 'CONTACT.FAQ_PREVIEW_TITLE' | transloco }}</h2>
          <p class="stagger-2">{{ 'CONTACT.FAQ_PREVIEW_SUBTITLE' | transloco }}</p>
          <div class="faq-grid">
            <div class="faq-item scale-in stagger-3" [class.visible]="isFaqPreviewVisible">
              <h4>{{ 'CONTACT.FAQ_QUESTIONS.PRODUCTS' | transloco }}</h4>
              <p>{{ 'CONTACT.FAQ_QUESTIONS.PRODUCTS_ANSWER' | transloco }}</p>
            </div>
            <div class="faq-item scale-in stagger-4" [class.visible]="isFaqPreviewVisible">
              <h4>{{ 'CONTACT.FAQ_QUESTIONS.TIMING' | transloco }}</h4>
              <p>{{ 'CONTACT.FAQ_QUESTIONS.TIMING_ANSWER' | transloco }}</p>
            </div>
            <div class="faq-item scale-in stagger-5" [class.visible]="isFaqPreviewVisible">
              <h4>{{ 'CONTACT.FAQ_QUESTIONS.PRICING' | transloco }}</h4>
              <p>{{ 'CONTACT.FAQ_QUESTIONS.PRICING_ANSWER' | transloco }}</p>
            </div>
          </div>
          <a routerLink="/faq" class="btn btn-primary btn-lg stagger-6">
            {{ 'CONTACT.VIEW_ALL_FAQ' | transloco }}
          </a>
        </div>
      </div>
    </section>

    <!-- Success Modal -->
    <app-success-modal
      [isVisible]="showSuccessModal"
      [title]="'CONTACT.SUCCESS_MESSAGE' | transloco"
      [message]="successMessage"
      [primaryButtonText]="'COMMON.RETURN_HOME'"
      [secondaryButtonText]="'COMMON.CLOSE'"
      [redirectTo]="'/'"
      (close)="showSuccessModal = false">
    </app-success-modal>

    <!-- Error Modal -->
    <app-success-modal
      *ngIf="showErrorModal"
      [isVisible]="showErrorModal"
      [title]="'COMMON.ERROR'"
      [message]="'CONTACT.ERROR_MESSAGE' | transloco"
      [primaryButtonText]="'COMMON.CLOSE'"
      (close)="showErrorModal = false">
    </app-success-modal>
  `,
  styles: [`
    /* Hero Section */
    .hero {
      padding: var(--space-6xl) 0 var(--space-4xl);
      background: linear-gradient(135deg, var(--pure-white) 0%, var(--secondary) 100%);
      position: relative;
      overflow: visible;
    }

    .hero-content {
      max-width: 800px;
      text-align: center;
      margin: 0 auto;
    }

    .hero-badge {
      display: inline-block;
      padding: var(--space-sm) var(--space-lg);
      background: var(--tertiary);
      color: var(--neutral-medium);
      border-radius: var(--radius-full);
      font-size: 0.875rem;
      font-weight: var(--font-weight-medium);
      letter-spacing: 0.02em;
      margin-bottom: var(--space-2xl);
    }

    .hero-title {
      font-size: clamp(2.5rem, 5vw, 4rem);
      margin-bottom: var(--space-xl);
      font-weight: var(--font-weight-bold);
      line-height: 1.1;
    }

    .hero-subtitle {
      font-size: 1.25rem;
      line-height: 1.6;
      color: var(--neutral-medium);
      max-width: 600px;
      margin: 0 auto;
    }

    /* Section Headers */
    .section-header {
      margin-bottom: var(--space-4xl);
    }

    .section-title {
      margin-bottom: var(--space-lg);
    }

    .section-subtitle {
      color: var(--neutral-medium);
      font-size: 1.2rem;
      line-height: 1.6;
      max-width: 700px;
      margin: 0 auto;
    }

    /* Contact Methods */
    .contact-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: var(--space-2xl);
    }

    .contact-card {
      text-align: center;
      padding: var(--space-2xl);
      background: var(--pure-white);
      border: 1px solid rgba(212, 165, 116, 0.1);
      border-radius: var(--radius-lg);
      transition: all var(--transition-base);
    }

    .contact-card:hover {
      transform: translateY(-8px);
      box-shadow: var(--shadow-large);
      border-color: var(--primary);
    }

    .contact-icon {
      font-size: 3.5rem;
      margin-bottom: var(--space-lg);
      display: block;
    }

    .contact-card h3 {
      color: var(--neutral-dark);
      margin-bottom: var(--space-md);
      font-size: 1.25rem;
    }

    .contact-value {
      font-size: 1.25rem;
      font-weight: var(--font-weight-bold);
      color: var(--primary);
      margin: var(--space-md) 0;
    }

    .contact-description {
      color: var(--neutral-medium);
      margin-bottom: var(--space-lg);
      line-height: 1.5;
    }

    /* Contact Form */
    .contact-form-section {
      background: var(--secondary);
    }

    .contact-form-container {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--space-4xl);
      align-items: start;
    }

    .form-header {
      margin-bottom: var(--space-2xl);
    }

    .form-header h2 {
      margin-bottom: var(--space-md);
      color: var(--neutral-dark);
    }

    .form-header p {
      color: var(--neutral-medium);
      font-size: 1.1rem;
      line-height: 1.6;
    }

    .contact-form {
      background: var(--pure-white);
      padding: var(--space-2xl);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-medium);
      border: 1px solid rgba(212, 165, 116, 0.1);
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--space-lg);
    }

    .form-group {
      margin-bottom: var(--space-lg);
    }

    .form-group label {
      display: block;
      margin-bottom: 8px;
      font-weight: 500;
      color: var(--neutral-dark);
      font-size: 17px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      letter-spacing: -0.022em;
    }

    .form-control {
      width: 100%;
      padding: 16px 20px;
      border: 1px solid rgba(0, 0, 0, 0.1);
      border-radius: 12px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 17px;
      font-weight: 400;
      background: rgba(255, 255, 255, 0.8);
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
      color: var(--neutral-dark);
      letter-spacing: -0.022em;
      backdrop-filter: blur(10px);
      min-height: 54px;
    }

    .form-control:focus {
      outline: none;
      border-color: #007AFF;
      box-shadow: 0 0 0 4px rgba(0, 122, 255, 0.1);
      background: var(--pure-white);
      transform: translateY(-1px);
    }

    .form-control:hover:not(:focus) {
      background-color: rgba(255, 255, 255, 0.95);
      border-color: rgba(0, 0, 0, 0.2);
    }

    .form-control.error {
      border-color: var(--error);
      background: rgba(232, 122, 122, 0.02);
      box-shadow: 0 0 0 3px rgba(232, 122, 122, 0.1);
    }

    .form-control::placeholder {
      color: rgba(60, 60, 67, 0.6);
      font-weight: 400;
    }

    /* Custom Dropdown Styles - Apple Style */
    .custom-dropdown {
      position: relative;
      width: 100%;
    }

    .dropdown-trigger {
      width: 100%;
      padding: 16px 20px;
      border: 1px solid rgba(0, 0, 0, 0.1);
      border-radius: 12px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 17px;
      font-weight: 400;
      background: rgba(255, 255, 255, 0.8);
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
      color: var(--neutral-dark);
      letter-spacing: -0.022em;
      backdrop-filter: blur(10px);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: space-between;
      user-select: none;
      min-height: 54px;
    }

    .dropdown-trigger:hover {
      background-color: rgba(255, 255, 255, 0.95);
      border-color: rgba(0, 0, 0, 0.2);
    }

    .custom-dropdown.open .dropdown-trigger {
      border-color: #007AFF;
      box-shadow: 0 0 0 4px rgba(0, 122, 255, 0.1);
      background: var(--pure-white);
      transform: translateY(-1px);
    }

    .selected-text {
      flex: 1;
      text-align: left;
      color: var(--neutral-dark);
    }

    .dropdown-icon {
      color: rgba(60, 60, 67, 0.6);
      transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
      flex-shrink: 0;
      margin-left: 12px;
    }

    .dropdown-icon.rotated {
      transform: rotate(180deg);
      color: #007AFF;
    }

    .dropdown-menu {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      z-index: 1000;
      background: var(--pure-white);
      border: 1px solid rgba(0, 0, 0, 0.1);
      border-radius: 12px;
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
      backdrop-filter: blur(20px);
      margin-top: 4px;
      max-height: 280px;
      overflow-y: auto;
      animation: dropdownSlideIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    @keyframes dropdownSlideIn {
      from {
        opacity: 0;
        transform: translateY(-8px) scale(0.95);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    .dropdown-option {
      padding: 14px 20px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 17px;
      color: var(--neutral-dark);
      cursor: pointer;
      transition: all 0.15s ease;
      letter-spacing: -0.022em;
      border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    }

    .dropdown-option:last-child {
      border-bottom: none;
    }

    .dropdown-option:hover {
      background: rgba(0, 122, 255, 0.05);
      color: #007AFF;
    }

    .dropdown-option.selected {
      background: rgba(0, 122, 255, 0.1);
      color: #007AFF;
      font-weight: 500;
    }

    .dropdown-option.selected::after {
      content: '✓';
      float: right;
      color: #007AFF;
      font-weight: 600;
    }

    /* Date Picker Styling */
    .date-picker {
      max-width: none;
      width: 100%;
      cursor: pointer;
    }

    .date-picker::-webkit-calendar-picker-indicator {
      cursor: pointer;
      opacity: 0.7;
      filter: invert(42%) sepia(14%) saturate(1034%) hue-rotate(119deg) brightness(94%) contrast(91%);
    }

    .date-picker:hover::-webkit-calendar-picker-indicator {
      opacity: 1;
    }

    /* Textarea specific styling */
    textarea.form-control {
      resize: vertical;
      min-height: 120px;
      line-height: 1.5;
      padding-top: 14px;
      padding-bottom: 14px;
    }

    /* Input number styling */
    input.form-control[type="number"] {
      -moz-appearance: textfield;
    }

    input.form-control[type="number"]::-webkit-outer-spin-button,
    input.form-control[type="number"]::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    .error-message {
      color: var(--error);
      font-size: 0.875rem;
      margin-top: var(--space-xs);
      font-weight: var(--font-weight-medium);
    }

    .checkbox-container {
      display: block;
      position: relative;
      padding-left: 40px;
      cursor: pointer;
      font-size: 17px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      color: var(--neutral-dark);
      user-select: none;
      line-height: 24px;
    }

    .checkbox-container input {
      position: absolute;
      opacity: 0;
      cursor: pointer;
      height: 0;
      width: 0;
    }

    .checkbox-custom {
      position: absolute;
      top: 0;
      left: 0;
      height: 24px;
      width: 24px;
      background-color: #f5f5f7;
      border: 3px solid #6b9080;
      border-radius: 6px;
      transition: all 0.2s ease;
    }

    .checkbox-container:hover .checkbox-custom {
      background-color: #e8f0ed;
      border-color: #5a7a6a;
    }

    .checkbox-container input:checked ~ .checkbox-custom {
      background-color: #007AFF;
      border-color: #007AFF;
    }

    .checkbox-custom::after {
      content: "";
      position: absolute;
      display: none;
      left: 6px;
      top: 2px;
      width: 5px;
      height: 10px;
      border: solid white;
      border-width: 0 2.5px 2.5px 0;
      transform: rotate(45deg);
    }

    .checkbox-container input:checked ~ .checkbox-custom::after {
      display: block;
    }

    .checkbox-text {
      display: inline;
    }

    .submit-btn {
      width: 100%;
      margin-top: var(--spacing-md);
    }

    .form-image {
      height: 650px;
      border-radius: var(--radius-lg);
      overflow: hidden;
      box-shadow: var(--shadow-medium);
      border: 1px solid rgba(212, 165, 116, 0.1);
    }

    .form-image img {
      transition: transform var(--transition-slow);
    }

    .form-image:hover img {
      transform: scale(1.02);
    }

    /* Office Locations */
    .locations-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
      gap: var(--space-2xl);
    }

    .location-card {
      overflow: hidden;
      padding: 0;
      background: var(--pure-white);
      border: 1px solid rgba(212, 165, 116, 0.1);
      border-radius: var(--radius-lg);
      transition: all var(--transition-base);
    }

    .location-card:hover {
      transform: translateY(-8px);
      box-shadow: var(--shadow-large);
    }

    .location-image {
      height: 220px;
      overflow: hidden;
      position: relative;
    }

    .location-image img {
      transition: transform var(--transition-slow);
    }

    .location-card:hover .location-image img {
      transform: scale(1.05);
    }

    .location-info {
      padding: var(--space-xl);
    }

    .location-info h3 {
      color: var(--neutral-dark);
      margin-bottom: var(--space-lg);
      font-size: 1.25rem;
    }

    .location-details {
      margin: var(--space-lg) 0;
    }

    .detail-item {
      display: flex;
      align-items: center;
      gap: var(--space-sm);
      margin-bottom: var(--space-sm);
      color: var(--neutral-medium);
      font-size: 0.95rem;
    }

    .detail-icon {
      font-size: 1.1rem;
      width: 20px;
      flex-shrink: 0;
    }

    .location-hours {
      margin-top: var(--space-lg);
      padding-top: var(--space-lg);
      border-top: 1px solid rgba(212, 165, 116, 0.2);
    }

    .location-hours h4 {
      margin-bottom: var(--space-sm);
      color: var(--primary);
      font-size: 1rem;
    }

    .location-hours ul {
      list-style: none;
    }

    .location-hours li {
      padding: var(--space-xs) 0;
      color: var(--neutral-medium);
      font-size: 0.9rem;
      line-height: 1.4;
    }

    /* FAQ Preview */
    .faq-preview {
      background: var(--pure-white);
      color: var(--neutral-dark);
    }

    .faq-content h2 {
      color: var(--neutral-dark);
      margin-bottom: var(--space-md);
    }

    .faq-content > p {
      color: var(--neutral-medium);
      font-size: 1.1rem;
      margin-bottom: var(--space-xl);
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
    }

    .faq-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: var(--space-lg);
      margin-bottom: var(--space-2xl);
    }

    .faq-item {
      background: var(--pure-white);
      padding: var(--space-lg);
      border-radius: var(--radius-lg);
      border: 1px solid rgba(107, 144, 128, 0.1);
      box-shadow: var(--shadow-soft);
      transition: all var(--transition-base);
    }

    .faq-item:hover {
      background: var(--secondary);
      transform: translateY(-4px);
      box-shadow: var(--shadow-medium);
      border-color: var(--primary);
    }

    .faq-item h4 {
      color: var(--neutral-dark);
      margin-bottom: var(--space-sm);
      font-size: 1.125rem;
    }

    .faq-item p {
      color: var(--neutral-medium);
      margin: 0;
      font-size: 0.9rem;
      line-height: 1.5;
    }

    /* Mobile Responsive */
    @media (max-width: 1024px) {
      .contact-form-container {
        grid-template-columns: 1fr;
        gap: var(--space-2xl);
        text-align: center;
      }

      .form-image {
        height: 350px;
        order: -1;
      }

      .locations-grid {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 768px) {
      .hero {
        padding: var(--space-4xl) 0 var(--space-3xl);
      }

      .hero-title {
        font-size: 2.5rem;
      }

      .hero-subtitle {
        font-size: 1.1rem;
      }

      .contact-grid {
        grid-template-columns: 1fr;
        gap: var(--space-lg);
      }

      .form-row {
        grid-template-columns: 1fr;
        gap: 0;
      }

      .faq-grid {
        grid-template-columns: 1fr;
      }

      .locations-grid {
        grid-template-columns: 1fr;
      }

      .contact-form {
        padding: var(--space-lg);
      }

      .form-image {
        height: 280px;
      }
    }

    @media (max-width: 640px) {
      .contact-grid {
        grid-template-columns: 1fr;
      }

      .faq-grid {
        grid-template-columns: 1fr;
      }

      .locations-grid {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 480px) {
      .hero {
        padding: var(--space-3xl) 0 var(--space-2xl);
      }

      .hero-title {
        font-size: 2rem;
      }

      .hero-subtitle {
        font-size: 1rem;
      }

      .hero-badge {
        font-size: 0.75rem;
        padding: var(--space-xs) var(--space-md);
      }
    }
  `]
})
export class ContactComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('heroSection') heroSection!: ElementRef;
  @ViewChild('contactMethodsSection') contactMethodsSection!: ElementRef;
  @ViewChild('contactFormSection') contactFormSection!: ElementRef;
  @ViewChild('officeLocationsSection') officeLocationsSection!: ElementRef;
  @ViewChild('faqPreviewSection') faqPreviewSection!: ElementRef;

  contactForm!: FormGroup;
  isSubmitting = false;
  showSuccessModal = false;
  showErrorModal = false;
  successMessage = '';

  isHeroVisible = false;
  areContactMethodsVisible = false;
  isContactFormVisible = false;
  areOfficeLocationsVisible = false;
  isFaqPreviewVisible = false;

  // Custom dropdown states
  dropdownStates: {[key: string]: boolean} = {
    serviceType: false,
    propertySize: false
  };

  // Dropdown options
  serviceTypeOptions = [
    { value: '', label: 'CONTACT.SERVICE_OPTIONS.SELECT' },
    { value: 'residential', label: 'CONTACT.SERVICE_OPTIONS.RESIDENTIAL' },
    { value: 'commercial', label: 'CONTACT.SERVICE_OPTIONS.COMMERCIAL' },
    { value: 'post-construction', label: 'CONTACT.SERVICE_OPTIONS.POST_CONSTRUCTION' },
    { value: 'deep-cleaning', label: 'CONTACT.SERVICE_OPTIONS.DEEP_CLEANING' },
    { value: 'maintenance', label: 'CONTACT.SERVICE_OPTIONS.MAINTENANCE' },
    { value: 'carpet', label: 'CONTACT.SERVICE_OPTIONS.CARPET' },
    { value: 'other', label: 'CONTACT.SERVICE_OPTIONS.OTHER' }
  ];

  propertySizeOptions = [
    { value: '', label: 'CONTACT.SIZE_OPTIONS.SELECT' },
    { value: 'small', label: 'CONTACT.SIZE_OPTIONS.SMALL' },
    { value: 'medium', label: 'CONTACT.SIZE_OPTIONS.MEDIUM' },
    { value: 'large', label: 'CONTACT.SIZE_OPTIONS.LARGE' },
    { value: 'xlarge', label: 'CONTACT.SIZE_OPTIONS.XLARGE' }
  ];

  contactMethods: ContactMethod[] = [
    {
      icon: '📞',
      title: 'CONTACT.PHONE',
      value: '(514) 123-4567',
      description: 'CONTACT.PHONE_DESC',
      action: 'CONTACT.PHONE_ACTION'
    },
    {
      icon: '📧',
      title: 'CONTACT.EMAIL',
      value: 'econetentretienmenager@gmail.com',
      description: 'CONTACT.EMAIL_DESC',
      action: 'CONTACT.EMAIL_ACTION'
    }
  ];

  officeLocations: OfficeLocation[] = [
    {
      id: 'montreal',
      address: '1234 Rue Saint-Catherine Ouest, Montréal, QC H3G 1P5',
      phone: '(514) 123-4567',
      email: 'montreal@econet-proprete.ca',
      hoursKey: 'MONTREAL_OFFICE',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=500&h=300&fit=crop&auto=format&q=80'
    },
    {
      id: 'laval',
      address: '5678 Boulevard Saint-Martin Ouest, Laval, QC H7T 2R5',
      phone: '(450) 123-4567',
      email: 'laval@econet-proprete.ca',
      hoursKey: 'LAVAL_OFFICE',
      image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500&h=300&fit=crop&auto=format&q=80'
    }
  ];

  constructor(
    private formBuilder: FormBuilder,
    @Inject(PLATFORM_ID) private platformId: Object,
    private scrollAnimationService: ScrollAnimationService,
    private transloco: TranslocoService,
    private emailService: EmailService
  ) {}

  ngOnInit() {
    this.initializeForm();
    if (isPlatformBrowser(this.platformId)) {
      // Initialize hero visibility immediately
      setTimeout(() => {
        this.isHeroVisible = true;
      }, 100);
    }
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.initializeScrollAnimations();
    }
  }

  ngOnDestroy() {
    if (this.scrollAnimationService) {
      this.scrollAnimationService.destroy();
    }
  }

  private initializeScrollAnimations() {
    const elements = [
      {
        element: this.contactMethodsSection.nativeElement,
        callback: () => { this.areContactMethodsVisible = true; }
      },
      {
        element: this.contactFormSection.nativeElement,
        callback: () => { this.isContactFormVisible = true; }
      },
      {
        element: this.officeLocationsSection.nativeElement,
        callback: () => { this.areOfficeLocationsVisible = true; }
      },
      {
        element: this.faqPreviewSection.nativeElement,
        callback: () => { this.isFaqPreviewVisible = true; }
      }
    ];

    this.scrollAnimationService.initializeAnimations(elements);
  }

  initializeForm() {
    this.contactForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      serviceType: [''],
      propertySize: [''],
      preferredDate: [''],
      message: ['', [Validators.required, Validators.minLength(10)]],
      urgentRequest: [false]
    });
  }

  getContactLink(method: ContactMethod): string {
    switch (method.title) {
      case 'Téléphone':
        return `tel:${method.value}`;
      case 'Courriel':
        return `mailto:${method.value}`;
      default:
        return '#';
    }
  }

  async onSubmit() {
    if (this.contactForm.valid) {
      this.isSubmitting = true;

      try {
        const currentLang = this.transloco.getActiveLang() as 'fr' | 'en';
        const result = await this.emailService.sendContactForm(this.contactForm.value, currentLang);

        if (result.success) {
          this.successMessage = this.transloco.translate('CONTACT.SUCCESS_MESSAGE');
          this.showSuccessModal = true;
          this.contactForm.reset();
        } else {
          this.showErrorModal = true;
        }
      } catch (error) {
        console.error('Error sending email:', error);
        this.showErrorModal = true;
      } finally {
        this.isSubmitting = false;
      }
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.contactForm.controls).forEach(key => {
        this.contactForm.get(key)?.markAsTouched();
      });
    }
  }

  getOfficeName(officeId: string): string {
    return this.transloco.translate(`CONTACT.${officeId.toUpperCase()}_OFFICE.NAME`);
  }

  getOfficeHours(officeId: string): string[] {
    const hours = this.transloco.translate(`CONTACT.${officeId.toUpperCase()}_OFFICE.HOURS`);
    return Array.isArray(hours) ? hours : [];
  }

  // Custom dropdown methods
  toggleDropdown(dropdownName: string): void {
    // Close all other dropdowns
    Object.keys(this.dropdownStates).forEach(key => {
      if (key !== dropdownName) {
        this.dropdownStates[key] = false;
      }
    });
    // Toggle the selected dropdown
    this.dropdownStates[dropdownName] = !this.dropdownStates[dropdownName];
  }

  selectDropdownOption(dropdownName: string, value: string): void {
    this.contactForm.patchValue({[dropdownName]: value});
    this.dropdownStates[dropdownName] = false;
  }

  getSelectedServiceLabel(): string {
    const currentValue = this.contactForm.get('serviceType')?.value;
    const option = this.serviceTypeOptions.find(opt => opt.value === currentValue);
    return option ? this.transloco.translate(option.label) : this.transloco.translate('CONTACT.SERVICE_OPTIONS.SELECT');
  }

  getSelectedSizeLabel(): string {
    const currentValue = this.contactForm.get('propertySize')?.value;
    const option = this.propertySizeOptions.find(opt => opt.value === currentValue);
    return option ? this.transloco.translate(option.label) : this.transloco.translate('CONTACT.SIZE_OPTIONS.SELECT');
  }

  getTomorrowDate(): string {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  }

  closeAllDropdowns(): void {
    Object.keys(this.dropdownStates).forEach(key => {
      this.dropdownStates[key] = false;
    });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.custom-dropdown')) {
      this.closeAllDropdowns();
    }
  }
}