import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { TranslocoPipe } from '@jsverse/transloco';
import { RouterLink } from '@angular/router';
import { ScrollAnimationService } from '../../services/scroll-animation.service';

@Component({
  selector: 'app-privacy',
  standalone: true,
  imports: [CommonModule, TranslocoPipe, RouterLink],
  template: `
    <div class="privacy-page">
      <!-- Hero Section -->
      <section #heroSection class="hero fade-in-up" [class.visible]="isHeroVisible">
        <div class="container">
          <div class="hero-content text-center">
            <h1 class="stagger-1">{{ 'PRIVACY.HERO.TITLE' | transloco }}</h1>
            <p class="stagger-2">{{ 'PRIVACY.HERO.SUBTITLE' | transloco }}</p>
            <div class="last-updated stagger-3">
              <span>{{ 'PRIVACY.LAST_UPDATED' | transloco }}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Privacy Content -->
      <section #contentSection class="privacy-content section fade-in-up" [class.visible]="isContentVisible">
        <div class="container">
          <div class="content-layout">

            <!-- Table of Contents -->
            <aside class="table-of-contents stagger-1">
              <h3>{{ 'PRIVACY.TOC.TITLE' | transloco }}</h3>
              <nav class="toc-nav">
                <a href="#information-collection" class="toc-link">{{ 'PRIVACY.TOC.COLLECTION' | transloco }}</a>
                <a href="#information-use" class="toc-link">{{ 'PRIVACY.TOC.USE' | transloco }}</a>
                <a href="#information-sharing" class="toc-link">{{ 'PRIVACY.TOC.SHARING' | transloco }}</a>
                <a href="#data-security" class="toc-link">{{ 'PRIVACY.TOC.SECURITY' | transloco }}</a>
                <a href="#cookies" class="toc-link">{{ 'PRIVACY.TOC.COOKIES' | transloco }}</a>
                <a href="#user-rights" class="toc-link">{{ 'PRIVACY.TOC.RIGHTS' | transloco }}</a>
                <a href="#children-privacy" class="toc-link">{{ 'PRIVACY.TOC.CHILDREN' | transloco }}</a>
                <a href="#policy-changes" class="toc-link">{{ 'PRIVACY.TOC.CHANGES' | transloco }}</a>
                <a href="#contact-info" class="toc-link">{{ 'PRIVACY.TOC.CONTACT' | transloco }}</a>
              </nav>
            </aside>

            <!-- Main Content -->
            <main class="privacy-main stagger-2">

              <!-- Introduction -->
              <section class="privacy-section">
                <div class="section-content">
                  <p>{{ 'PRIVACY.INTRO.PARAGRAPH1' | transloco }}</p>
                  <p>{{ 'PRIVACY.INTRO.PARAGRAPH2' | transloco }}</p>
                </div>
              </section>

              <!-- Information Collection -->
              <section id="information-collection" class="privacy-section">
                <h2>{{ 'PRIVACY.COLLECTION.TITLE' | transloco }}</h2>
                <div class="section-content">
                  <h3>{{ 'PRIVACY.COLLECTION.PERSONAL.TITLE' | transloco }}</h3>
                  <p>{{ 'PRIVACY.COLLECTION.PERSONAL.CONTENT' | transloco }}</p>
                  <ul>
                    <li>{{ 'PRIVACY.COLLECTION.PERSONAL.ITEMS.NAME' | transloco }}</li>
                    <li>{{ 'PRIVACY.COLLECTION.PERSONAL.ITEMS.EMAIL' | transloco }}</li>
                    <li>{{ 'PRIVACY.COLLECTION.PERSONAL.ITEMS.PHONE' | transloco }}</li>
                    <li>{{ 'PRIVACY.COLLECTION.PERSONAL.ITEMS.ADDRESS' | transloco }}</li>
                    <li>{{ 'PRIVACY.COLLECTION.PERSONAL.ITEMS.SERVICE_DETAILS' | transloco }}</li>
                  </ul>

                  <h3>{{ 'PRIVACY.COLLECTION.AUTOMATIC.TITLE' | transloco }}</h3>
                  <p>{{ 'PRIVACY.COLLECTION.AUTOMATIC.CONTENT' | transloco }}</p>
                  <ul>
                    <li>{{ 'PRIVACY.COLLECTION.AUTOMATIC.ITEMS.IP_ADDRESS' | transloco }}</li>
                    <li>{{ 'PRIVACY.COLLECTION.AUTOMATIC.ITEMS.BROWSER_INFO' | transloco }}</li>
                    <li>{{ 'PRIVACY.COLLECTION.AUTOMATIC.ITEMS.DEVICE_INFO' | transloco }}</li>
                    <li>{{ 'PRIVACY.COLLECTION.AUTOMATIC.ITEMS.USAGE_DATA' | transloco }}</li>
                  </ul>
                </div>
              </section>

              <!-- Information Use -->
              <section id="information-use" class="privacy-section">
                <h2>{{ 'PRIVACY.USE.TITLE' | transloco }}</h2>
                <div class="section-content">
                  <p>{{ 'PRIVACY.USE.INTRO' | transloco }}</p>
                  <ul>
                    <li>{{ 'PRIVACY.USE.ITEMS.PROVIDE_SERVICES' | transloco }}</li>
                    <li>{{ 'PRIVACY.USE.ITEMS.COMMUNICATE' | transloco }}</li>
                    <li>{{ 'PRIVACY.USE.ITEMS.IMPROVE_SERVICES' | transloco }}</li>
                    <li>{{ 'PRIVACY.USE.ITEMS.MARKETING' | transloco }}</li>
                    <li>{{ 'PRIVACY.USE.ITEMS.LEGAL_COMPLIANCE' | transloco }}</li>
                  </ul>
                </div>
              </section>

              <!-- Information Sharing -->
              <section id="information-sharing" class="privacy-section">
                <h2>{{ 'PRIVACY.SHARING.TITLE' | transloco }}</h2>
                <div class="section-content">
                  <p>{{ 'PRIVACY.SHARING.INTRO' | transloco }}</p>
                  <ul>
                    <li>{{ 'PRIVACY.SHARING.ITEMS.SERVICE_PROVIDERS' | transloco }}</li>
                    <li>{{ 'PRIVACY.SHARING.ITEMS.LEGAL_REQUIREMENTS' | transloco }}</li>
                    <li>{{ 'PRIVACY.SHARING.ITEMS.BUSINESS_TRANSFER' | transloco }}</li>
                    <li>{{ 'PRIVACY.SHARING.ITEMS.CONSENT' | transloco }}</li>
                  </ul>
                </div>
              </section>

              <!-- Data Security -->
              <section id="data-security" class="privacy-section">
                <h2>{{ 'PRIVACY.SECURITY.TITLE' | transloco }}</h2>
                <div class="section-content">
                  <p>{{ 'PRIVACY.SECURITY.CONTENT' | transloco }}</p>
                </div>
              </section>

              <!-- Cookies -->
              <section id="cookies" class="privacy-section">
                <h2>{{ 'PRIVACY.COOKIES.TITLE' | transloco }}</h2>
                <div class="section-content">
                  <p>{{ 'PRIVACY.COOKIES.CONTENT' | transloco }}</p>
                </div>
              </section>

              <!-- User Rights -->
              <section id="user-rights" class="privacy-section">
                <h2>{{ 'PRIVACY.RIGHTS.TITLE' | transloco }}</h2>
                <div class="section-content">
                  <p>{{ 'PRIVACY.RIGHTS.INTRO' | transloco }}</p>
                  <ul>
                    <li>{{ 'PRIVACY.RIGHTS.ITEMS.ACCESS' | transloco }}</li>
                    <li>{{ 'PRIVACY.RIGHTS.ITEMS.CORRECTION' | transloco }}</li>
                    <li>{{ 'PRIVACY.RIGHTS.ITEMS.DELETION' | transloco }}</li>
                    <li>{{ 'PRIVACY.RIGHTS.ITEMS.PORTABILITY' | transloco }}</li>
                    <li>{{ 'PRIVACY.RIGHTS.ITEMS.OBJECTION' | transloco }}</li>
                  </ul>
                </div>
              </section>

              <!-- Children's Privacy -->
              <section id="children-privacy" class="privacy-section">
                <h2>{{ 'PRIVACY.CHILDREN.TITLE' | transloco }}</h2>
                <div class="section-content">
                  <p>{{ 'PRIVACY.CHILDREN.CONTENT' | transloco }}</p>
                </div>
              </section>

              <!-- Policy Changes -->
              <section id="policy-changes" class="privacy-section">
                <h2>{{ 'PRIVACY.CHANGES.TITLE' | transloco }}</h2>
                <div class="section-content">
                  <p>{{ 'PRIVACY.CHANGES.CONTENT' | transloco }}</p>
                </div>
              </section>

              <!-- Contact Information -->
              <section id="contact-info" class="privacy-section">
                <h2>{{ 'PRIVACY.CONTACT.TITLE' | transloco }}</h2>
                <div class="section-content">
                  <p>{{ 'PRIVACY.CONTACT.INTRO' | transloco }}</p>
                  <div class="contact-details">
                    <div class="contact-item">
                      <strong>{{ 'PRIVACY.CONTACT.COMPANY' | transloco }}</strong>
                      <span>ÉcoNet Propreté</span>
                    </div>
                    <div class="contact-item">
                      <strong>{{ 'PRIVACY.CONTACT.EMAIL_LABEL' | transloco }}</strong>
                      <a href="mailto:privacy@econet-proprete.ca">privacy@econet-proprete.ca</a>
                    </div>
                    <div class="contact-item">
                      <strong>{{ 'PRIVACY.CONTACT.PHONE_LABEL' | transloco }}</strong>
                      <a href="tel:+15149422670">(514) 123-4567</a>
                    </div>
                  </div>
                </div>
              </section>

            </main>
          </div>
        </div>
      </section>

      <!-- CTA Section -->
      <section class="privacy-cta section wave-border-top-only fade-in-up" [class.visible]="isCtaVisible">
        <div class="container text-center">
          <h2 class="stagger-1">{{ 'PRIVACY.CTA.TITLE' | transloco }}</h2>
          <p class="stagger-2">{{ 'PRIVACY.CTA.SUBTITLE' | transloco }}</p>
          <div class="cta-actions">
            <a routerLink="/contact" class="btn btn-primary btn-lg stagger-3">
              {{ 'PRIVACY.CTA.CONTACT_US' | transloco }}
            </a>
            <a routerLink="/terms" class="btn btn-secondary btn-lg stagger-4">
              {{ 'PRIVACY.CTA.VIEW_TERMS' | transloco }}
            </a>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    /* Hero Section */
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

    /* Content Layout */
    .privacy-content {
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

    /* Table of Contents */
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

    /* Main Content */
    .privacy-main {
      max-width: none;
    }

    .privacy-section {
      margin-bottom: var(--space-4xl);
      padding-bottom: var(--space-2xl);
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    }

    .privacy-section:last-child {
      border-bottom: none;
      margin-bottom: 0;
    }

    .privacy-section h2 {
      color: var(--neutral-dark);
      margin-bottom: var(--space-xl);
      font-size: clamp(1.5rem, 3vw, 2rem);
      font-weight: var(--font-weight-semibold);
      letter-spacing: -0.02em;
      scroll-margin-top: 120px;
    }

    .privacy-section h3 {
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
      content: '✓';
      position: absolute;
      left: 0;
      color: var(--primary);
      font-weight: var(--font-weight-bold);
    }

    /* Contact Details */
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

    /* CTA Section */
    .privacy-cta {
      background: linear-gradient(135deg, var(--viridian) 0%, var(--cambridge-blue) 100%);
      color: var(--pure-white);
      padding: var(--space-5xl) 0;
    }

    .privacy-cta h2 {
      margin-bottom: var(--space-lg);
      color: var(--pure-white);
      font-size: clamp(2rem, 4vw, 2.5rem);
    }

    .privacy-cta p {
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

    .privacy-cta .btn-primary {
      background: var(--pure-white);
      color: var(--primary);
    }

    .privacy-cta .btn-primary:hover {
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

      .privacy-main {
        order: 1;
      }

      .toc-nav {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: var(--space-sm);
      }

      .privacy-section {
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
export class PrivacyComponent implements OnInit, OnDestroy, AfterViewInit {
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