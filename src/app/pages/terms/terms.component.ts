import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { TranslocoPipe } from '@jsverse/transloco';
import { RouterLink } from '@angular/router';
import { ScrollAnimationService } from '../../services/scroll-animation.service';

@Component({
  selector: 'app-terms',
  standalone: true,
  imports: [CommonModule, TranslocoPipe, RouterLink],
  template: `
    <div class="terms-page">
      <!-- Hero Section -->
      <section #heroSection class="hero fade-in-up" [class.visible]="isHeroVisible">
        <div class="container">
          <div class="hero-content text-center">
            <h1 class="stagger-1">{{ 'TERMS.HERO.TITLE' | transloco }}</h1>
            <p class="stagger-2">{{ 'TERMS.HERO.SUBTITLE' | transloco }}</p>
            <div class="last-updated stagger-3">
              <span>{{ 'TERMS.LAST_UPDATED' | transloco }}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Terms Content -->
      <section #contentSection class="terms-content section fade-in-up" [class.visible]="isContentVisible">
        <div class="container">
          <div class="content-layout">

            <!-- Table of Contents -->
            <aside class="table-of-contents stagger-1">
              <h3>{{ 'TERMS.TOC.TITLE' | transloco }}</h3>
              <nav class="toc-nav">
                <a href="#acceptance" class="toc-link">{{ 'TERMS.TOC.ACCEPTANCE' | transloco }}</a>
                <a href="#services-description" class="toc-link">{{ 'TERMS.TOC.SERVICES' | transloco }}</a>
                <a href="#booking-terms" class="toc-link">{{ 'TERMS.TOC.BOOKING' | transloco }}</a>
                <a href="#payment-terms" class="toc-link">{{ 'TERMS.TOC.PAYMENT' | transloco }}</a>
                <a href="#cancellation-policy" class="toc-link">{{ 'TERMS.TOC.CANCELLATION' | transloco }}</a>
                <a href="#liability-limitations" class="toc-link">{{ 'TERMS.TOC.LIABILITY' | transloco }}</a>
                <a href="#user-responsibilities" class="toc-link">{{ 'TERMS.TOC.RESPONSIBILITIES' | transloco }}</a>
                <a href="#intellectual-property" class="toc-link">{{ 'TERMS.TOC.IP' | transloco }}</a>
                <a href="#termination" class="toc-link">{{ 'TERMS.TOC.TERMINATION' | transloco }}</a>
                <a href="#governing-law" class="toc-link">{{ 'TERMS.TOC.LAW' | transloco }}</a>
                <a href="#contact-terms" class="toc-link">{{ 'TERMS.TOC.CONTACT' | transloco }}</a>
              </nav>
            </aside>

            <!-- Main Content -->
            <main class="terms-main stagger-2">

              <!-- Introduction -->
              <section class="terms-section">
                <div class="section-content">
                  <p>{{ 'TERMS.INTRO.PARAGRAPH1' | transloco }}</p>
                  <p>{{ 'TERMS.INTRO.PARAGRAPH2' | transloco }}</p>
                </div>
              </section>

              <!-- Acceptance of Terms -->
              <section id="acceptance" class="terms-section">
                <h2>{{ 'TERMS.ACCEPTANCE.TITLE' | transloco }}</h2>
                <div class="section-content">
                  <p>{{ 'TERMS.ACCEPTANCE.CONTENT1' | transloco }}</p>
                  <p>{{ 'TERMS.ACCEPTANCE.CONTENT2' | transloco }}</p>
                </div>
              </section>

              <!-- Services Description -->
              <section id="services-description" class="terms-section">
                <h2>{{ 'TERMS.SERVICES.TITLE' | transloco }}</h2>
                <div class="section-content">
                  <p>{{ 'TERMS.SERVICES.INTRO' | transloco }}</p>
                  <h3>{{ 'TERMS.SERVICES.TYPES.TITLE' | transloco }}</h3>
                  <ul>
                    <li>{{ 'TERMS.SERVICES.TYPES.RESIDENTIAL' | transloco }}</li>
                    <li>{{ 'TERMS.SERVICES.TYPES.COMMERCIAL' | transloco }}</li>
                    <li>{{ 'TERMS.SERVICES.TYPES.POST_CONSTRUCTION' | transloco }}</li>
                    <li>{{ 'TERMS.SERVICES.TYPES.MAINTENANCE' | transloco }}</li>
                  </ul>
                  <p>{{ 'TERMS.SERVICES.STANDARDS' | transloco }}</p>
                </div>
              </section>

              <!-- Booking Terms -->
              <section id="booking-terms" class="terms-section">
                <h2>{{ 'TERMS.BOOKING.TITLE' | transloco }}</h2>
                <div class="section-content">
                  <h3>{{ 'TERMS.BOOKING.PROCESS.TITLE' | transloco }}</h3>
                  <p>{{ 'TERMS.BOOKING.PROCESS.CONTENT' | transloco }}</p>

                  <h3>{{ 'TERMS.BOOKING.CONFIRMATION.TITLE' | transloco }}</h3>
                  <p>{{ 'TERMS.BOOKING.CONFIRMATION.CONTENT' | transloco }}</p>

                  <h3>{{ 'TERMS.BOOKING.MODIFICATIONS.TITLE' | transloco }}</h3>
                  <p>{{ 'TERMS.BOOKING.MODIFICATIONS.CONTENT' | transloco }}</p>
                </div>
              </section>

              <!-- Payment Terms -->
              <section id="payment-terms" class="terms-section">
                <h2>{{ 'TERMS.PAYMENT.TITLE' | transloco }}</h2>
                <div class="section-content">
                  <h3>{{ 'TERMS.PAYMENT.PRICING.TITLE' | transloco }}</h3>
                  <p>{{ 'TERMS.PAYMENT.PRICING.CONTENT' | transloco }}</p>

                  <h3>{{ 'TERMS.PAYMENT.METHODS.TITLE' | transloco }}</h3>
                  <ul>
                    <li>{{ 'TERMS.PAYMENT.METHODS.CASH' | transloco }}</li>
                    <li>{{ 'TERMS.PAYMENT.METHODS.CHEQUE' | transloco }}</li>
                    <li>{{ 'TERMS.PAYMENT.METHODS.TRANSFER' | transloco }}</li>
                    <li>{{ 'TERMS.PAYMENT.METHODS.CARD' | transloco }}</li>
                  </ul>

                  <h3>{{ 'TERMS.PAYMENT.SCHEDULE.TITLE' | transloco }}</h3>
                  <p>{{ 'TERMS.PAYMENT.SCHEDULE.CONTENT' | transloco }}</p>

                  <h3>{{ 'TERMS.PAYMENT.TAXES.TITLE' | transloco }}</h3>
                  <p>{{ 'TERMS.PAYMENT.TAXES.CONTENT' | transloco }}</p>
                </div>
              </section>

              <!-- Cancellation Policy -->
              <section id="cancellation-policy" class="terms-section">
                <h2>{{ 'TERMS.CANCELLATION.TITLE' | transloco }}</h2>
                <div class="section-content">
                  <h3>{{ 'TERMS.CANCELLATION.CLIENT.TITLE' | transloco }}</h3>
                  <p>{{ 'TERMS.CANCELLATION.CLIENT.CONTENT' | transloco }}</p>

                  <h3>{{ 'TERMS.CANCELLATION.COMPANY.TITLE' | transloco }}</h3>
                  <p>{{ 'TERMS.CANCELLATION.COMPANY.CONTENT' | transloco }}</p>

                  <h3>{{ 'TERMS.CANCELLATION.WEATHER.TITLE' | transloco }}</h3>
                  <p>{{ 'TERMS.CANCELLATION.WEATHER.CONTENT' | transloco }}</p>
                </div>
              </section>

              <!-- Liability Limitations -->
              <section id="liability-limitations" class="terms-section">
                <h2>{{ 'TERMS.LIABILITY.TITLE' | transloco }}</h2>
                <div class="section-content">
                  <h3>{{ 'TERMS.LIABILITY.INSURANCE.TITLE' | transloco }}</h3>
                  <p>{{ 'TERMS.LIABILITY.INSURANCE.CONTENT' | transloco }}</p>

                  <h3>{{ 'TERMS.LIABILITY.LIMITATIONS.TITLE' | transloco }}</h3>
                  <p>{{ 'TERMS.LIABILITY.LIMITATIONS.CONTENT' | transloco }}</p>

                  <h3>{{ 'TERMS.LIABILITY.EXCLUSIONS.TITLE' | transloco }}</h3>
                  <ul>
                    <li>{{ 'TERMS.LIABILITY.EXCLUSIONS.PRE_EXISTING' | transloco }}</li>
                    <li>{{ 'TERMS.LIABILITY.EXCLUSIONS.VALUABLE_ITEMS' | transloco }}</li>
                    <li>{{ 'TERMS.LIABILITY.EXCLUSIONS.PETS' | transloco }}</li>
                    <li>{{ 'TERMS.LIABILITY.EXCLUSIONS.ACCESS' | transloco }}</li>
                  </ul>
                </div>
              </section>

              <!-- User Responsibilities -->
              <section id="user-responsibilities" class="terms-section">
                <h2>{{ 'TERMS.RESPONSIBILITIES.TITLE' | transloco }}</h2>
                <div class="section-content">
                  <p>{{ 'TERMS.RESPONSIBILITIES.INTRO' | transloco }}</p>
                  <ul>
                    <li>{{ 'TERMS.RESPONSIBILITIES.ACCESS' | transloco }}</li>
                    <li>{{ 'TERMS.RESPONSIBILITIES.VALUABLES' | transloco }}</li>
                    <li>{{ 'TERMS.RESPONSIBILITIES.PETS' | transloco }}</li>
                    <li>{{ 'TERMS.RESPONSIBILITIES.HAZARDS' | transloco }}</li>
                    <li>{{ 'TERMS.RESPONSIBILITIES.INFORMATION' | transloco }}</li>
                  </ul>
                </div>
              </section>

              <!-- Intellectual Property -->
              <section id="intellectual-property" class="terms-section">
                <h2>{{ 'TERMS.IP.TITLE' | transloco }}</h2>
                <div class="section-content">
                  <p>{{ 'TERMS.IP.CONTENT1' | transloco }}</p>
                  <p>{{ 'TERMS.IP.CONTENT2' | transloco }}</p>
                </div>
              </section>

              <!-- Termination -->
              <section id="termination" class="terms-section">
                <h2>{{ 'TERMS.TERMINATION.TITLE' | transloco }}</h2>
                <div class="section-content">
                  <p>{{ 'TERMS.TERMINATION.CONDITIONS' | transloco }}</p>
                  <p>{{ 'TERMS.TERMINATION.EFFECTS' | transloco }}</p>
                </div>
              </section>

              <!-- Governing Law -->
              <section id="governing-law" class="terms-section">
                <h2>{{ 'TERMS.LAW.TITLE' | transloco }}</h2>
                <div class="section-content">
                  <p>{{ 'TERMS.LAW.CONTENT' | transloco }}</p>
                </div>
              </section>

              <!-- Contact Information -->
              <section id="contact-terms" class="terms-section">
                <h2>{{ 'TERMS.CONTACT.TITLE' | transloco }}</h2>
                <div class="section-content">
                  <p>{{ 'TERMS.CONTACT.INTRO' | transloco }}</p>
                  <div class="contact-details">
                    <div class="contact-item">
                      <strong>{{ 'TERMS.CONTACT.COMPANY' | transloco }}</strong>
                      <span>ÉcoNet Propreté</span>
                    </div>
                    <div class="contact-item">
                      <strong>{{ 'TERMS.CONTACT.EMAIL_LABEL' | transloco }}</strong>
                      <a href="mailto:econetentretienmenager@gmail.com">econetentretienmenager@gmail.com</a>
                    </div>
                    <div class="contact-item">
                      <strong>{{ 'TERMS.CONTACT.PHONE_LABEL' | transloco }}</strong>
                      <a href="tel:+15149422670">(514) 942-2670</a>
                    </div>
                    <div class="contact-item">
                      <strong>{{ 'TERMS.CONTACT.ADDRESS_LABEL' | transloco }}</strong>
                      <span>Montreal, Quebec, Canada</span>
                    </div>
                  </div>
                </div>
              </section>

            </main>
          </div>
        </div>
      </section>

      <!-- CTA Section -->
      <section class="terms-cta section wave-border-top-only fade-in-up" [class.visible]="isCtaVisible">
        <div class="container text-center">
          <h2 class="stagger-1">{{ 'TERMS.CTA.TITLE' | transloco }}</h2>
          <p class="stagger-2">{{ 'TERMS.CTA.SUBTITLE' | transloco }}</p>
          <div class="cta-actions">
            <a routerLink="/booking" class="btn btn-primary btn-lg stagger-3">
              {{ 'TERMS.CTA.BOOK_SERVICE' | transloco }}
            </a>
            <a routerLink="/privacy" class="btn btn-secondary btn-lg stagger-4">
              {{ 'TERMS.CTA.VIEW_PRIVACY' | transloco }}
            </a>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    /* Reuse the same styles as privacy with slight modifications */
    .hero {
      background: linear-gradient(135deg, var(--mint-cream) 0%, var(--azure-web) 100%);
      padding: var(--space-5xl) 0 var(--space-4xl);
      text-align: center;
    }

    .hero-content h1 {
      margin-bottom: var(--space-lg);
      color: var(--neutral-dark);
      font-size: clamp(2.5rem, 5vw, 3.5rem);
      font-weight: var(--font-weight-bold);
      letter-spacing: -0.02em;
    }

    .hero-content p {
      font-size: clamp(1.1rem, 2vw, 1.3rem);
      color: var(--neutral-medium);
      margin-bottom: var(--space-xl);
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
    }

    .last-updated {
      background: rgba(107, 144, 128, 0.1);
      color: var(--primary);
      padding: var(--space-sm) var(--space-lg);
      border-radius: var(--radius-full);
      font-size: 0.9rem;
      font-weight: var(--font-weight-medium);
      display: inline-block;
    }

    .terms-content {
      padding: var(--space-5xl) 0;
      background: var(--pure-white);
    }

    .content-layout {
      display: grid;
      grid-template-columns: 280px 1fr;
      gap: var(--space-4xl);
      max-width: 1200px;
      margin: 0 auto;
    }

    .table-of-contents {
      position: sticky;
      top: 120px;
      height: fit-content;
      background: var(--secondary);
      padding: var(--space-2xl);
      border-radius: var(--radius-xl);
      box-shadow: var(--shadow-soft);
    }

    .table-of-contents h3 {
      margin-bottom: var(--space-lg);
      color: var(--neutral-dark);
      font-size: 1.1rem;
      font-weight: var(--font-weight-semibold);
    }

    .toc-nav {
      display: flex;
      flex-direction: column;
      gap: var(--space-sm);
    }

    .toc-link {
      text-decoration: none;
      color: var(--neutral-medium);
      font-size: 0.9rem;
      padding: var(--space-sm) var(--space-md);
      border-radius: var(--radius-md);
      transition: all var(--transition-base);
      border-left: 3px solid transparent;
    }

    .toc-link:hover {
      color: var(--primary);
      background: rgba(107, 144, 128, 0.1);
      border-left-color: var(--primary);
      transform: translateX(4px);
    }

    .terms-main {
      max-width: none;
    }

    .terms-section {
      margin-bottom: var(--space-4xl);
      padding-bottom: var(--space-2xl);
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    }

    .terms-section:last-child {
      border-bottom: none;
      margin-bottom: 0;
    }

    .terms-section h2 {
      color: var(--neutral-dark);
      margin-bottom: var(--space-xl);
      font-size: clamp(1.5rem, 3vw, 2rem);
      font-weight: var(--font-weight-semibold);
      letter-spacing: -0.02em;
      scroll-margin-top: 120px;
    }

    .terms-section h3 {
      color: var(--primary);
      margin-bottom: var(--space-lg);
      margin-top: var(--space-xl);
      font-size: 1.25rem;
      font-weight: var(--font-weight-medium);
    }

    .section-content p {
      margin-bottom: var(--space-lg);
      line-height: 1.7;
      color: var(--neutral-medium);
      font-size: 1.05rem;
    }

    .section-content ul {
      list-style: none;
      margin-bottom: var(--space-xl);
      padding-left: 0;
    }

    .section-content li {
      position: relative;
      padding-left: var(--space-xl);
      margin-bottom: var(--space-md);
      line-height: 1.6;
      color: var(--neutral-medium);
      font-size: 1rem;
    }

    .section-content li::before {
      content: '•';
      position: absolute;
      left: 0;
      color: var(--primary);
      font-weight: var(--font-weight-bold);
      font-size: 1.2rem;
    }

    .contact-details {
      background: var(--secondary);
      padding: var(--space-2xl);
      border-radius: var(--radius-lg);
      margin-top: var(--space-xl);
    }

    .contact-item {
      display: flex;
      flex-direction: column;
      gap: var(--space-xs);
      margin-bottom: var(--space-lg);
    }

    .contact-item:last-child {
      margin-bottom: 0;
    }

    .contact-item strong {
      color: var(--neutral-dark);
      font-weight: var(--font-weight-semibold);
      font-size: 0.95rem;
    }

    .contact-item span,
    .contact-item a {
      color: var(--primary);
      text-decoration: none;
      font-weight: var(--font-weight-medium);
    }

    .contact-item a:hover {
      text-decoration: underline;
    }

    .terms-cta {
      background: linear-gradient(135deg, var(--viridian) 0%, var(--cambridge-blue) 100%);
      color: var(--pure-white);
      padding: var(--space-5xl) 0;
    }

    .terms-cta h2 {
      margin-bottom: var(--space-lg);
      color: var(--pure-white);
      font-size: clamp(2rem, 4vw, 2.5rem);
    }

    .terms-cta p {
      font-size: clamp(1rem, 2vw, 1.2rem);
      opacity: 0.95;
      margin-bottom: var(--space-2xl);
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
    }

    .cta-actions {
      display: flex;
      gap: var(--space-lg);
      justify-content: center;
      flex-wrap: wrap;
    }

    .terms-cta .btn-primary {
      background: var(--pure-white);
      color: var(--primary);
    }

    .terms-cta .btn-primary:hover {
      background: var(--secondary);
    }

    /* Mobile Responsive */
    @media (max-width: 1024px) {
      .content-layout {
        grid-template-columns: 240px 1fr;
        gap: var(--space-3xl);
      }

      .table-of-contents {
        padding: var(--space-xl);
      }
    }

    @media (max-width: 768px) {
      .hero {
        padding: var(--space-4xl) 0 var(--space-3xl);
      }

      .content-layout {
        grid-template-columns: 1fr;
        gap: var(--space-2xl);
      }

      .table-of-contents {
        position: static;
        order: 2;
        margin-top: var(--space-3xl);
      }

      .terms-main {
        order: 1;
      }

      .toc-nav {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: var(--space-sm);
      }

      .terms-section {
        margin-bottom: var(--space-3xl);
        padding-bottom: var(--space-xl);
      }

      .cta-actions {
        flex-direction: column;
        align-items: center;
      }

      .cta-actions .btn {
        width: 100%;
        max-width: 300px;
      }
    }

    @media (max-width: 480px) {
      .section-content li {
        padding-left: var(--space-lg);
      }

      .contact-details {
        padding: var(--space-xl);
      }

      .toc-nav {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class TermsComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('heroSection') heroSection!: ElementRef;
  @ViewChild('contentSection') contentSection!: ElementRef;

  isHeroVisible = false;
  isContentVisible = false;
  isCtaVisible = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private scrollAnimationService: ScrollAnimationService
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
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
        element: this.contentSection.nativeElement,
        callback: () => { this.isContentVisible = true; }
      }
    ];

    this.scrollAnimationService.initializeAnimations(elements);
  }
}