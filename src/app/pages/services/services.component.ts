import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';

interface Service {
  id: string;
  title: string;
  category: string;
  description: string;
  features: string[];
  image: string;
  price: string;
  duration: string;
  popular?: boolean;
}

interface ServiceCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
}

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslocoPipe],
  template: `
    <!-- Sophisticated Hero Section -->
    <section class="hero wave-border-bottom-only" #heroSection>
      <div class="container">
        <div class="hero-content">
          <div class="hero-text fade-in-up" [class.visible]="isHeroVisible">
            <div class="hero-badge">
              {{ 'SERVICES.PAGE.HERO.BADGE' | transloco }}
            </div>
            <h1 class="hero-title">
              {{ 'SERVICES.PAGE.HERO.TITLE' | transloco }}
              <span class="accent-text">{{ 'SERVICES.PAGE.HERO.TITLE_ACCENT' | transloco }}</span>
            </h1>
            <p class="hero-subtitle">
              {{ 'SERVICES.PAGE.HERO.SUBTITLE' | transloco }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Service Categories -->
    <section class="section categories-section" #categoriesSection>
      <div class="container">
        <div class="section-header fade-in-up" [class.visible]="isCategoriesVisible">
          <h2 class="section-title">{{ 'SERVICES.PAGE.CATEGORIES.TITLE' | transloco }}</h2>
          <p class="section-subtitle">
            {{ 'SERVICES.PAGE.CATEGORIES.SUBTITLE' | transloco }}
          </p>
        </div>

        <div class="categories-grid">
          <div class="category-card fade-in-up"
               [class.visible]="isCategoriesVisible"
               [class]="'stagger-' + (i + 1)"
               *ngFor="let category of categories; index as i">
            <div class="category-icon">{{category.icon}}</div>
            <h3>{{ 'SERVICES.PAGE.CATEGORIES.' + category.id.toUpperCase() + '.NAME' | transloco }}</h3>
            <p>{{ 'SERVICES.PAGE.CATEGORIES.' + category.id.toUpperCase() + '.DESCRIPTION' | transloco }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Detailed Services -->
    <section class="section services-section" #servicesSection>
      <div class="container">
        <div class="section-header fade-in-up" [class.visible]="isServicesVisible">
          <h2 class="section-title">{{ 'SERVICES.PAGE.DETAILED.TITLE' | transloco }}</h2>
          <p class="section-subtitle">
            {{ 'SERVICES.PAGE.DETAILED.SUBTITLE' | transloco }}
          </p>
        </div>

        <div class="services-grid">
          <div class="service-card fade-in-up"
               [class.visible]="isServicesVisible"
               [class.popular]="service.popular"
               [style.transition-delay]="(i * 0.1) + 's'"
               *ngFor="let service of services; index as i">

            <div class="service-badge" *ngIf="service.popular">
              {{ 'SERVICES.PAGE.DETAILED.POPULAR_BADGE' | transloco }}
            </div>

            <div class="service-image">
              <img [src]="service.image" [alt]="service.title" class="img-cover">
              <div class="service-overlay">
                <div class="service-category">{{ 'SERVICES.PAGE.SERVICE_LIST.' + service.id.toUpperCase() + '.CATEGORY' | transloco }}</div>
              </div>
            </div>

            <div class="service-content">
              <h3>{{ 'SERVICES.PAGE.SERVICE_LIST.' + service.id.toUpperCase() + '.TITLE' | transloco }}</h3>
              <p>{{ 'SERVICES.PAGE.SERVICE_LIST.' + service.id.toUpperCase() + '.DESCRIPTION' | transloco }}</p>

              <ul class="service-features">
                <li *ngFor="let feature of getServiceFeatures(service.id); let i = index">
                  <span class="check-icon">✓</span>
                  {{feature}}
                </li>
              </ul>

              <div class="service-meta">
                <div class="service-price">
                  <span class="price-label">{{ 'SERVICES.PAGE.DETAILED.PRICE_LABEL' | transloco }}</span>
                  <span class="price-value">{{ 'SERVICES.PAGE.SERVICE_LIST.' + service.id.toUpperCase() + '.PRICE' | transloco }}</span>
                </div>
                <div class="service-duration">
                  <span class="duration-icon">⏱️</span>
                  {{ 'SERVICES.PAGE.SERVICE_LIST.' + service.id.toUpperCase() + '.DURATION' | transloco }}
                </div>
              </div>

              <div class="service-actions">
                <a routerLink="/booking" class="btn btn-primary">{{ 'SERVICES.PAGE.DETAILED.BUTTONS.BOOK' | transloco }}</a>
                <a routerLink="/contact" class="btn btn-secondary">{{ 'SERVICES.PAGE.DETAILED.BUTTONS.QUOTE' | transloco }}</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Why Choose Us -->
    <section class="section why-section" #whySection>
      <div class="container">
        <div class="why-content">
          <div class="why-text fade-in-left" [class.visible]="isWhyVisible">
            <h2 class="section-title">{{ 'SERVICES.PAGE.WHY.TITLE' | transloco }}</h2>
            <div class="why-features">
              <div class="why-feature">
                <div class="feature-icon">🌱</div>
                <div>
                  <h4>{{ 'SERVICES.PAGE.WHY.FEATURES.ECO.TITLE' | transloco }}</h4>
                  <p>{{ 'SERVICES.PAGE.WHY.FEATURES.ECO.DESCRIPTION' | transloco }}</p>
                </div>
              </div>
              <div class="why-feature">
                <div class="feature-icon">🏆</div>
                <div>
                  <h4>{{ 'SERVICES.PAGE.WHY.FEATURES.EXPERTISE.TITLE' | transloco }}</h4>
                  <p>{{ 'SERVICES.PAGE.WHY.FEATURES.EXPERTISE.DESCRIPTION' | transloco }}</p>
                </div>
              </div>
              <div class="why-feature">
                <div class="feature-icon">🛡️</div>
                <div>
                  <h4>{{ 'SERVICES.PAGE.WHY.FEATURES.INSURANCE.TITLE' | transloco }}</h4>
                  <p>{{ 'SERVICES.PAGE.WHY.FEATURES.INSURANCE.DESCRIPTION' | transloco }}</p>
                </div>
              </div>
            </div>
          </div>
          <div class="why-visual fade-in-right" [class.visible]="isWhyVisible">
            <div class="why-image">
              <img src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&h=400&fit=crop&auto=format&q=80"
                   [alt]="'SERVICES.PAGE.WHY.IMAGE_ALT' | transloco"
                   class="img-cover">
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="section cta-section wave-border-bottom-only" #ctaSection>
      <div class="container">
        <div class="cta-content fade-in-up" [class.visible]="isCtaVisible">
          <h2 class="cta-title">{{ 'SERVICES.PAGE.CTA.TITLE' | transloco }}</h2>
          <p class="cta-subtitle">
            {{ 'SERVICES.PAGE.CTA.SUBTITLE' | transloco }}
          </p>
          <div class="cta-actions">
            <a routerLink="/booking" class="btn btn-primary btn-lg">
              {{ 'SERVICES.PAGE.CTA.BOOK_NOW' | transloco }}
            </a>
            <a routerLink="/contact" class="btn btn-secondary btn-lg">
              {{ 'SERVICES.PAGE.CTA.GET_QUOTE' | transloco }}
            </a>
          </div>
        </div>
      </div>
    </section>
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
      margin-bottom: var(--space-xl);
    }

    .accent-text {
      color: var(--accent-dark);
    }

    .hero-subtitle {
      font-size: 1.25rem;
      line-height: 1.6;
      color: var(--neutral-medium);
      max-width: 600px;
      margin: 0 auto;
    }

    /* Categories Section */
    .categories-section {
      background: var(--pure-white);
      position: relative;
      overflow: visible;
    }

    .categories-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: var(--space-2xl);
      margin-top: var(--space-3xl);
    }

    .category-card {
      text-align: center;
      padding: var(--space-2xl);
      border: 1px solid rgba(212, 165, 116, 0.1);
      transition: all var(--transition-base);
    }

    .category-card:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-medium);
      border-color: var(--primary);
    }

    .category-icon {
      font-size: 3rem;
      margin-bottom: var(--space-lg);
    }

    .category-card h3 {
      margin-bottom: var(--space-md);
      color: var(--neutral-dark);
    }

    /* Services Section */
    .services-section {
      background: var(--neutral-lightest);
      position: relative;
      overflow: visible;
    }

    .services-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
      gap: var(--space-2xl);
      margin-top: var(--space-3xl);
    }

    .service-card {
      background: var(--pure-white);
      border-radius: var(--radius-xl);
      overflow: hidden;
      position: relative;
      transition: all var(--transition-base);
    }

    .service-card:hover {
      transform: translateY(-8px);
      box-shadow: var(--shadow-large);
    }

    .service-card.popular {
      border: 2px solid var(--accent);
    }

    .service-badge {
      position: absolute;
      top: var(--space-lg);
      right: var(--space-lg);
      background: var(--accent);
      color: var(--pure-white);
      padding: var(--space-xs) var(--space-sm);
      border-radius: var(--radius-sm);
      font-size: 0.75rem;
      font-weight: var(--font-weight-bold);
      z-index: 2;
    }

    .service-image {
      height: 240px;
      position: relative;
      overflow: hidden;
    }

    .service-image img {
      transition: transform var(--transition-slow);
    }

    .service-card:hover .service-image img {
      transform: scale(1.05);
    }

    .service-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.3) 100%);
      display: flex;
      align-items: flex-end;
      padding: var(--space-lg);
    }

    .service-category {
      background: rgba(255, 255, 255, 0.9);
      color: var(--neutral-dark);
      padding: var(--space-xs) var(--space-sm);
      border-radius: var(--radius-sm);
      font-size: 0.875rem;
      font-weight: var(--font-weight-medium);
    }

    .service-content {
      padding: var(--space-xl);
    }

    .service-content h3 {
      margin-bottom: var(--space-sm);
      color: var(--neutral-dark);
    }

    .service-content p {
      margin-bottom: var(--space-lg);
      line-height: 1.6;
    }

    .service-features {
      list-style: none;
      margin-bottom: var(--space-lg);
    }

    .service-features li {
      display: flex;
      align-items: center;
      gap: var(--space-sm);
      margin-bottom: var(--space-sm);
      font-size: 0.9rem;
    }

    .check-icon {
      color: var(--success);
      font-weight: var(--font-weight-bold);
      font-size: 0.875rem;
    }

    .service-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-lg);
      padding: var(--space-md) 0;
      border-top: 1px solid var(--neutral-lightest);
    }

    .service-price {
      display: flex;
      flex-direction: column;
    }

    .price-label {
      font-size: 0.75rem;
      color: var(--neutral-medium);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .price-value {
      font-size: 1.25rem;
      font-weight: var(--font-weight-bold);
      color: var(--primary-dark);
    }

    .service-duration {
      display: flex;
      align-items: center;
      gap: var(--space-xs);
      color: var(--neutral-medium);
      font-size: 0.875rem;
    }

    .service-actions {
      display: flex;
      gap: var(--space-sm);
    }

    .service-actions .btn {
      flex: 1;
      font-size: 0.875rem;
      padding: var(--space-md) var(--space-lg);
    }

    /* Why Choose Us */
    .why-section {
      background: var(--pure-white);
      position: relative;
      overflow: visible;
    }

    .why-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--space-4xl);
      align-items: center;
    }

    .why-features {
      display: flex;
      flex-direction: column;
      gap: var(--space-xl);
      margin-top: var(--space-2xl);
    }

    .why-feature {
      display: flex;
      gap: var(--space-lg);
      align-items: flex-start;
    }

    .feature-icon {
      font-size: 2rem;
      flex-shrink: 0;
    }

    .why-feature h4 {
      margin-bottom: var(--space-sm);
      color: var(--neutral-dark);
    }

    .why-image {
      width: 100%;
      height: 400px;
      border-radius: var(--radius-xl);
      overflow: hidden;
      box-shadow: var(--shadow-large);
    }

    /* CTA Section */
    .cta-section {
      background: var(--primary);
      color: var(--pure-white);
      position: relative;
      overflow: visible;
    }

    .cta-content {
      text-align: center;
      max-width: 800px;
      margin: 0 auto;
    }

    .cta-title {
      color: var(--pure-white);
      margin-bottom: var(--space-lg);
    }

    .cta-subtitle {
      font-size: 1.125rem;
      line-height: 1.6;
      color: rgba(255, 255, 255, 0.9);
      margin-bottom: var(--space-3xl);
    }

    .cta-actions {
      display: flex;
      gap: var(--space-md);
      justify-content: center;
      flex-wrap: wrap;
    }

    .cta-section .btn-primary {
      background: var(--pure-white);
      color: var(--primary);
    }

    .cta-section .btn-primary:hover {
      background: var(--secondary);
    }

    .cta-section .btn-secondary {
      background: transparent;
      color: var(--pure-white);
      border-color: rgba(255, 255, 255, 0.3);
    }

    .cta-section .btn-secondary:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: var(--pure-white);
    }

    /* Responsive */
    @media (max-width: 1024px) {
      .why-content {
        grid-template-columns: 1fr;
        gap: var(--space-3xl);
        text-align: center;
      }

      .categories-grid {
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      }

      .services-grid {
        grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      }
    }

    @media (max-width: 768px) {
      /* Hero Section - Mobile */
      .hero {
        padding: var(--space-3xl) 0 var(--space-2xl) !important;
      }

      .hero-content {
        text-align: center;
      }

      .hero-title {
        font-size: 1.75rem !important;
        line-height: 1.2 !important;
      }

      .hero-subtitle {
        font-size: 1rem !important;
      }

      /* Categories Grid - Mobile */
      .categories-grid {
        grid-template-columns: 1fr !important;
        gap: var(--space-lg) !important;
      }

      .category-card {
        text-align: center;
        padding: var(--space-xl) !important;
      }

      .category-icon {
        font-size: 2.5rem !important;
      }

      /* Services Grid - Mobile */
      .services-grid {
        grid-template-columns: 1fr !important;
        gap: var(--space-xl) !important;
      }

      .service-card {
        width: 100% !important;
        max-width: 100% !important;
      }

      .service-image {
        height: 200px !important;
      }

      .service-content {
        padding: var(--space-lg) !important;
      }

      .service-content h3 {
        font-size: 1.25rem !important;
      }

      .service-content p {
        font-size: 0.9rem !important;
      }

      .service-features {
        font-size: 0.875rem !important;
      }

      .service-actions {
        flex-direction: column;
        gap: var(--space-sm);
      }

      .service-actions .btn {
        width: 100%;
      }

      .service-meta {
        flex-direction: column;
        gap: var(--space-md);
        align-items: flex-start;
      }

      /* Why Section - Mobile */
      .why-content {
        flex-direction: column !important;
        gap: var(--space-2xl) !important;
      }

      .why-text,
      .why-visual {
        width: 100% !important;
      }

      .why-features {
        gap: var(--space-lg) !important;
      }

      .why-feature {
        flex-direction: column !important;
        text-align: center !important;
        gap: var(--space-sm) !important;
      }

      .feature-icon {
        font-size: 2rem !important;
      }

      /* CTA Section - Mobile */
      .cta-section {
        padding: var(--space-3xl) 0 !important;
      }

      .cta-title {
        font-size: 1.75rem !important;
      }

      .cta-subtitle {
        font-size: 1rem !important;
      }

      .cta-actions {
        flex-direction: column;
        align-items: center;
        gap: var(--space-md);
      }

      .cta-actions .btn {
        width: 100%;
        max-width: 280px;
      }

      /* Section Headers - Mobile */
      .section-header {
        margin-bottom: var(--space-2xl) !important;
      }

      .section-title {
        font-size: 1.75rem !important;
      }

      .section-subtitle {
        font-size: 1rem !important;
      }
    }

    @media (max-width: 480px) {
      .hero-title {
        font-size: 1.5rem !important;
      }

      .section-title {
        font-size: 1.5rem !important;
      }

      .cta-title {
        font-size: 1.5rem !important;
      }

      .service-image {
        height: 180px !important;
      }

      .category-icon {
        font-size: 2rem !important;
      }

      .feature-icon {
        font-size: 1.75rem !important;
      }
    }

    @media (max-width: 360px) {
      .hero-title,
      .section-title,
      .cta-title {
        font-size: 1.375rem !important;
      }

      .hero-subtitle,
      .section-subtitle,
      .cta-subtitle {
        font-size: 0.875rem !important;
      }

      .service-image {
        height: 160px !important;
      }

      .cta-actions .btn,
      .service-actions .btn {
        max-width: 100% !important;
      }
    }
  `]
})
export class ServicesComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('heroSection') heroSection!: ElementRef;
  @ViewChild('categoriesSection') categoriesSection!: ElementRef;
  @ViewChild('servicesSection') servicesSection!: ElementRef;
  @ViewChild('whySection') whySection!: ElementRef;
  @ViewChild('ctaSection') ctaSection!: ElementRef;

  // Animation states
  isHeroVisible = false;
  isCategoriesVisible = false;
  isServicesVisible = false;
  isWhyVisible = false;
  isCtaVisible = false;

  private observer!: IntersectionObserver;

  categories: ServiceCategory[] = [
    {
      id: 'residential',
      name: '',
      description: '',
      icon: '🏠'
    },
    {
      id: 'commercial',
      name: '',
      description: '',
      icon: '🏢'
    },
    {
      id: 'construction',
      name: '',
      description: '',
      icon: '🚧'
    }
  ];

  services: Service[] = [
    {
      id: 'residential_basic',
      title: '',
      category: '',
      description: '',
      features: ['', '', '', '', ''],
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&auto=format&q=80',
      price: '',
      duration: '',
      popular: true
    },
    {
      id: 'residential_deep',
      title: '',
      category: '',
      description: '',
      features: ['', '', '', '', ''],
      image: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=400&h=300&fit=crop&auto=format&q=80',
      price: '',
      duration: ''
    },
    {
      id: 'commercial_office',
      title: '',
      category: '',
      description: '',
      features: ['', '', '', '', ''],
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop&auto=format&q=80',
      price: '',
      duration: ''
    },
    {
      id: 'commercial_retail',
      title: '',
      category: '',
      description: '',
      features: ['', '', '', '', ''],
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop&auto=format&q=80',
      price: '',
      duration: ''
    },
    {
      id: 'construction_cleanup',
      title: '',
      category: '',
      description: '',
      features: ['', '', '', '', ''],
      image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=300&fit=crop&auto=format&q=80',
      price: '',
      duration: ''
    },
    {
      id: 'maintenance',
      title: '',
      category: '',
      description: '',
      features: ['', '', '', '', ''],
      image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop&auto=format&q=80',
      price: '',
      duration: ''
    }
  ];

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private transloco: TranslocoService) {}

  ngOnInit() {
    this.isHeroVisible = true;
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.setupScrollAnimations();
    }
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  private setupScrollAnimations() {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const element = entry.target;

            if (element === this.categoriesSection?.nativeElement) {
              this.isCategoriesVisible = true;
            } else if (element === this.servicesSection?.nativeElement) {
              this.isServicesVisible = true;
            } else if (element === this.whySection?.nativeElement) {
              this.isWhyVisible = true;
            } else if (element === this.ctaSection?.nativeElement) {
              this.isCtaVisible = true;
            }
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    // Observe sections
    if (this.categoriesSection) this.observer.observe(this.categoriesSection.nativeElement);
    if (this.servicesSection) this.observer.observe(this.servicesSection.nativeElement);
    if (this.whySection) this.observer.observe(this.whySection.nativeElement);
    if (this.ctaSection) this.observer.observe(this.ctaSection.nativeElement);
  }

  getServiceFeatures(serviceId: string): string[] {
    const key = serviceId.toUpperCase();
    const features = this.transloco.translate(`SERVICES.PAGE.SERVICE_LIST.${key}.FEATURES`);
    return Array.isArray(features) ? features : [];
  }
}