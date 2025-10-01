import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { ScrollAnimationService } from '../../services/scroll-animation.service';

interface PricingPlan {
  id: string;
  price: number;
  popular?: boolean;
  icon: string;
}

interface PricingFactor {
  name: string;
  description: string;
  icon: string;
  factors: string[];
}

@Component({
  selector: 'app-pricing',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslocoPipe],
  template: `
    <section #heroSection class="hero-section" [class.visible]="isHeroVisible">
      <div class="container">
        <div class="hero-content text-center fade-in-up" [class.visible]="isHeroVisible">
          <h1 class="stagger-1">{{ 'PRICING.HERO.TITLE' | transloco }}</h1>
          <p class="stagger-2">{{ 'PRICING.HERO.SUBTITLE' | transloco }}</p>
        </div>
      </div>
    </section>

    <section #pricingPlansSection class="services-showcase section">
      <div class="container">
        <div class="section-header text-center fade-in-up mb-4xl" [class.visible]="arePricingPlansVisible">
          <h2 class="section-title stagger-1">{{ 'PRICING.SERVICES.TITLE' | transloco }}</h2>
          <p class="section-subtitle stagger-2">{{ 'PRICING.SERVICES.SUBTITLE' | transloco }}</p>
        </div>

        <div class="carousel-container fade-in-up" [class.visible]="arePricingPlansVisible">
          <div class="carousel-wrapper">
            <div class="carousel-track" [style.transform]="'translateX(' + (-currentSlide * 100) + '%)'">
              <div class="carousel-slide" *ngFor="let plan of pricingPlans; let i = index">
                <div class="service-card">
                  <div class="service-header">
                    <div class="service-icon">{{plan.icon}}</div>
                    <h3 class="service-name">{{ getPlanName(plan.id) }}</h3>
                    <p class="service-description">{{ getPlanDescription(plan.id) }}</p>
                    <div class="service-price">
                      <span class="price-value">{{plan.price}}$</span>
                      <span class="price-note">{{ 'PRICING.STARTING_FROM' | transloco }}</span>
                    </div>
                  </div>

                  <div class="service-features">
                    <ul class="feature-list">
                      <li *ngFor="let feature of getPlanFeatures(plan.id).slice(0, 6)">{{feature}}</li>
                    </ul>
                  </div>

                  <div class="service-actions">
                    <a routerLink="/booking" class="btn-apple primary">{{ 'PRICING.BOOK' | transloco }}</a>
                    <a routerLink="/contact" class="btn-apple secondary">{{ 'PRICING.LEARN_MORE' | transloco }}</a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button class="carousel-btn prev" (click)="previousSlide()" [disabled]="currentSlide === 0">
            <span>‹</span>
          </button>
          <button class="carousel-btn next" (click)="nextSlide()" [disabled]="currentSlide === pricingPlans.length - 1">
            <span>›</span>
          </button>

          <div class="carousel-dots">
            <button
              *ngFor="let plan of pricingPlans; let i = index"
              class="dot"
              [class.active]="i === currentSlide"
              (click)="goToSlide(i)">
            </button>
          </div>
        </div>
      </div>
    </section>

    <section #pricingFactorsSection class="pricing-factors section">
      <div class="container">
        <div class="section-header text-center fade-in-up" [class.visible]="arePricingFactorsVisible">
          <h2 class="section-title stagger-1">{{ 'PRICING.FACTORS_TITLE' | transloco }}</h2>
          <p class="section-subtitle stagger-2">{{ 'PRICING.FACTORS_SUBTITLE' | transloco }}</p>
        </div>

        <div class="factors-grid">
          <div class="factor-card card slide-up" [class.visible]="arePricingFactorsVisible" *ngFor="let factor of pricingFactors; let i = index" [class]="'stagger-' + (i + 3)">
            <div class="factor-icon">{{factor.icon}}</div>
            <h3>{{ getFactorName(factor.name) }}</h3>
            <p class="factor-description">{{ getFactorDescription(factor.name) }}</p>
            <ul class="factor-list">
              <li *ngFor="let item of getFactorItems(factor.name)">{{item}}</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <section #comparisonTableSection class="comparison-table section">
      <div class="container">
        <div class="section-header text-center fade-in-up" [class.visible]="isComparisonTableVisible">
          <h2 class="section-title stagger-1">{{ 'PRICING.COMPARISON.TITLE' | transloco }}</h2>
          <p class="section-subtitle stagger-2">{{ 'PRICING.COMPARISON.SUBTITLE' | transloco }}</p>
        </div>

        <div class="table-container fade-in-up stagger-3" [class.visible]="isComparisonTableVisible">
          <table class="comparison-table-grid">
            <thead>
              <tr>
                <th>{{ 'PRICING.COMPARISON.FEATURES' | transloco }}</th>
                <th>{{ 'PRICING.PLANS.RESIDENTIAL.NAME' | transloco }}</th>
                <th>{{ 'PRICING.PLANS.COMMERCIAL.NAME' | transloco }}</th>
                <th>{{ 'PRICING.PLANS.POSTCONSTRUCTION.NAME' | transloco }}</th>
                <th>{{ 'PRICING.PLANS.DEEPCLEANING.NAME' | transloco }}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="feature-name">{{ 'PRICING.COMPARISON.GENERAL_CLEANING' | transloco }}</td>
                <td class="feature-check">✅</td>
                <td class="feature-check">✅</td>
                <td class="feature-check">✅</td>
                <td class="feature-check">✅</td>
              </tr>
              <tr>
                <td class="feature-name">{{ 'PRICING.COMPARISON.DISINFECTION' | transloco }}</td>
                <td class="feature-check">✅</td>
                <td class="feature-check">✅</td>
                <td class="feature-check">✅</td>
                <td class="feature-check">✅</td>
              </tr>
              <tr>
                <td class="feature-name">{{ 'PRICING.COMPARISON.INTERIOR_WINDOWS' | transloco }}</td>
                <td class="feature-check">✅</td>
                <td class="feature-cross">❌</td>
                <td class="feature-check">✅</td>
                <td class="feature-check">✅</td>
              </tr>
              <tr>
                <td class="feature-name">{{ 'PRICING.COMPARISON.SPECIALIZED_EQUIPMENT' | transloco }}</td>
                <td class="feature-cross">❌</td>
                <td class="feature-check">✅</td>
                <td class="feature-check">✅</td>
                <td class="feature-check">✅</td>
              </tr>
              <tr>
                <td class="feature-name">{{ 'PRICING.COMPARISON.POST_CONSTRUCTION' | transloco }}</td>
                <td class="feature-cross">❌</td>
                <td class="feature-cross">❌</td>
                <td class="feature-check">✅</td>
                <td class="feature-cross">❌</td>
              </tr>
              <tr>
                <td class="feature-name">{{ 'PRICING.COMPARISON.APPLIANCE_INTERIOR' | transloco }}</td>
                <td class="feature-cross">❌</td>
                <td class="feature-cross">❌</td>
                <td class="feature-cross">❌</td>
                <td class="feature-check">✅</td>
              </tr>
              <tr>
                <td class="feature-name">{{ 'PRICING.COMPARISON.SATISFACTION_GUARANTEE' | transloco }}</td>
                <td class="feature-check">✅</td>
                <td class="feature-check">✅</td>
                <td class="feature-check">✅</td>
                <td class="feature-check">✅</td>
              </tr>
            </tbody>
          </table>

          <!-- Mobile Card-Based Comparison -->
          <div class="mobile-comparison-cards">
            <!-- Residential Plan Card -->
            <div class="mobile-plan-card">
              <h3 class="mobile-plan-title">{{ 'PRICING.PLANS.RESIDENTIAL.NAME' | transloco }}</h3>
              <div class="mobile-feature-list">
                <div class="mobile-feature-item">
                  <span class="mobile-feature-name">{{ 'PRICING.COMPARISON.GENERAL_CLEANING' | transloco }}</span>
                  <span class="mobile-feature-value">✅</span>
                </div>
                <div class="mobile-feature-item">
                  <span class="mobile-feature-name">{{ 'PRICING.COMPARISON.DISINFECTION' | transloco }}</span>
                  <span class="mobile-feature-value">✅</span>
                </div>
                <div class="mobile-feature-item">
                  <span class="mobile-feature-name">{{ 'PRICING.COMPARISON.INTERIOR_WINDOWS' | transloco }}</span>
                  <span class="mobile-feature-value">✅</span>
                </div>
                <div class="mobile-feature-item">
                  <span class="mobile-feature-name">{{ 'PRICING.COMPARISON.SPECIALIZED_EQUIPMENT' | transloco }}</span>
                  <span class="mobile-feature-value">❌</span>
                </div>
                <div class="mobile-feature-item">
                  <span class="mobile-feature-name">{{ 'PRICING.COMPARISON.POST_CONSTRUCTION' | transloco }}</span>
                  <span class="mobile-feature-value">❌</span>
                </div>
                <div class="mobile-feature-item">
                  <span class="mobile-feature-name">{{ 'PRICING.COMPARISON.APPLIANCE_INTERIOR' | transloco }}</span>
                  <span class="mobile-feature-value">❌</span>
                </div>
                <div class="mobile-feature-item">
                  <span class="mobile-feature-name">{{ 'PRICING.COMPARISON.SATISFACTION_GUARANTEE' | transloco }}</span>
                  <span class="mobile-feature-value">✅</span>
                </div>
              </div>
            </div>

            <!-- Commercial Plan Card -->
            <div class="mobile-plan-card">
              <h3 class="mobile-plan-title">{{ 'PRICING.PLANS.COMMERCIAL.NAME' | transloco }}</h3>
              <div class="mobile-feature-list">
                <div class="mobile-feature-item">
                  <span class="mobile-feature-name">{{ 'PRICING.COMPARISON.GENERAL_CLEANING' | transloco }}</span>
                  <span class="mobile-feature-value">✅</span>
                </div>
                <div class="mobile-feature-item">
                  <span class="mobile-feature-name">{{ 'PRICING.COMPARISON.DISINFECTION' | transloco }}</span>
                  <span class="mobile-feature-value">✅</span>
                </div>
                <div class="mobile-feature-item">
                  <span class="mobile-feature-name">{{ 'PRICING.COMPARISON.INTERIOR_WINDOWS' | transloco }}</span>
                  <span class="mobile-feature-value">❌</span>
                </div>
                <div class="mobile-feature-item">
                  <span class="mobile-feature-name">{{ 'PRICING.COMPARISON.SPECIALIZED_EQUIPMENT' | transloco }}</span>
                  <span class="mobile-feature-value">✅</span>
                </div>
                <div class="mobile-feature-item">
                  <span class="mobile-feature-name">{{ 'PRICING.COMPARISON.POST_CONSTRUCTION' | transloco }}</span>
                  <span class="mobile-feature-value">❌</span>
                </div>
                <div class="mobile-feature-item">
                  <span class="mobile-feature-name">{{ 'PRICING.COMPARISON.APPLIANCE_INTERIOR' | transloco }}</span>
                  <span class="mobile-feature-value">❌</span>
                </div>
                <div class="mobile-feature-item">
                  <span class="mobile-feature-name">{{ 'PRICING.COMPARISON.SATISFACTION_GUARANTEE' | transloco }}</span>
                  <span class="mobile-feature-value">✅</span>
                </div>
              </div>
            </div>

            <!-- Post-Construction Plan Card -->
            <div class="mobile-plan-card">
              <h3 class="mobile-plan-title">{{ 'PRICING.PLANS.POSTCONSTRUCTION.NAME' | transloco }}</h3>
              <div class="mobile-feature-list">
                <div class="mobile-feature-item">
                  <span class="mobile-feature-name">{{ 'PRICING.COMPARISON.GENERAL_CLEANING' | transloco }}</span>
                  <span class="mobile-feature-value">✅</span>
                </div>
                <div class="mobile-feature-item">
                  <span class="mobile-feature-name">{{ 'PRICING.COMPARISON.DISINFECTION' | transloco }}</span>
                  <span class="mobile-feature-value">✅</span>
                </div>
                <div class="mobile-feature-item">
                  <span class="mobile-feature-name">{{ 'PRICING.COMPARISON.INTERIOR_WINDOWS' | transloco }}</span>
                  <span class="mobile-feature-value">✅</span>
                </div>
                <div class="mobile-feature-item">
                  <span class="mobile-feature-name">{{ 'PRICING.COMPARISON.SPECIALIZED_EQUIPMENT' | transloco }}</span>
                  <span class="mobile-feature-value">✅</span>
                </div>
                <div class="mobile-feature-item">
                  <span class="mobile-feature-name">{{ 'PRICING.COMPARISON.POST_CONSTRUCTION' | transloco }}</span>
                  <span class="mobile-feature-value">✅</span>
                </div>
                <div class="mobile-feature-item">
                  <span class="mobile-feature-name">{{ 'PRICING.COMPARISON.APPLIANCE_INTERIOR' | transloco }}</span>
                  <span class="mobile-feature-value">❌</span>
                </div>
                <div class="mobile-feature-item">
                  <span class="mobile-feature-name">{{ 'PRICING.COMPARISON.SATISFACTION_GUARANTEE' | transloco }}</span>
                  <span class="mobile-feature-value">✅</span>
                </div>
              </div>
            </div>

            <!-- Deep Cleaning Plan Card -->
            <div class="mobile-plan-card">
              <h3 class="mobile-plan-title">{{ 'PRICING.PLANS.DEEPCLEANING.NAME' | transloco }}</h3>
              <div class="mobile-feature-list">
                <div class="mobile-feature-item">
                  <span class="mobile-feature-name">{{ 'PRICING.COMPARISON.GENERAL_CLEANING' | transloco }}</span>
                  <span class="mobile-feature-value">✅</span>
                </div>
                <div class="mobile-feature-item">
                  <span class="mobile-feature-name">{{ 'PRICING.COMPARISON.DISINFECTION' | transloco }}</span>
                  <span class="mobile-feature-value">✅</span>
                </div>
                <div class="mobile-feature-item">
                  <span class="mobile-feature-name">{{ 'PRICING.COMPARISON.INTERIOR_WINDOWS' | transloco }}</span>
                  <span class="mobile-feature-value">✅</span>
                </div>
                <div class="mobile-feature-item">
                  <span class="mobile-feature-name">{{ 'PRICING.COMPARISON.SPECIALIZED_EQUIPMENT' | transloco }}</span>
                  <span class="mobile-feature-value">✅</span>
                </div>
                <div class="mobile-feature-item">
                  <span class="mobile-feature-name">{{ 'PRICING.COMPARISON.POST_CONSTRUCTION' | transloco }}</span>
                  <span class="mobile-feature-value">❌</span>
                </div>
                <div class="mobile-feature-item">
                  <span class="mobile-feature-name">{{ 'PRICING.COMPARISON.APPLIANCE_INTERIOR' | transloco }}</span>
                  <span class="mobile-feature-value">✅</span>
                </div>
                <div class="mobile-feature-item">
                  <span class="mobile-feature-name">{{ 'PRICING.COMPARISON.SATISFACTION_GUARANTEE' | transloco }}</span>
                  <span class="mobile-feature-value">✅</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section #calculatorSection class="calculator-section section">
      <div class="container">
        <div class="calculator-content">
          <div class="calculator-text fade-in-left" [class.visible]="isCalculatorVisible">
            <h2 class="stagger-1">{{ 'PRICING.CALCULATOR.TITLE' | transloco }}</h2>
            <p class="stagger-2">{{ 'PRICING.CALCULATOR.SUBTITLE' | transloco }}</p>
            <div class="calculator-features">
              <div class="calc-feature stagger-3">
                <span class="calc-icon">📏</span>
                <span>{{ 'PRICING.CALCULATOR.FEATURE_1' | transloco }}</span>
              </div>
              <div class="calc-feature stagger-4">
                <span class="calc-icon">🏠</span>
                <span>{{ 'PRICING.CALCULATOR.FEATURE_2' | transloco }}</span>
              </div>
              <div class="calc-feature stagger-5">
                <span class="calc-icon">🔄</span>
                <span>{{ 'PRICING.CALCULATOR.FEATURE_3' | transloco }}</span>
              </div>
              <div class="calc-feature stagger-6">
                <span class="calc-icon">⚡</span>
                <span>{{ 'PRICING.CALCULATOR.FEATURE_4' | transloco }}</span>
              </div>
            </div>
            <a routerLink="/booking" class="btn btn-primary btn-lg stagger-7">
              {{ 'PRICING.CALCULATOR.BUTTON' | transloco }}
            </a>
          </div>
          <div class="calculator-image fade-in-right" [class.visible]="isCalculatorVisible">
            <img src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&h=400&fit=crop&auto=format&q=80"
                 alt="Calculateur de prix" class="img-cover stagger-3">
          </div>
        </div>
      </div>
    </section>

    <section #guaranteeSection class="guarantee section">
      <div class="container">
        <div class="section-header text-center fade-in-up" [class.visible]="isGuaranteeVisible">
          <h2 class="section-title stagger-1">{{ 'PRICING.GUARANTEE.TITLE' | transloco }}</h2>
          <p class="section-subtitle stagger-2">{{ 'PRICING.GUARANTEE.SUBTITLE' | transloco }}</p>
        </div>

        <div class="guarantee-grid">
          <div class="guarantee-card card scale-in stagger-3" [class.visible]="isGuaranteeVisible">
            <div class="guarantee-icon">💰</div>
            <h3>{{ 'PRICING.GUARANTEE.TRANSPARENT.TITLE' | transloco }}</h3>
            <p>{{ 'PRICING.GUARANTEE.TRANSPARENT.DESCRIPTION' | transloco }}</p>
          </div>

          <div class="guarantee-card card card-highlight scale-in stagger-4" [class.visible]="isGuaranteeVisible">
            <div class="guarantee-icon">🛡️</div>
            <h3>{{ 'PRICING.GUARANTEE.SATISFACTION.TITLE' | transloco }}</h3>
            <p>{{ 'PRICING.GUARANTEE.SATISFACTION.DESCRIPTION' | transloco }}</p>
          </div>

          <div class="guarantee-card card scale-in stagger-5" [class.visible]="isGuaranteeVisible">
            <div class="guarantee-icon">🏆</div>
            <h3>{{ 'PRICING.GUARANTEE.BEST_PRICE.TITLE' | transloco }}</h3>
            <p>{{ 'PRICING.GUARANTEE.BEST_PRICE.DESCRIPTION' | transloco }}</p>
          </div>
        </div>
      </div>
    </section>

    <section #faqPricingSection class="faq-pricing section">
      <div class="container">
        <div class="section-header text-center fade-in-up" [class.visible]="isFaqPricingVisible">
          <h2 class="section-title stagger-1">{{ 'PRICING.FAQ.TITLE' | transloco }}</h2>
        </div>

        <div class="faq-grid">
          <div class="faq-item card slide-up stagger-2" [class.visible]="isFaqPricingVisible">
            <h4>{{ 'PRICING.FAQ.PAYMENT_METHODS.QUESTION' | transloco }}</h4>
            <p>{{ 'PRICING.FAQ.PAYMENT_METHODS.ANSWER' | transloco }}</p>
          </div>

          <div class="faq-item card slide-up stagger-3" [class.visible]="isFaqPricingVisible">
            <h4>{{ 'PRICING.FAQ.ADVANCE_PAYMENT.QUESTION' | transloco }}</h4>
            <p>{{ 'PRICING.FAQ.ADVANCE_PAYMENT.ANSWER' | transloco }}</p>
          </div>

          <div class="faq-item card slide-up stagger-4" [class.visible]="isFaqPricingVisible">
            <h4>{{ 'PRICING.FAQ.EXTRA_FEES.QUESTION' | transloco }}</h4>
            <p>{{ 'PRICING.FAQ.EXTRA_FEES.ANSWER' | transloco }}</p>
          </div>

          <div class="faq-item card slide-up stagger-5" [class.visible]="isFaqPricingVisible">
            <h4>{{ 'PRICING.FAQ.MODIFY_BOOKING.QUESTION' | transloco }}</h4>
            <p>{{ 'PRICING.FAQ.MODIFY_BOOKING.ANSWER' | transloco }}</p>
          </div>

          <div class="faq-item card slide-up stagger-6" [class.visible]="isFaqPricingVisible">
            <h4>{{ 'PRICING.FAQ.LOCATION_PRICING.QUESTION' | transloco }}</h4>
            <p>{{ 'PRICING.FAQ.LOCATION_PRICING.ANSWER' | transloco }}</p>
          </div>

          <div class="faq-item card slide-up stagger-7" [class.visible]="isFaqPricingVisible">
            <h4>{{ 'PRICING.FAQ.CUSTOM_QUOTE.QUESTION' | transloco }}</h4>
            <p>{{ 'PRICING.FAQ.CUSTOM_QUOTE.ANSWER' | transloco }}</p>
          </div>
        </div>
      </div>
    </section>

    <section #ctaSection class="final-cta section">
      <div class="container">
        <div class="cta-content text-center fade-in-up" [class.visible]="isCtaVisible">
          <h2 class="stagger-1">{{ 'PRICING.CTA.TITLE' | transloco }}</h2>
          <p class="stagger-2">{{ 'PRICING.CTA.SUBTITLE' | transloco }}</p>
          <div class="cta-actions">
            <a routerLink="/booking" class="btn-apple primary large stagger-3">
              {{ 'PRICING.CTA.BOOK_NOW' | transloco }}
            </a>
            <a routerLink="/contact" class="btn-apple secondary large stagger-4">
              {{ 'PRICING.CTA.GET_QUOTE' | transloco }}
            </a>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    /* Hero Section - Apple Style */
    .hero-section {
      background: var(--pure-white);
      color: var(--neutral-dark);
      padding: 120px 0 80px;
      text-align: center;
    }

    .hero-content h1 {
      font-size: clamp(3.5rem, 8vw, 6rem);
      margin-bottom: 20px;
      color: var(--neutral-dark);
      font-weight: 700;
      letter-spacing: -0.04em;
      line-height: 1.05;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    .hero-content p {
      font-size: clamp(1.3rem, 3vw, 1.8rem);
      color: #86868b;
      max-width: 600px;
      margin: 0 auto;
      line-height: 1.3;
      font-weight: 400;
      letter-spacing: -0.01em;
    }

    /* Carousel Services - Modern Design */
    .services-showcase {
      background: var(--pure-white);
      padding: var(--space-5xl) 0;
    }

    .section-header {
      margin-bottom: var(--space-4xl);
    }

    .section-subtitle {
      color: var(--neutral-medium);
      font-size: 1.2rem;
      max-width: 600px;
      margin: 0 auto;
    }

    .carousel-container {
      position: relative;
      max-width: 800px;
      margin: 0 auto;
    }

    .carousel-wrapper {
      overflow: hidden;
      border-radius: var(--radius-2xl);
      position: relative;
    }

    .carousel-track {
      display: flex;
      transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .carousel-slide {
      min-width: 100%;
      display: flex;
      justify-content: center;
    }

    .service-card {
      background: var(--pure-white);
      border-radius: var(--radius-2xl);
      padding: var(--space-3xl);
      box-shadow: var(--shadow-large);
      border: 1px solid rgba(107, 144, 128, 0.1);
      text-align: center;
      max-width: 600px;
      width: 100%;
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .service-card:hover {
      transform: translateY(-8px);
      box-shadow: var(--shadow-xl);
      border-color: var(--primary);
    }

    .service-header {
      margin-bottom: var(--space-2xl);
    }

    .service-icon {
      font-size: 4rem;
      margin-bottom: var(--space-lg);
      display: block;
    }

    .service-name {
      font-size: 2rem;
      font-weight: var(--font-weight-bold);
      color: var(--neutral-dark);
      margin-bottom: var(--space-sm);
      line-height: 1.2;
    }

    .service-description {
      color: var(--neutral-medium);
      font-size: 1.1rem;
      margin-bottom: var(--space-lg);
      line-height: 1.4;
    }

    .service-price {
      margin-bottom: var(--space-2xl);
      padding: var(--space-lg);
      background: var(--secondary);
      border-radius: var(--radius-lg);
      display: inline-block;
    }

    .price-value {
      font-size: 2.5rem;
      font-weight: var(--font-weight-bold);
      color: var(--primary);
      display: block;
    }

    .price-note {
      font-size: 0.9rem;
      color: var(--neutral-medium);
      margin-top: var(--space-xs);
    }

    .service-features {
      margin-bottom: var(--space-2xl);
    }

    .feature-list {
      list-style: none;
      text-align: left;
      max-width: 400px;
      margin: 0 auto;
    }

    .feature-list li {
      padding: var(--space-sm) 0;
      color: var(--neutral-medium);
      position: relative;
      padding-left: var(--space-lg);
      font-size: 0.95rem;
      line-height: 1.4;
    }

    .feature-list li:before {
      content: '✓';
      color: var(--primary);
      position: absolute;
      left: 0;
      font-weight: var(--font-weight-bold);
    }

    .service-actions {
      display: flex;
      gap: var(--space-lg);
      justify-content: center;
      flex-wrap: wrap;
    }

    /* Apple-style Buttons */
    .btn-apple {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 12px 24px;
      border-radius: var(--radius-full);
      font-size: 17px;
      font-weight: 400;
      text-decoration: none;
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      min-width: 120px;
      text-align: center;
      letter-spacing: -0.022em;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    .btn-apple.primary {
      background: var(--primary-green);
      color: var(--pure-white);
      border: none;
    }

    .btn-apple.primary:hover {
      background: var(--secondary-green);
      transform: translateY(-1px);
      box-shadow: 0 4px 20px rgba(76, 175, 80, 0.3);
    }

    .btn-apple.secondary {
      background: transparent;
      color: var(--primary-green);
      border: 1px solid var(--primary-green);
    }

    .btn-apple.secondary:hover {
      background: var(--primary-green);
      color: var(--pure-white);
      transform: translateY(-1px);
      box-shadow: 0 4px 16px rgba(76, 175, 80, 0.25);
    }

    .btn-apple.large {
      padding: 16px 32px;
      font-size: 19px;
      border-radius: var(--radius-full);
      min-width: 160px;
    }

    /* Carousel Navigation */
    .carousel-btn {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      background: var(--pure-white);
      border: 2px solid var(--primary);
      border-radius: 50%;
      width: 50px;
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      box-shadow: var(--shadow-medium);
      z-index: 10;
    }

    .carousel-btn:hover:not(:disabled) {
      background: var(--primary);
      color: var(--pure-white);
      transform: translateY(-50%) scale(1.1);
      box-shadow: var(--shadow-large);
    }

    .carousel-btn:disabled {
      opacity: 0.3;
      cursor: not-allowed;
      border-color: var(--neutral-light);
    }

    .carousel-btn.prev {
      left: -80px;
    }

    .carousel-btn.next {
      right: -80px;
    }

    .carousel-btn span {
      font-size: 1.5rem;
      font-weight: var(--font-weight-bold);
      color: var(--primary);
      transition: color 0.3s ease;
    }

    .carousel-btn:hover:not(:disabled) span {
      color: var(--pure-white);
    }

    .carousel-dots {
      display: flex;
      justify-content: center;
      gap: var(--space-sm);
      margin-top: var(--space-2xl);
    }

    .dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: var(--neutral-light);
      border: none;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .dot.active {
      background: var(--primary);
      transform: scale(1.2);
    }

    .dot:hover {
      background: var(--primary);
      transform: scale(1.1);
    }

    /* Factors Grid */
    .pricing-factors {
      background: var(--pure-white);
    }

    .factors-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: var(--space-2xl);
    }

    .factor-card {
      text-align: center;
      padding: var(--space-xl);
      background: var(--pure-white);
      border: 1px solid rgba(212, 165, 116, 0.1);
      border-radius: var(--radius-lg);
      transition: all var(--transition-base);
    }

    .factor-card:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-medium);
      border-color: var(--primary);
    }

    .factor-card h3 {
      color: var(--neutral-dark);
      margin-bottom: var(--space-sm);
      font-size: 1.25rem;
    }

    .factor-icon {
      font-size: 3.5rem;
      margin-bottom: var(--space-lg);
      display: block;
    }

    .factor-description {
      color: var(--neutral-medium);
      margin-bottom: var(--space-lg);
      line-height: 1.5;
    }

    .factor-list {
      list-style: none;
      text-align: left;
    }

    .factor-list li {
      padding: var(--space-xs) 0;
      color: var(--neutral-medium);
      position: relative;
      padding-left: var(--space-lg);
      font-size: 0.95rem;
    }

    .factor-list li:before {
      content: '•';
      color: var(--primary);
      position: absolute;
      left: 0;
      font-weight: var(--font-weight-bold);
    }

    /* Comparison Table */
    .table-container {
      overflow-x: auto;
      background: var(--pure-white);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-medium);
      border: 1px solid rgba(212, 165, 116, 0.1);
    }

    /* Hide mobile cards on desktop */
    .mobile-comparison-cards {
      display: none;
    }

    .comparison-table-grid {
      width: 100%;
      border-collapse: collapse;
      min-width: 700px;
    }

    .comparison-table-grid th,
    .comparison-table-grid td {
      padding: var(--space-md) var(--space-lg);
      text-align: center;
      border-bottom: 1px solid rgba(212, 165, 116, 0.2);
    }

    .comparison-table-grid th {
      background: var(--primary);
      color: var(--pure-white);
      font-weight: var(--font-weight-semibold);
      font-size: 0.95rem;
    }

    .feature-name {
      text-align: left !important;
      font-weight: var(--font-weight-medium);
      color: var(--neutral-dark);
    }

    .feature-check {
      color: var(--success);
      font-size: 1.3rem;
    }

    .feature-cross {
      color: var(--error);
      font-size: 1.3rem;
    }

    /* Calculator Section */
    .calculator-section {
      background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
      color: var(--pure-white);
    }

    .calculator-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--space-4xl);
      align-items: center;
    }

    .calculator-text h2 {
      color: var(--pure-white);
      margin-bottom: var(--space-lg);
      font-size: clamp(1.8rem, 3vw, 2.5rem);
    }

    .calculator-text > p {
      color: rgba(255, 255, 255, 0.95);
      font-size: 1.1rem;
      margin-bottom: var(--space-xl);
      line-height: 1.6;
    }

    .calculator-features {
      display: grid;
      gap: var(--space-md);
      margin-bottom: var(--space-2xl);
    }

    .calc-feature {
      display: flex;
      align-items: center;
      gap: var(--space-sm);
      color: rgba(255, 255, 255, 0.9);
      font-size: 0.95rem;
    }

    .calc-icon {
      font-size: 1.3rem;
      flex-shrink: 0;
    }

    .calculator-image {
      border-radius: var(--radius-lg);
      overflow: hidden;
      box-shadow: var(--shadow-large);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .calculator-image img {
      transition: transform var(--transition-slow);
    }

    .calculator-image:hover img {
      transform: scale(1.02);
    }

    /* Guarantee Section */
    .guarantee-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: var(--space-2xl);
    }

    .guarantee-card {
      text-align: center;
      padding: var(--space-2xl);
      background: var(--pure-white);
      border: 1px solid rgba(212, 165, 116, 0.1);
      border-radius: var(--radius-lg);
      transition: all var(--transition-base);
    }

    .guarantee-card:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-medium);
      border-color: var(--primary);
    }

    .guarantee-card.card-highlight {
      border: 2px solid var(--accent);
      background: var(--secondary);
      transform: scale(1.02);
    }

    .guarantee-card h3 {
      color: var(--neutral-dark);
      margin-bottom: var(--space-sm);
      font-size: 1.25rem;
    }

    .guarantee-card p {
      color: var(--neutral-medium);
      line-height: 1.5;
    }

    .guarantee-icon {
      font-size: 3.5rem;
      margin-bottom: var(--space-lg);
      display: block;
    }

    /* FAQ Section */
    .faq-pricing {
      background: var(--neutral-lightest);
    }

    .faq-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
      gap: var(--space-lg);
    }

    .faq-item {
      padding: var(--space-lg);
      background: var(--pure-white);
      border: 1px solid rgba(212, 165, 116, 0.1);
      border-radius: var(--radius-lg);
      transition: all var(--transition-base);
    }

    .faq-item:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-soft);
      border-color: var(--primary);
    }

    .faq-item h4 {
      margin-bottom: var(--space-sm);
      color: var(--neutral-dark);
      font-size: 1.125rem;
    }

    .faq-item p {
      margin: 0;
      color: var(--neutral-medium);
      line-height: 1.6;
      font-size: 0.95rem;
    }

    /* Final CTA - Apple Style */
    .final-cta {
      background: var(--pure-white);
      padding: 120px 0;
      text-align: center;
    }

    .cta-content h2 {
      font-size: clamp(2.5rem, 6vw, 4rem);
      font-weight: 700;
      color: var(--neutral-dark);
      margin-bottom: 20px;
      letter-spacing: -0.03em;
      line-height: 1.1;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    .cta-content p {
      font-size: clamp(1.1rem, 2.5vw, 1.3rem);
      color: #86868b;
      margin-bottom: 40px;
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
      line-height: 1.4;
      font-weight: 400;
    }

    .cta-actions {
      display: flex;
      gap: 20px;
      justify-content: center;
      flex-wrap: wrap;
    }

    /* Mobile Responsive */
    @media (max-width: 1024px) {
      .carousel-container {
        max-width: 700px;
      }

      .carousel-btn.prev {
        left: -60px;
      }

      .carousel-btn.next {
        right: -60px;
      }

      .service-card {
        padding: var(--space-2xl);
      }

      .service-name {
        font-size: 1.8rem;
      }

      .price-value {
        font-size: 2.2rem;
      }

      /* Table - Make scrollable on tablet */
      .table-container {
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
      }

      .comparison-table-grid {
        min-width: 650px;
      }

      .comparison-table-grid th,
      .comparison-table-grid td {
        padding: var(--space-sm) var(--space-md);
        font-size: 0.9rem;
      }
    }

    @media (max-width: 768px) {
      /* Hide traditional table on mobile */
      .comparison-table-grid {
        display: none;
      }

      .table-container {
        background: transparent;
        box-shadow: none;
        border: none;
        padding: 0;
      }

      /* Mobile Card-Based Comparison */
      .mobile-comparison-cards {
        display: flex;
        flex-direction: column;
        gap: var(--space-xl);
        width: 100%;
      }

      .mobile-plan-card {
        background: var(--pure-white);
        border-radius: 1.5rem;
        padding: var(--space-xl);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      .mobile-plan-title {
        font-size: 1.5rem;
        font-weight: 700;
        color: var(--primary-green);
        margin-bottom: var(--space-lg);
        text-align: center;
        width: 100%;
      }

      .mobile-feature-list {
        display: flex;
        flex-direction: column;
        gap: var(--space-md);
        width: 100%;
      }

      .mobile-feature-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: var(--space-md);
        background: var(--soft-green);
        border-radius: 0.75rem;
        width: 100%;
      }

      .mobile-feature-name {
        font-size: 0.95rem;
        color: var(--text-dark);
        font-weight: 500;
        flex: 1;
      }

      .mobile-feature-value {
        font-size: 1.25rem;
        margin-left: var(--space-md);
        flex-shrink: 0;
      }
      .hero-section {
        padding: 80px 0 60px;
      }

      .carousel-container {
        max-width: 100%;
        margin: 0 var(--space-lg);
      }

      .carousel-btn {
        width: 40px;
        height: 40px;
        font-size: 1.2rem;
      }

      .carousel-btn.prev {
        left: -50px;
      }

      .carousel-btn.next {
        right: -50px;
      }

      .service-card {
        padding: var(--space-xl);
      }

      .service-name {
        font-size: 1.6rem;
      }

      .service-description {
        font-size: 1rem;
      }

      .price-value {
        font-size: 2rem;
      }

      .service-actions {
        flex-direction: column;
        align-items: center;
      }

      .btn-apple {
        width: 100%;
        max-width: 280px;
      }

      .cta-actions {
        flex-direction: column;
        align-items: center;
      }

      .final-cta {
        padding: 80px 0;
      }
    }

    @media (max-width: 640px) {
      .carousel-container {
        margin: 0 var(--space-md);
      }

      .carousel-btn.prev {
        left: -40px;
      }

      .carousel-btn.next {
        right: -40px;
      }

      .service-card {
        padding: var(--space-lg);
      }

      .service-icon {
        font-size: 3rem;
      }

      .service-name {
        font-size: 1.4rem;
      }

      .price-value {
        font-size: 1.8rem;
      }

      .feature-list {
        max-width: 300px;
      }

      .feature-list li {
        font-size: 0.9rem;
      }
    }

    @media (max-width: 480px) {
      .carousel-btn {
        display: none;
      }

      .carousel-container {
        margin: 0;
      }

      .service-card {
        margin: 0 var(--space-sm);
        padding: var(--space-lg);
      }

      .service-actions {
        gap: var(--space-sm);
      }

      .btn-apple {
        padding: var(--space-md) var(--space-lg);
        font-size: 0.9rem;
      }

      .carousel-dots {
        margin-top: var(--space-xl);
      }

      .dot {
        width: 10px;
        height: 10px;
      }
    }
  `]
})
export class PricingComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('heroSection') heroSection!: ElementRef;
  @ViewChild('pricingPlansSection') pricingPlansSection!: ElementRef;
  @ViewChild('pricingFactorsSection') pricingFactorsSection!: ElementRef;
  @ViewChild('comparisonTableSection') comparisonTableSection!: ElementRef;
  @ViewChild('calculatorSection') calculatorSection!: ElementRef;
  @ViewChild('guaranteeSection') guaranteeSection!: ElementRef;
  @ViewChild('faqPricingSection') faqPricingSection!: ElementRef;
  @ViewChild('ctaSection') ctaSection!: ElementRef;

  isHeroVisible = false;
  arePricingPlansVisible = false;
  arePricingFactorsVisible = false;
  isComparisonTableVisible = false;
  isCalculatorVisible = false;
  isGuaranteeVisible = false;
  isFaqPricingVisible = false;
  isCtaVisible = false;
  expandedFeatures: boolean[] = [];
  currentSlide = 0;
  pricingPlans: PricingPlan[] = [
    {
      id: 'residential',
      price: 120,
      icon: '🏠',
      popular: true
    },
    {
      id: 'commercial',
      price: 200,
      icon: '🏢'
    },
    {
      id: 'postconstruction',
      price: 350,
      icon: '🔨'
    },
    {
      id: 'deepcleaning',
      price: 280,
      icon: '✨'
    }
  ];

  pricingFactors: PricingFactor[] = [
    {
      name: 'area',
      description: '',
      icon: '📏',
      factors: []
    },
    {
      name: 'property_type',
      description: '',
      icon: '🏠',
      factors: []
    },
    {
      name: 'frequency',
      description: '',
      icon: '🔄',
      factors: []
    },
    {
      name: 'additional_services',
      description: '',
      icon: '➕',
      factors: []
    }
  ];

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private scrollAnimationService: ScrollAnimationService,
    private transloco: TranslocoService
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      // Initialize hero visibility immediately
      setTimeout(() => {
        this.isHeroVisible = true;
      }, 100);

      // Initialize expanded features array
      this.expandedFeatures = new Array(this.pricingPlans.length).fill(false);
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
        element: this.pricingPlansSection.nativeElement,
        callback: () => { this.arePricingPlansVisible = true; }
      },
      {
        element: this.pricingFactorsSection.nativeElement,
        callback: () => { this.arePricingFactorsVisible = true; }
      },
      {
        element: this.comparisonTableSection.nativeElement,
        callback: () => { this.isComparisonTableVisible = true; }
      },
      {
        element: this.calculatorSection.nativeElement,
        callback: () => { this.isCalculatorVisible = true; }
      },
      {
        element: this.guaranteeSection.nativeElement,
        callback: () => { this.isGuaranteeVisible = true; }
      },
      {
        element: this.faqPricingSection.nativeElement,
        callback: () => { this.isFaqPricingVisible = true; }
      },
      {
        element: this.ctaSection.nativeElement,
        callback: () => { this.isCtaVisible = true; }
      }
    ];

    this.scrollAnimationService.initializeAnimations(elements);
  }

  toggleFeatures(index: number) {
    this.expandedFeatures[index] = !this.expandedFeatures[index];
  }

  getMaxDiscount(discounts: any[]): number {
    return Math.max(...discounts.map(d => d.discount));
  }

  nextSlide() {
    if (this.currentSlide < this.pricingPlans.length - 1) {
      this.currentSlide++;
    }
  }

  previousSlide() {
    if (this.currentSlide > 0) {
      this.currentSlide--;
    }
  }

  goToSlide(index: number) {
    this.currentSlide = index;
  }

  // Translation methods
  getPlanName(planId: string): string {
    return this.transloco.translate(`PRICING.PLANS.${planId.toUpperCase()}.NAME`);
  }

  getPlanDescription(planId: string): string {
    return this.transloco.translate(`PRICING.PLANS.${planId.toUpperCase()}.DESCRIPTION`);
  }

  getPlanFeatures(planId: string): string[] {
    const features = this.transloco.translate(`PRICING.PLANS.${planId.toUpperCase()}.FEATURES`);
    return Array.isArray(features) ? features : [];
  }

  getFactorName(factorId: string): string {
    return this.transloco.translate(`PRICING.FACTORS.${factorId.toUpperCase()}.NAME`);
  }

  getFactorDescription(factorId: string): string {
    return this.transloco.translate(`PRICING.FACTORS.${factorId.toUpperCase()}.DESCRIPTION`);
  }

  getFactorItems(factorId: string): string[] {
    const items = this.transloco.translate(`PRICING.FACTORS.${factorId.toUpperCase()}.ITEMS`);
    return Array.isArray(items) ? items : [];
  }
}