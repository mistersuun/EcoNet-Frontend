import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { ScrollAnimationService } from '../../services/scroll-animation.service';

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
  imports: [CommonModule, ReactiveFormsModule, RouterLink, TranslocoPipe],
  template: `
    <section #heroSection class="hero-section" [class.visible]="isHeroVisible">
      <div class="container">
        <div class="hero-content text-center fade-in-up" [class.visible]="isHeroVisible">
          <h1 class="stagger-1">{{ 'CONTACT.TITLE' | transloco }}</h1>
          <p class="stagger-2">{{ 'CONTACT.SUBTITLE' | transloco }}</p>
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
                <label for="serviceType">{{ 'CONTACT.SERVICE_TYPE' | transloco }}</label>
                <select id="serviceType" formControlName="serviceType" class="form-control">
                  <option value="">{{ 'CONTACT.SERVICE_OPTIONS.SELECT' | transloco }}</option>
                  <option value="residential">{{ 'CONTACT.SERVICE_OPTIONS.RESIDENTIAL' | transloco }}</option>
                  <option value="commercial">{{ 'CONTACT.SERVICE_OPTIONS.COMMERCIAL' | transloco }}</option>
                  <option value="post-construction">{{ 'CONTACT.SERVICE_OPTIONS.POST_CONSTRUCTION' | transloco }}</option>
                  <option value="deep-cleaning">{{ 'CONTACT.SERVICE_OPTIONS.DEEP_CLEANING' | transloco }}</option>
                  <option value="maintenance">{{ 'CONTACT.SERVICE_OPTIONS.MAINTENANCE' | transloco }}</option>
                  <option value="carpet">{{ 'CONTACT.SERVICE_OPTIONS.CARPET' | transloco }}</option>
                  <option value="other">{{ 'CONTACT.SERVICE_OPTIONS.OTHER' | transloco }}</option>
                </select>
              </div>

              <div class="form-group">
                <label for="propertySize">{{ 'CONTACT.PROPERTY_SIZE' | transloco }}</label>
                <select id="propertySize" formControlName="propertySize" class="form-control">
                  <option value="">{{ 'CONTACT.SIZE_OPTIONS.SELECT' | transloco }}</option>
                  <option value="small">{{ 'CONTACT.SIZE_OPTIONS.SMALL' | transloco }}</option>
                  <option value="medium">{{ 'CONTACT.SIZE_OPTIONS.MEDIUM' | transloco }}</option>
                  <option value="large">{{ 'CONTACT.SIZE_OPTIONS.LARGE' | transloco }}</option>
                  <option value="xlarge">{{ 'CONTACT.SIZE_OPTIONS.XLARGE' | transloco }}</option>
                </select>
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

              <div class="form-group checkbox-group">
                <label class="checkbox-label">
                  <input type="checkbox" formControlName="urgentRequest">
                  <span class="checkmark"></span>
                  {{ 'CONTACT.URGENT_REQUEST' | transloco }}
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
  `,
  styles: [`
    /* Hero Section */
    .hero-section {
      background: linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%);
      color: var(--pure-white);
      padding: var(--space-5xl) 0;
      min-height: 50vh;
      display: flex;
      align-items: center;
    }

    .hero-content h1 {
      font-size: clamp(2.5rem, 5vw, 4rem);
      margin-bottom: var(--space-lg);
      color: var(--pure-white);
      font-weight: var(--font-weight-bold);
      letter-spacing: -0.02em;
    }

    .hero-content p {
      font-size: clamp(1.1rem, 2vw, 1.3rem);
      opacity: 0.95;
      max-width: 700px;
      margin: 0 auto;
      line-height: 1.6;
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
      margin-bottom: var(--space-sm);
      font-weight: var(--font-weight-semibold);
      color: var(--neutral-dark);
      font-size: 0.95rem;
      letter-spacing: 0.01em;
    }

    .form-control {
      width: 100%;
      padding: var(--space-md) var(--space-lg);
      border: 2px solid rgba(107, 144, 128, 0.15);
      border-radius: var(--radius-lg);
      font-family: var(--font-primary);
      font-size: 1rem;
      transition: all var(--transition-base);
      background: var(--pure-white);
      font-weight: var(--font-weight-medium);
      color: var(--neutral-dark);
      line-height: 1.5;
    }

    .form-control:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(107, 144, 128, 0.1);
      background: var(--pure-white);
    }

    .form-control:hover:not(:focus) {
      border-color: rgba(107, 144, 128, 0.25);
    }

    .form-control.error {
      border-color: var(--error);
      background: rgba(232, 122, 122, 0.02);
      box-shadow: 0 0 0 3px rgba(232, 122, 122, 0.1);
    }

    .form-control::placeholder {
      color: var(--neutral-light);
      opacity: 1;
    }

    /* Custom Select Styling */
    select.form-control {
      appearance: none;
      -webkit-appearance: none;
      -moz-appearance: none;
      background: var(--pure-white) url("data:image/svg+xml;utf8,<svg fill='%236b9080' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10L12 15L17 10H7Z'/></svg>") no-repeat;
      background-position: right var(--space-md) center;
      background-size: 20px;
      padding-right: calc(var(--space-2xl) + 10px);
      cursor: pointer;
      min-height: 48px;
    }

    select.form-control:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(107, 144, 128, 0.1);
      background: var(--pure-white) url("data:image/svg+xml;utf8,<svg fill='%235a7a6b' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10L12 15L17 10H7Z'/></svg>") no-repeat;
      background-position: right var(--space-md) center;
      background-size: 20px;
    }

    select.form-control:hover:not(:focus) {
      border-color: rgba(107, 144, 128, 0.25);
    }

    /* Custom Option Styling */
    select.form-control option {
      background: var(--pure-white);
      color: var(--neutral-dark);
      padding: var(--space-sm) var(--space-md);
      font-weight: var(--font-weight-medium);
      border: none;
    }

    select.form-control option:checked {
      background: var(--secondary);
      color: var(--primary);
    }

    select.form-control option:hover {
      background: var(--secondary);
      color: var(--primary);
    }

    /* Disabled state */
    select.form-control:disabled {
      background-color: var(--neutral-lightest);
      background-image: url("data:image/svg+xml;utf8,<svg fill='%239a9a9a' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10L12 15L17 10H7Z'/></svg>");
      color: var(--neutral-light);
      cursor: not-allowed;
      opacity: 0.6;
    }

    /* Textarea specific styling */
    textarea.form-control {
      resize: vertical;
      min-height: 120px;
      line-height: 1.6;
    }

    .error-message {
      color: var(--error);
      font-size: 0.875rem;
      margin-top: var(--space-xs);
      font-weight: var(--font-weight-medium);
    }

    .checkbox-group {
      display: flex;
      align-items: center;
    }

    .checkbox-label {
      display: flex;
      align-items: center;
      cursor: pointer;
      font-weight: normal !important;
      margin-bottom: 0 !important;
    }

    .checkbox-label input[type="checkbox"] {
      margin-right: var(--spacing-sm);
      transform: scale(1.2);
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
      .hero-section {
        padding: var(--space-3xl) 0;
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

  isHeroVisible = false;
  areContactMethodsVisible = false;
  isContactFormVisible = false;
  areOfficeLocationsVisible = false;
  isFaqPreviewVisible = false;

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
      value: 'info@econet-proprete.ca',
      description: 'CONTACT.EMAIL_DESC',
      action: 'CONTACT.EMAIL_ACTION'
    },
    {
      icon: '💬',
      title: 'CONTACT.CHAT',
      value: 'Chat disponible',
      description: 'CONTACT.CHAT_DESC',
      action: 'CONTACT.CHAT_ACTION'
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
    private transloco: TranslocoService
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

  onSubmit() {
    if (this.contactForm.valid) {
      this.isSubmitting = true;

      // Simulate form submission
      setTimeout(() => {
        console.log('Form submitted:', this.contactForm.value);
        alert('Merci pour votre demande! Nous vous contacterons sous peu.');
        this.contactForm.reset();
        this.isSubmitting = false;
      }, 2000);
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
}