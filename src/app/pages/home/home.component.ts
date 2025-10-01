import { Component, OnInit, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { MagneticButtonDirective } from '../../directives/magnetic-button.directive';
import { AppleAnimationsService } from '../../services/apple-animations.service';

interface Testimonial {
  name: string;
  location: string;
  rating: number;
  comment: string;
  service: string;
}

interface Stat {
  number: string;
  label: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslocoPipe, MagneticButtonDirective],
  template: `
    <!-- Apple Store Hero Section -->
    <section class="scroll-section hero-section wave-border-bottom-only" data-reveal>
      <div class="container">
        <div class="showcase-grid">
          <div class="showcase-content" data-magnetic>
            <div class="hero-badge">{{ 'HOME.HERO.BADGE' | transloco }}</div>
            <h1 class="hero-title">
              {{ 'HOME.HERO.TITLE' | transloco }}<br>
              <span class="accent-text">{{ 'HOME.HERO.TITLE_ACCENT' | transloco }}</span>
            </h1>
            <p class="hero-subtitle">
              {{ 'HOME.HERO.SUBTITLE' | transloco }}
            </p>
            <div class="hero-actions">
              <a routerLink="/booking" class="btn btn-primary btn-lg" magneticButton>
                {{ 'HOME.HERO.CTA_BUTTON' | transloco }}
              </a>
            </div>
          </div>
          <div class="showcase-media" data-showcase="0.3">
            <div class="parallax-container">
              <img src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&h=600&fit=crop&auto=format&q=80"
                   [alt]="'HOME.ALT_TEXTS.HERO_IMAGE' | transloco"
                   class="showcase-image progressive-img parallax-bg"
                   data-speed="-0.5">
              <div class="parallax-overlay" data-speed="0.3"></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Apple Store Product Showcase -->
    <section class="scroll-section apple-showcase wave-border-both" data-reveal>
      <div class="container">
        <div class="showcase-grid">
          <div class="showcase-media" data-showcase="0.2">
            <div class="parallax-container">
              <img src="https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=800&h=600&fit=crop&auto=format&q=80"
                   [alt]="'HOME.ALT_TEXTS.PRODUCTS_IMAGE' | transloco"
                   class="showcase-image progressive-img parallax-bg"
                   data-speed="-0.3">
              <div class="parallax-float" data-speed="0.8">
                <div class="float-badge">{{ 'HOME.PRODUCTS.BADGE' | transloco }}</div>
              </div>
            </div>
          </div>
          <div class="showcase-content">
            <h2>{{ 'HOME.PRODUCTS.TITLE' | transloco }}<br><span class="accent-text">{{ 'HOME.PRODUCTS.TITLE_ACCENT' | transloco }}</span></h2>
            <p>
              {{ 'HOME.PRODUCTS.DESCRIPTION' | transloco }}
            </p>
            <div class="feature-points">
              <div class="point">{{ 'HOME.PRODUCTS.FEATURES.CERT' | transloco }}</div>
              <div class="point">{{ 'HOME.PRODUCTS.FEATURES.FORMULA' | transloco }}</div>
              <div class="point">{{ 'HOME.PRODUCTS.FEATURES.ZERO_RESIDUE' | transloco }}</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Layered Service Reveals -->
    <section class="scroll-section layered-reveal wave-border-both" data-reveal>
      <div class="container">
        <div class="reveal-layer">
          <h2 class="section-title text-center" data-magnetic>{{ 'HOME.SERVICES.TITLE' | transloco }}</h2>
        </div>

        <div class="product-showcase">
          <div class="reveal-layer">
            <div class="product-card" data-showcase="0.1">
              <div class="product-media">
                <img src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop&auto=format&q=80"
                     [alt]="'HOME.ALT_TEXTS.RESIDENTIAL_IMAGE' | transloco" class="progressive-img">
              </div>
              <div class="product-info">
                <h3>{{ 'HOME.SERVICES.RESIDENTIAL.TITLE' | transloco }}</h3>
                <p>{{ 'HOME.SERVICES.RESIDENTIAL.DESCRIPTION' | transloco }}</p>
                <div class="product-features">
                  <span class="feature">{{ 'HOME.SERVICES.RESIDENTIAL.FEATURES.HYPOALLERGENIC' | transloco }}</span>
                  <span class="feature">{{ 'HOME.SERVICES.RESIDENTIAL.FEATURES.FLEXIBLE' | transloco }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="reveal-layer">
            <div class="product-card" data-showcase="0.2">
              <div class="product-media">
                <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop&auto=format&q=80"
                     [alt]="'HOME.ALT_TEXTS.COMMERCIAL_IMAGE' | transloco" class="progressive-img">
              </div>
              <div class="product-info">
                <h3>{{ 'HOME.SERVICES.COMMERCIAL.TITLE' | transloco }}</h3>
                <p>{{ 'HOME.SERVICES.COMMERCIAL.DESCRIPTION' | transloco }}</p>
                <div class="product-features">
                  <span class="feature">{{ 'HOME.SERVICES.COMMERCIAL.FEATURES.FLEXIBLE_HOURS' | transloco }}</span>
                  <span class="feature">{{ 'HOME.SERVICES.COMMERCIAL.FEATURES.ADAPTED_PROTOCOLS' | transloco }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Apple Store Interactive Experience -->
    <section class="scroll-section apple-showcase wave-border-both" data-reveal>
      <div class="container">
        <div class="showcase-grid">
          <div class="showcase-content">
            <h2>{{ 'HOME.EXPERIENCE.TITLE' | transloco }}<br><span class="accent-text">{{ 'HOME.EXPERIENCE.TITLE_ACCENT' | transloco }}</span></h2>
            <p>
              {{ 'HOME.EXPERIENCE.DESCRIPTION' | transloco }}
            </p>
            <div class="experience-stats">
              <div class="stat-row">
                <div class="stat-item magnetic">
                  <div class="stat-number">500+</div>
                  <div class="stat-label">{{ 'HOME.EXPERIENCE.STATS.CLIENTS' | transloco }}</div>
                </div>
                <div class="stat-item magnetic">
                  <div class="stat-number">100%</div>
                  <div class="stat-label">{{ 'HOME.EXPERIENCE.STATS.ECO' | transloco }}</div>
                </div>
              </div>
              <div class="stat-row">
                <div class="stat-item magnetic">
                  <div class="stat-number">5 ans</div>
                  <div class="stat-label">{{ 'HOME.EXPERIENCE.STATS.EXPERTISE' | transloco }}</div>
                </div>
                <div class="stat-item magnetic">
                  <div class="stat-number">24h</div>
                  <div class="stat-label">{{ 'HOME.EXPERIENCE.STATS.REACTIVITY' | transloco }}</div>
                </div>
              </div>
            </div>
          </div>
          <div class="showcase-media" data-showcase="0.4">
            <div class="testimonial-card magnetic">
              <p class="testimonial-text">
                "{{ 'HOME.EXPERIENCE.TESTIMONIAL.TEXT' | transloco }}"
              </p>
              <div class="testimonial-author">
                <strong>{{ 'HOME.EXPERIENCE.TESTIMONIAL.AUTHOR_NAME' | transloco }}</strong>
                <span>{{ 'HOME.EXPERIENCE.TESTIMONIAL.AUTHOR_TITLE' | transloco }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Final CTA with Wave Border -->
    <section class="scroll-section cta-section wave-border-both" data-reveal>
      <div class="container">
        <div class="showcase-grid">
          <div class="showcase-content text-center">
            <h2 class="cta-title" data-magnetic>{{ 'HOME.CTA.TITLE' | transloco }}</h2>
            <p class="cta-subtitle">
              {{ 'HOME.CTA.SUBTITLE' | transloco }}
            </p>
            <div class="cta-actions">
              <a routerLink="/contact" class="btn btn-primary btn-lg magnetic" magneticButton>
                {{ 'HOME.CTA.GET_QUOTE' | transloco }}
              </a>
              <a routerLink="/services" class="btn btn-secondary btn-lg magnetic">
                {{ 'HOME.CTA.DISCOVER_SERVICES' | transloco }}
              </a>
            </div>
          </div>
          <div class="showcase-media" data-showcase="0.1">
            <div class="cta-visual">
              <div class="floating-elements">
                <div class="element eco-badge">{{ 'HOME.CTA.FLOATING_BADGES.ECO' | transloco }}</div>
                <div class="element service-badge">{{ 'HOME.CTA.FLOATING_BADGES.SERVICE' | transloco }}</div>
                <div class="element local-badge">{{ 'HOME.CTA.FLOATING_BADGES.LOCAL' | transloco }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    /* Apple Store Inspired Design */
    :host {
      --viridian: #6b9080;
      --cambridge-blue: #a4c3b2;
      --mint-green: #cce3de;
      --azure-web: #eaf4f4;
      --mint-cream: #f6fff8;

      --apple-ease: cubic-bezier(0.16, 1, 0.3, 1);
      --apple-spring: cubic-bezier(0.175, 0.885, 0.32, 1.275);

      display: block;
      min-height: 100vh;
    }

    /* Apple Store Hero Section */
    .hero-section {
      position: relative;
      overflow: hidden;
      padding: var(--space-5xl) 0;
    }

    .hero-section::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: radial-gradient(circle at 20% 80%, rgba(107, 144, 128, 0.1) 0%, transparent 70%);
      pointer-events: none;
    }

    .hero-badge {
      display: inline-block;
      padding: 0.75rem 1.5rem;
      background: rgba(107, 144, 128, 0.9);
      color: white;
      border-radius: 1rem;
      font-size: 0.875rem;
      font-weight: 600;
      margin-bottom: 2rem;
      backdrop-filter: blur(15px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      box-shadow: 0 8px 32px rgba(107, 144, 128, 0.2);
      letter-spacing: 0.025em;
    }

    /* True Parallax Scrolling */
    .parallax-container {
      position: relative;
      overflow: hidden;
      border-radius: 1.5rem;
      height: 400px;
    }

    .parallax-bg {
      position: absolute;
      top: -20%;
      left: -10%;
      width: 120%;
      height: 140%;
      object-fit: cover;
      will-change: transform;
      transition: transform 0.1s ease-out;
    }

    .parallax-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, rgba(107, 144, 128, 0.2) 0%, rgba(164, 195, 178, 0.1) 100%);
      will-change: transform;
      transition: transform 0.1s ease-out;
    }

    .parallax-float {
      position: absolute;
      top: 20px;
      right: 20px;
      will-change: transform;
      transition: transform 0.1s ease-out;
    }

    .float-badge {
      background: rgba(255, 255, 255, 0.95);
      color: var(--viridian);
      padding: 0.75rem 1.5rem;
      border-radius: 0.75rem;
      font-weight: 600;
      font-size: 0.875rem;
      backdrop-filter: blur(15px);
      box-shadow: 0 8px 30px rgba(107, 144, 128, 0.2);
      border: 1px solid rgba(107, 144, 128, 0.1);
    }

    .hero-title {
      margin-bottom: var(--space-xl);
      line-height: 1.1;
    }

    .accent-text {
      color: var(--viridian);
      font-weight: 700;
      position: relative;
    }

    .accent-text::after {
      content: '';
      position: absolute;
      bottom: 0.1em;
      left: 0;
      right: 0;
      height: 0.2em;
      background: linear-gradient(90deg, transparent 0%, var(--cambridge-blue) 50%, transparent 100%);
      opacity: 0.5;
      border-radius: 0.1em;
    }

    .hero-subtitle {
      font-size: 1.125rem;
      line-height: 1.7;
      margin-bottom: var(--space-3xl);
      max-width: 90%;
    }

    .hero-actions {
      display: flex;
      gap: var(--space-lg);
      flex-wrap: wrap;
    }

    .hero-visual {
      display: flex;
      justify-content: center;
    }

    .hero-image-wrapper {
      width: 100%;
      max-width: 520px;
      height: 420px;
      border-radius: 2rem;
      overflow: hidden;
      box-shadow: 0 20px 60px rgba(107, 144, 128, 0.25);
      will-change: transform;
      transition: transform 0.4s var(--apple-spring), box-shadow 0.4s var(--apple-spring);
      border: 2px solid rgba(255, 255, 255, 0.3);
      backdrop-filter: blur(10px);
      position: relative;
    }

    .hero-image-wrapper::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(45deg, rgba(107, 144, 128, 0.1) 0%, transparent 50%);
      pointer-events: none;
      z-index: 1;
    }

    .hero-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      will-change: transform;
      transition: transform 0.3s var(--apple-ease);
    }

    /* Elegant Stats */
    .stats-section {
      padding: var(--space-4xl) 0 0;
      border-top: 1px solid rgba(26, 26, 26, 0.08);
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: var(--space-3xl);
    }

    .stat-item {
      text-align: center;
    }

    .stat-number {
      font-size: 2.5rem;
      font-weight: var(--font-weight-bold);
      color: var(--primary);
      line-height: 1;
      margin-bottom: var(--space-sm);
    }

    .stat-label {
      color: var(--neutral-medium);
      font-weight: var(--font-weight-medium);
      font-size: 0.875rem;
      letter-spacing: 0.02em;
    }

    /* Values Section */
    .values-section {
      background: var(--mint-cream);
      position: relative;
    }

    .values-section::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: radial-gradient(circle at 70% 30%, rgba(164, 195, 178, 0.1) 0%, transparent 60%);
      pointer-events: none;
    }

    .section-header {
      text-align: center;
      margin-bottom: var(--space-4xl);
    }

    .section-title {
      margin-bottom: var(--space-lg);
    }

    .section-subtitle {
      font-size: 1.125rem;
      max-width: 700px;
      margin: 0 auto;
    }

    .value-card {
      text-align: center;
      padding: 2.5rem 2rem;
      will-change: transform;
      transition: all 0.4s var(--apple-spring);
      border-radius: 1.5rem;
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(107, 144, 128, 0.1);
      box-shadow: 0 8px 40px rgba(107, 144, 128, 0.12);
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    .value-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, var(--viridian) 0%, var(--cambridge-blue) 100%);
    }

    .value-card.featured {
      background: linear-gradient(135deg, var(--cambridge-blue) 0%, var(--mint-green) 100%);
      transform: scale(1.05);
      box-shadow: 0 16px 60px rgba(107, 144, 128, 0.25);
      border: 2px solid var(--viridian);
    }

    .value-card.featured::before {
      height: 6px;
      background: linear-gradient(90deg, var(--viridian) 0%, white 100%);
    }

    .value-icon {
      font-size: 3rem;
      margin-bottom: var(--space-xl);
      display: block;
    }

    .value-card h3 {
      margin-bottom: var(--space-lg);
      font-size: 1.375rem;
    }

    .value-card p {
      line-height: 1.7;
    }

    /* Services Section */
    .services-section {
      background: linear-gradient(135deg, var(--azure-web) 0%, var(--mint-green) 100%);
      position: relative;
    }

    .services-section::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60"><circle cx="30" cy="30" r="2" fill="%23a4c3b2" opacity="0.1"/></svg>') repeat;
      opacity: 0.5;
    }

    .services-header {
      display: grid;
      grid-template-columns: 1fr auto;
      gap: var(--space-3xl);
      align-items: end;
      margin-bottom: var(--space-4xl);
    }

    .services-intro h2 {
      margin-bottom: var(--space-lg);
    }

    .services-intro p {
      font-size: 1.125rem;
      max-width: 500px;
    }

    .services-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: var(--space-2xl);
    }

    .service-item {
      background: rgba(255, 255, 255, 0.95);
      border-radius: 1.5rem;
      overflow: hidden;
      will-change: transform;
      transition: all 0.4s var(--apple-spring);
      box-shadow: 0 8px 30px rgba(107, 144, 128, 0.15);
      backdrop-filter: blur(15px);
      border: 1px solid rgba(107, 144, 128, 0.1);
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    .service-item:hover {
      transform: translateY(-12px) rotateY(2deg) scale(1.02);
      box-shadow: 0 20px 60px rgba(107, 144, 128, 0.25);
    }

    .service-image {
      height: 240px;
      overflow: hidden;
      position: relative;
    }

    .service-image img {
      will-change: transform;
      transition: transform 0.4s var(--apple-ease);
    }

    .service-content {
      padding: var(--space-xl);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
    }

    .service-content h3 {
      margin-bottom: var(--space-sm);
      font-size: 1.25rem;
      text-align: center;
    }

    .service-content p {
      font-size: 0.95rem;
      text-align: center;
    }

    /* Testimonials */
    .testimonials-section {
      background: linear-gradient(135deg, var(--mint-cream) 0%, white 100%);
      position: relative;
    }

    .testimonials-section::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: radial-gradient(ellipse at 20% 80%, rgba(107, 144, 128, 0.06) 0%, transparent 70%);
    }

    .testimonials-header {
      text-align: center;
      margin-bottom: var(--space-4xl);
    }

    .testimonials-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: var(--space-3xl);
    }

    .testimonial-item {
      text-align: center;
      will-change: transform;
      transition: all 0.4s var(--apple-spring);
      padding: 2.5rem;
      border-radius: 1.5rem;
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(107, 144, 128, 0.1);
      box-shadow: 0 8px 40px rgba(107, 144, 128, 0.12);
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    .testimonial-item::before {
      content: '"';
      position: absolute;
      top: 1rem;
      right: 1.5rem;
      font-size: 4rem;
      color: var(--cambridge-blue);
      opacity: 0.3;
      font-family: serif;
    }

    .testimonial-quote {
      font-size: 1.25rem;
      line-height: 1.6;
      font-style: italic;
      color: var(--neutral-dark);
      margin-bottom: var(--space-xl);
      position: relative;
    }

    .testimonial-quote::before {
      content: '"';
      font-size: 4rem;
      color: var(--accent);
      position: absolute;
      top: -20px;
      left: -30px;
      opacity: 0.3;
    }

    .author-name {
      font-weight: var(--font-weight-semibold);
      color: var(--neutral-dark);
      margin-bottom: var(--space-xs);
    }

    .author-location {
      font-size: 0.875rem;
      color: var(--neutral-medium);
    }

    /* CTA Section */
    .cta-section {
      background: linear-gradient(135deg, var(--viridian) 0%, var(--cambridge-blue) 100%);
      color: white;
      position: relative;
      overflow: hidden;
    }

    .cta-section::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: radial-gradient(circle at 70% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 60%);
      pointer-events: none;
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
      line-height: 1.7;
      margin-bottom: var(--space-3xl);
      color: rgba(255, 255, 255, 0.9);
    }

    .cta-actions {
      display: flex;
      gap: var(--space-lg);
      justify-content: center;
      flex-wrap: wrap;
    }

    .cta-section .btn-primary {
      background: rgba(255, 255, 255, 0.95);
      color: var(--viridian);
      will-change: transform;
      transition: all 0.4s var(--apple-spring);
      backdrop-filter: blur(15px);
      border: 2px solid rgba(255, 255, 255, 0.3);
    }

    .cta-section .btn-primary:hover {
      background: white;
      transform: translateY(-4px) scale(1.05);
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.2);
    }

    .cta-section .btn-secondary {
      background: transparent;
      color: white;
      border: 2px solid rgba(255, 255, 255, 0.5);
      will-change: transform;
      transition: all 0.4s var(--apple-spring);
      backdrop-filter: blur(10px);
    }

    .cta-section .btn-secondary:hover {
      background: rgba(255, 255, 255, 0.2);
      border-color: white;
      transform: translateY(-4px) scale(1.05);
    }

    /* Performance Enhancements */
    * {
      backface-visibility: hidden;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    .btn {
      will-change: transform;
      transform: translateZ(0);
      transition: all 0.3s var(--apple-spring);
    }

    /* Apple Store Specific Styles */
    .showcase-image {
      width: 100%;
      height: 400px;
      object-fit: cover;
      border-radius: 1.5rem;
      will-change: transform;
    }

    .feature-points {
      margin-top: var(--space-xl);
    }

    .point {
      display: block;
      margin-bottom: var(--space-sm);
      color: var(--viridian);
      font-weight: 500;
    }

    .experience-stats {
      margin-top: var(--space-2xl);
    }

    .stat-row {
      display: flex;
      gap: var(--space-xl);
      margin-bottom: var(--space-lg);
    }

    .testimonial-card {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      border-radius: 1.5rem;
      padding: var(--space-2xl);
      border: 1px solid rgba(107, 144, 128, 0.1);
      box-shadow: 0 12px 40px rgba(107, 144, 128, 0.15);
      cursor: pointer;
      transition: all 0.6s var(--apple-ease);
    }

    .testimonial-card:hover {
      transform: scale(1.02) rotateY(2deg);
      box-shadow: 0 20px 60px rgba(107, 144, 128, 0.25);
    }

    .testimonial-text {
      font-size: 1.125rem;
      line-height: 1.6;
      font-style: italic;
      color: var(--neutral-dark);
      margin-bottom: var(--space-lg);
    }

    .testimonial-author {
      text-align: left;
    }

    .testimonial-author strong {
      display: block;
      color: var(--viridian);
      margin-bottom: var(--space-xs);
    }

    .testimonial-author span {
      font-size: 0.875rem;
      color: var(--neutral-medium);
    }

    .product-features {
      margin-top: var(--space-lg);
      display: flex;
      gap: var(--space-sm);
      flex-wrap: wrap;
    }

    .feature {
      background: var(--cambridge-blue);
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 50px;
      font-size: 0.875rem;
      font-weight: 500;
    }

    .cta-visual {
      position: relative;
      height: 400px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .floating-elements {
      position: relative;
      width: 100%;
      height: 100%;
    }

    .element {
      position: absolute;
      padding: 1rem 2rem;
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(15px);
      border-radius: 50px;
      font-weight: 600;
      box-shadow: 0 8px 30px rgba(107, 144, 128, 0.15);
      will-change: transform;
      animation: float 6s ease-in-out infinite;
    }

    .eco-badge {
      top: 20%;
      left: 10%;
      background: var(--cambridge-blue);
      color: white;
      animation-delay: 0s;
    }

    .service-badge {
      top: 60%;
      right: 20%;
      background: var(--viridian);
      color: white;
      animation-delay: 2s;
    }

    .local-badge {
      bottom: 30%;
      left: 30%;
      background: var(--mint-green);
      color: var(--viridian);
      animation-delay: 4s;
    }

    @keyframes float {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      25% { transform: translateY(-20px) rotate(1deg); }
      50% { transform: translateY(-10px) rotate(-1deg); }
      75% { transform: translateY(-15px) rotate(0.5deg); }
    }

    /* Reduced Motion Support */
    @media (prefers-reduced-motion: reduce) {
      *,
      *::before,
      *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
      }

      .element {
        animation: none;
      }
    }

    /* Responsive Design */
    @media (max-width: 1024px) {
      .hero-content {
        grid-template-columns: 1fr;
        gap: var(--space-3xl);
        text-align: center;
      }

      .hero-visual {
        order: -1;
      }

      .services-header {
        grid-template-columns: 1fr;
        text-align: center;
        gap: var(--space-2xl);
      }

      .testimonials-grid {
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      }
    }

    @media (max-width: 768px) {
      /* MOBILE LAYOUT - FLEXBOX EVERYWHERE */

      /* All sections - consistent spacing with wave border margins */
      .scroll-section {
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        justify-content: center !important;
        padding: calc(var(--space-4xl) + 60px) var(--space-lg) calc(var(--space-4xl) + 60px) !important;
        min-height: auto !important;
      }

      /* Hero Section - Account for fixed header */
      .hero-section {
        padding-top: calc(90px + var(--space-4xl) + 60px) !important;
        padding-bottom: calc(var(--space-4xl) + 60px) !important;
      }

      /* Apple Showcase sections */
      .apple-showcase {
        padding: calc(var(--space-4xl) + 60px) var(--space-lg) !important;
      }

      /* Layered Reveal section */
      .layered-reveal {
        padding: calc(var(--space-4xl) + 60px) var(--space-lg) !important;
      }

      /* CTA Section */
      .cta-section {
        padding: calc(var(--space-4xl) + 60px) var(--space-lg) !important;
      }

      /* All showcase grids - stack vertically with flexbox */
      .showcase-grid {
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        gap: var(--space-2xl) !important;
        min-height: auto !important;
        width: 100% !important;
      }

      .showcase-content,
      .showcase-media {
        width: 100% !important;
        max-width: 100% !important;
        text-align: center !important;
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        justify-content: center !important;
        transform: none !important;
      }

      .showcase-media {
        order: -1 !important;
      }

      /* Disable all data-showcase and data-magnetic transforms */
      [data-showcase],
      [data-magnetic],
      .magnetic {
        transform: none !important;
      }

      /* Container - ensure proper flexbox and centering */
      .container {
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        width: 100% !important;
      }

      /* Typography */
      .hero-badge {
        font-size: 0.8rem;
        padding: 0.5rem 1rem;
        margin-bottom: var(--space-lg);
      }

      .hero-title {
        font-size: 2rem !important;
        line-height: 1.2 !important;
        margin-bottom: var(--space-lg) !important;
      }

      .hero-subtitle {
        font-size: 1rem !important;
        margin-bottom: var(--space-2xl) !important;
      }

      .hero-actions {
        justify-content: center;
        gap: var(--space-md);
      }

      .hero-actions .btn {
        width: auto;
        min-width: 200px;
      }

      /* Images */
      .parallax-container {
        height: 280px !important;
        width: 100% !important;
        border-radius: 1rem;
        overflow: hidden !important;
      }

      .parallax-bg {
        position: relative !important;
        top: 0 !important;
        left: 0 !important;
        width: 100% !important;
        height: 100% !important;
        transform: none !important;
        object-fit: cover !important;
        object-position: center !important;
      }

      .parallax-overlay,
      .parallax-float,
      .float-badge {
        display: none !important;
      }

      .showcase-image {
        width: 100% !important;
        height: 280px !important;
        object-fit: cover !important;
        object-position: center !important;
      }

      /* Layered Reveal Section - Force Flexbox and Centering */
      .layered-reveal {
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
      }

      .layered-reveal .container {
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
      }

      .reveal-layer {
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        transform: none !important;
        width: 100% !important;
      }

      /* Product Cards Section */
      .section-title {
        font-size: 2rem !important;
        margin-bottom: var(--space-2xl) !important;
        transform: none !important;
        text-align: center !important;
      }

      .product-showcase {
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        gap: var(--space-2xl) !important;
        margin-top: 0 !important;
        width: 100% !important;
      }

      .product-card {
        width: 100% !important;
        transform: none !important;
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
      }

      .product-media {
        height: 240px !important;
        width: 100% !important;
        overflow: hidden !important;
      }

      .product-media img {
        width: 100% !important;
        height: 100% !important;
        object-fit: cover !important;
        object-position: center !important;
      }

      .product-info {
        padding: var(--space-xl) !important;
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        text-align: center !important;
        width: 100% !important;
      }

      .product-info h3 {
        font-size: 1.25rem !important;
        text-align: center !important;
      }

      .product-info p {
        text-align: center !important;
      }

      .product-features {
        display: flex !important;
        flex-direction: column !important;
        gap: var(--space-sm);
        align-items: center !important;
        width: 100% !important;
      }

      .feature {
        text-align: center !important;
      }

      /* Stats Section - Centered */
      .experience-stats {
        margin-top: var(--space-2xl);
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        width: 100% !important;
      }

      .stat-row {
        display: flex !important;
        flex-direction: row !important;
        flex-wrap: wrap !important;
        gap: var(--space-md);
        justify-content: center !important;
        align-items: center !important;
        width: 100% !important;
      }

      .stat-item {
        flex: 1;
        min-width: 140px;
        max-width: 140px;
        height: 140px;
        background: rgba(255, 255, 255, 0.9);
        padding: var(--space-lg);
        border-radius: var(--radius-lg);
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        justify-content: center !important;
        text-align: center !important;
      }

      .stat-number {
        font-size: 2rem !important;
        text-align: center !important;
      }

      .stat-label {
        text-align: center !important;
      }

      /* Testimonial - Centered and Fixed */
      .testimonial-card {
        padding: var(--space-2xl) !important;
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        text-align: center !important;
        transform: none !important;
        width: 100% !important;
      }

      .testimonial-text {
        font-size: 1rem !important;
        line-height: 1.6 !important;
        text-align: center !important;
      }

      .testimonial-author {
        text-align: center !important;
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
      }

      .testimonial-author strong,
      .testimonial-author span {
        text-align: center !important;
      }

      /* CTA Section - Centered and Fixed */
      .cta-title {
        font-size: 2rem !important;
        margin-bottom: var(--space-lg) !important;
        text-align: center !important;
        transform: none !important;
      }

      .cta-subtitle {
        font-size: 1rem !important;
        margin-bottom: var(--space-2xl) !important;
        text-align: center !important;
      }

      .cta-actions {
        display: flex !important;
        flex-direction: column !important;
        gap: var(--space-md);
        align-items: center !important;
        justify-content: center !important;
        width: 100% !important;
      }

      .cta-actions .btn {
        min-width: 200px;
        text-align: center !important;
      }

      /* Floating badges - simplified and centered */
      .cta-visual {
        height: auto !important;
        min-height: 120px !important;
        width: 100% !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        transform: none !important;
      }

      .floating-elements {
        position: relative !important;
        display: flex !important;
        flex-wrap: wrap !important;
        gap: var(--space-sm) !important;
        align-items: center !important;
        justify-content: center !important;
        padding: var(--space-lg) 0 !important;
        width: 100% !important;
        transform: none !important;
      }

      .element {
        position: relative !important;
        top: auto !important;
        left: auto !important;
        right: auto !important;
        bottom: auto !important;
        animation: none !important;
        transform: none !important;
        font-size: 0.85rem;
        padding: 0.6rem 1.25rem;
      }

      /* Hide decorative backgrounds */
      .hero-section::before,
      .apple-showcase::before,
      .values-section::before,
      .cta-section::before {
        display: none !important;
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

      .parallax-container,
      .showcase-image {
        height: 200px !important;
      }

      .product-media {
        height: 180px !important;
      }

      .stat-number {
        font-size: 1.75rem !important;
      }
    }

    @media (max-width: 360px) {
      .hero-title {
        font-size: 1.375rem !important;
      }

      .hero-subtitle,
      .cta-subtitle,
      .product-info p {
        font-size: 0.875rem !important;
      }

      .parallax-container,
      .showcase-image {
        height: 180px !important;
      }

      .product-media {
        height: 160px !important;
      }

      .hero-actions .btn,
      .cta-actions .btn {
        max-width: 100% !important;
        padding: var(--space-md) var(--space-lg) !important;
      }
    }
  `]
})
export class HomeComponent implements OnInit, AfterViewInit {
  constructor(
    private appleAnimations: AppleAnimationsService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      // Initialize fixed viewport scrolling
      setTimeout(() => {
        this.appleAnimations.initializeFixedViewport();
        this.setupProgressiveImageLoading();
      }, 100);
    }
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        this.initializeInteractiveElements();
      }, 500);
    }
  }

  private setupProgressiveImageLoading(): void {
    const images = document.querySelectorAll('.progressive-img');
    images.forEach((img) => {
      const imgElement = img as HTMLImageElement;
      if (imgElement.complete) {
        imgElement.classList.add('loaded');
      } else {
        imgElement.addEventListener('load', () => {
          imgElement.classList.add('loaded');
        });
      }
    });
  }

  private initializeInteractiveElements(): void {
    // Add reveal animations to content sections
    const revealElements = document.querySelectorAll('[data-reveal]');
    revealElements.forEach(element => {
      element.classList.add('reveal-layer');
    });

    // Add magnetic effect to interactive elements
    const magneticElements = document.querySelectorAll('.magnetic');
    magneticElements.forEach((element) => {
      this.appleAnimations.createMagneticButton(element as HTMLElement);
    });

    // Initialize true parallax scrolling
    this.setupTrueParallax();

    // Initialize scroll-triggered visibility
    this.setupScrollTriggers();
  }

  private setupTrueParallax(): void {
    // Disable parallax on mobile devices
    if (window.innerWidth <= 768) {
      return;
    }

    const scrollContainer = document.querySelector('.apple-scroll-container') as HTMLElement;
    if (!scrollContainer) return;

    // Get all parallax elements
    const parallaxElements = document.querySelectorAll('[data-speed]');

    let ticking = false;

    const updateParallax = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollTop = scrollContainer.scrollTop;
          const scrollHeight = scrollContainer.scrollHeight;
          const containerHeight = scrollContainer.clientHeight;

          parallaxElements.forEach((element) => {
            const htmlElement = element as HTMLElement;
            const speed = parseFloat(htmlElement.dataset['speed'] || '0');

            // Calculate element position relative to viewport
            const rect = htmlElement.getBoundingClientRect();
            const elementTop = htmlElement.offsetTop;
            const elementCenter = elementTop + rect.height / 2;
            const viewportCenter = scrollTop + containerHeight / 2;

            // Calculate distance from viewport center
            const distance = elementCenter - viewportCenter;

            // Apply parallax transform
            const parallaxOffset = distance * speed * 0.5;
            htmlElement.style.transform = `translate3d(0, ${parallaxOffset}px, 0)`;
          });

          ticking = false;
        });
        ticking = true;
      }
    };

    scrollContainer.addEventListener('scroll', updateParallax, { passive: true });
  }

  private setupScrollTriggers(): void {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');

          // Add staggered animation to child elements
          const children = entry.target.querySelectorAll('.reveal-layer');
          children.forEach((child, index: number) => {
            setTimeout(() => {
              (child as HTMLElement).classList.add('visible');
            }, index * 100);
          });
        }
      });
    }, {
      threshold: 0.2,
      rootMargin: '0px 0px -100px 0px'
    });

    // Observe all showcase elements
    const showcaseElements = document.querySelectorAll('.showcase-content, .showcase-media, .reveal-layer');
    showcaseElements.forEach(element => {
      observer.observe(element);
    });
  }
}