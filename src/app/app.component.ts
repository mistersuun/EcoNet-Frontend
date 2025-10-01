import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd, NavigationStart } from '@angular/router';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { LanguageService } from './services/language.service';
import { LoaderService } from './shared/services/loader.service';
import { LoaderComponent } from './shared/components/loader.component';
import { Subscription } from 'rxjs';
import { filter, delay } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, TranslocoPipe, LoaderComponent],
  template: `
    <div class="app-container">
      <!-- Loader -->
      <app-loader
        [isVisible]="(loaderService.isLoading$ | async) || false"
        [loadingText]="(loaderService.loadingText$ | async) || 'Chargement...'">
      </app-loader>

      <!-- Mobile Menu Backdrop -->
      <div class="mobile-menu-backdrop" [class.visible]="mobileMenuOpen" (click)="closeMobileMenu()"></div>

      <!-- Sophisticated Header -->
      <header class="header" [class.scrolled]="isScrolled">
        <nav class="navbar">
          <div class="container">
            <a routerLink="/" class="nav-brand">
              <div class="logo">
                <span class="logo-icon">🌿</span>
                <span class="logo-text">ÉcoNet</span>
              </div>
            </a>

            <div class="nav-menu" [class.nav-open]="mobileMenuOpen">
              <a routerLink="/" class="nav-link" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" (click)="navigateWithLoader($event, 'Accueil', '/')">{{ 'NAV.HOME' | transloco }}</a>
              <a routerLink="/services" class="nav-link" routerLinkActive="active" (click)="navigateWithLoader($event, 'Services', '/services')">{{ 'NAV.SERVICES' | transloco }}</a>
              <a routerLink="/about" class="nav-link" routerLinkActive="active" (click)="navigateWithLoader($event, 'À propos', '/about')">{{ 'NAV.ABOUT' | transloco }}</a>
              <a routerLink="/pricing" class="nav-link" routerLinkActive="active" (click)="navigateWithLoader($event, 'Tarifs', '/pricing')">{{ 'NAV.PRICING' | transloco }}</a>
              <a routerLink="/contact" class="nav-link" routerLinkActive="active" (click)="navigateWithLoader($event, 'Contact', '/contact')">{{ 'NAV.CONTACT' | transloco }}</a>

              <!-- Language Toggle -->
              <div class="language-toggle">
                <button
                  class="lang-btn"
                  [class.active]="currentLang === 'fr'"
                  (click)="switchLanguage('fr')">FR</button>
                <button
                  class="lang-btn"
                  [class.active]="currentLang === 'en'"
                  (click)="switchLanguage('en')">EN</button>
              </div>

              <a routerLink="/booking" class="btn btn-primary nav-cta" (click)="navigateWithLoader($event, 'Réservation', '/booking')">{{ 'NAV.BOOK' | transloco }}</a>
            </div>

            <button class="mobile-menu-toggle" (click)="toggleMobileMenu()" [class.active]="mobileMenuOpen" aria-label="Menu">
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </nav>
      </header>

      <!-- Main Content -->
      <main class="main-content">
        <router-outlet></router-outlet>
      </main>

      <!-- Elegant Footer -->
      <footer class="footer wave-border-top-only">
        <div class="container">
          <div class="footer-content">
            <!-- Brand Section -->
            <div class="footer-brand">
              <div class="footer-logo">
                <span class="logo-icon">🌿</span>
                <span class="logo-text">ÉcoNet Propreté</span>
              </div>
              <p class="footer-description">
                {{ 'FOOTER.DESCRIPTION' | transloco }}
              </p>
              <div class="footer-contact">
                <a href="tel:+15141234567" class="contact-item">
                  <span class="contact-icon">📞</span>
                  <span>(514) 123-4567</span>
                </a>
                <a href="mailto:info@econet-proprete.ca" class="contact-item">
                  <span class="contact-icon">📧</span>
                  <span>info@econet-proprete.ca</span>
                </a>
              </div>
            </div>

            <!-- Services Links -->
            <div class="footer-section">
              <h4 class="footer-title" (click)="toggleFooterSection('services')">
                {{ 'FOOTER.SERVICES_TITLE' | transloco }}
                <span class="footer-toggle">{{ footerSectionsExpanded['services'] ? '−' : '+' }}</span>
              </h4>
              <ul class="footer-links" [class.expanded]="footerSectionsExpanded['services']">
                <li><a routerLink="/services">{{ 'SERVICES.RESIDENTIAL.TITLE' | transloco }}</a></li>
                <li><a routerLink="/services">{{ 'SERVICES.COMMERCIAL.TITLE' | transloco }}</a></li>
                <li><a routerLink="/services">{{ 'SERVICES.POST_CONSTRUCTION.TITLE' | transloco }}</a></li>
                <li><a routerLink="/services">{{ 'SERVICES.MAINTENANCE.TITLE' | transloco }}</a></li>
              </ul>
            </div>

            <!-- Company Links -->
            <div class="footer-section">
              <h4 class="footer-title" (click)="toggleFooterSection('company')">
                {{ 'FOOTER.COMPANY_TITLE' | transloco }}
                <span class="footer-toggle">{{ footerSectionsExpanded['company'] ? '−' : '+' }}</span>
              </h4>
              <ul class="footer-links" [class.expanded]="footerSectionsExpanded['company']">
                <li><a routerLink="/about">{{ 'NAV.ABOUT' | transloco }}</a></li>
                <li><a routerLink="/pricing">{{ 'NAV.PRICING' | transloco }}</a></li>
                <li><a routerLink="/faq">{{ 'NAV.FAQ' | transloco }}</a></li>
                <li><a routerLink="/contact">{{ 'NAV.CONTACT' | transloco }}</a></li>
              </ul>
            </div>

            <!-- Service Areas -->
            <div class="footer-section">
              <h4 class="footer-title" (click)="toggleFooterSection('areas')">
                {{ 'FOOTER.AREAS_TITLE' | transloco }}
                <span class="footer-toggle">{{ footerSectionsExpanded['areas'] ? '−' : '+' }}</span>
              </h4>
              <ul class="footer-links" [class.expanded]="footerSectionsExpanded['areas']">
                <li>{{ 'FOOTER.SERVICE_AREAS.MONTREAL' | transloco }}</li>
                <li>{{ 'FOOTER.SERVICE_AREAS.LAVAL' | transloco }}</li>
                <li>{{ 'FOOTER.SERVICE_AREAS.LONGUEUIL' | transloco }}</li>
                <li>{{ 'FOOTER.SERVICE_AREAS.BROSSARD' | transloco }}</li>
              </ul>
            </div>
          </div>

          <!-- Footer Bottom -->
          <div class="footer-bottom">
            <div class="footer-divider"></div>
            <div class="footer-meta">
              <p>{{ 'FOOTER.COPYRIGHT' | transloco }}</p>
              <div class="footer-legal">
                <a href="/privacy">{{ 'FOOTER.PRIVACY' | transloco }}</a>
                <a href="/terms">{{ 'FOOTER.TERMS' | transloco }}</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    /* App Layout */
    .app-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .main-content {
      flex: 1;
    }

    /* Sophisticated Header */
    .header {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      background: rgba(254, 254, 254, 0.9);
      backdrop-filter: blur(20px);
      border-bottom: 1px solid rgba(26, 26, 26, 0.06);
      z-index: 1000;
      transition: all var(--transition-base);
    }

    .header.scrolled {
      background: rgba(254, 254, 254, 0.95);
      box-shadow: var(--shadow-soft);
    }

    .navbar {
      padding: var(--space-lg) 0;
    }

    .navbar .container {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .nav-brand {
      text-decoration: none;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: var(--space-sm);
    }

    .logo-icon {
      font-size: 1.5rem;
    }

    .logo-text {
      font-family: var(--font-primary);
      font-size: 1.375rem;
      font-weight: var(--font-weight-bold);
      color: var(--primary);
      letter-spacing: -0.01em;
    }

    .nav-menu {
      display: flex;
      align-items: center;
      gap: var(--space-2xl);
    }

    .nav-link {
      text-decoration: none;
      color: var(--neutral-medium);
      font-weight: var(--font-weight-medium);
      font-size: 0.9rem;
      padding: var(--space-sm) var(--space-md);
      border-radius: var(--radius-md);
      transition: all var(--transition-base);
      letter-spacing: 0.01em;
      position: relative;
    }

    .nav-link:hover {
      color: var(--neutral-dark);
      background: var(--secondary);
    }

    .nav-link.active {
      color: var(--primary);
      font-weight: var(--font-weight-semibold);
    }

    .nav-cta {
      font-size: 0.875rem;
      padding: var(--space-md) var(--space-xl);
      background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
      color: var(--pure-white) !important;
      border: none;
      border-radius: var(--radius-full);
      font-weight: var(--font-weight-semibold);
      letter-spacing: 0.02em;
      box-shadow: 0 2px 12px rgba(107, 144, 128, 0.3);
      position: relative;
      overflow: hidden;
      transition: all var(--transition-base);
    }

    .nav-cta::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
      transition: left 0.6s;
    }

    .nav-cta:hover {
      background: linear-gradient(135deg, var(--primary-dark) 0%, var(--primary) 100%);
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(107, 144, 128, 0.4);
      color: var(--pure-white) !important;
    }

    .nav-cta:hover::before {
      left: 100%;
    }

    .nav-cta:active {
      transform: translateY(0);
      box-shadow: 0 2px 8px rgba(107, 144, 128, 0.3);
    }

    /* Language Toggle */
    .language-toggle {
      display: flex;
      background: rgba(107, 144, 128, 0.1);
      border-radius: var(--radius-full);
      padding: 4px;
      gap: 2px;
    }

    .lang-btn {
      padding: var(--space-xs) var(--space-md);
      border: none;
      border-radius: var(--radius-full);
      background: transparent;
      color: var(--neutral-medium);
      font-size: 0.8rem;
      font-weight: var(--font-weight-semibold);
      cursor: pointer;
      transition: all var(--transition-base);
      letter-spacing: 0.05em;
    }

    .lang-btn:hover {
      background: rgba(107, 144, 128, 0.1);
      color: var(--primary);
    }

    .lang-btn.active {
      background: var(--primary);
      color: var(--pure-white);
      box-shadow: 0 2px 8px rgba(107, 144, 128, 0.3);
    }

    /* Mobile Menu */
    .mobile-menu-toggle {
      display: none;
      flex-direction: column;
      background: transparent;
      border: none;
      cursor: pointer;
      padding: var(--space-sm);
      gap: 4px;
    }

    .mobile-menu-toggle span {
      width: 20px;
      height: 2px;
      background: var(--neutral-dark);
      transition: all var(--transition-base);
      border-radius: 1px;
    }

    .mobile-menu-toggle.active span:nth-child(1) {
      transform: rotate(45deg) translate(5px, 5px);
    }

    .mobile-menu-toggle.active span:nth-child(2) {
      opacity: 0;
    }

    .mobile-menu-toggle.active span:nth-child(3) {
      transform: rotate(-45deg) translate(7px, -6px);
    }

    /* Elegant Footer */
    .footer {
      background: var(--primary);
      color: var(--pure-white);
      padding: var(--space-5xl) 0 var(--space-lg);
      margin-top: auto;
      position: relative;
      overflow: visible;
    }

    .footer-content {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 1fr;
      gap: var(--space-4xl);
      margin-bottom: var(--space-3xl);
    }

    .footer-brand {
      max-width: 350px;
    }

    .footer-logo {
      display: flex;
      align-items: center;
      gap: var(--space-sm);
      margin-bottom: var(--space-lg);
    }

    .footer-logo .logo-text {
      color: var(--pure-white);
      font-size: 1.25rem;
    }

    .footer-description {
      color: rgba(255, 255, 255, 0.8);
      line-height: 1.6;
      margin-bottom: var(--space-xl);
    }

    .footer-contact {
      display: flex;
      flex-direction: column;
      gap: var(--space-sm);
    }

    .contact-item {
      display: flex;
      align-items: center;
      gap: var(--space-sm);
      color: rgba(255, 255, 255, 0.9);
      text-decoration: none;
      font-size: 0.9rem;
      font-weight: var(--font-weight-medium);
      transition: color var(--transition-base);
    }

    .contact-item:hover {
      color: var(--pure-white);
    }

    .contact-icon {
      font-size: 0.875rem;
    }

    .footer-title {
      color: var(--pure-white);
      font-size: 1rem;
      font-weight: var(--font-weight-semibold);
      margin-bottom: var(--space-lg);
      letter-spacing: 0.01em;
      position: relative;
    }

    .footer-toggle {
      display: none;
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      font-size: 1.5rem;
      font-weight: var(--font-weight-bold);
      line-height: 1;
      transition: transform var(--transition-base);
    }

    .footer-links {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: var(--space-sm);
    }

    .footer-links li a,
    .footer-links li {
      color: rgba(255, 255, 255, 0.8);
      text-decoration: none;
      font-size: 0.9rem;
      font-weight: var(--font-weight-regular);
      transition: color var(--transition-base);
    }

    .footer-links li a:hover {
      color: var(--pure-white);
    }

    .footer-bottom {
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      padding-top: var(--space-xl);
    }

    .footer-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: var(--space-lg);
    }

    .footer-meta p {
      color: rgba(255, 255, 255, 0.7);
      font-size: 0.875rem;
      margin: 0;
    }

    .footer-legal {
      display: flex;
      gap: var(--space-lg);
    }

    .footer-legal a {
      color: rgba(255, 255, 255, 0.7);
      text-decoration: none;
      font-size: 0.875rem;
      transition: color var(--transition-base);
    }

    .footer-legal a:hover {
      color: var(--pure-white);
    }

    /* Account for Fixed Header */
    .main-content {
      margin-top: 80px;
    }

    /* Mobile Menu Backdrop */
    .mobile-menu-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      opacity: 0;
      visibility: hidden;
      transition: all var(--transition-base);
      z-index: 998;
      backdrop-filter: blur(4px);
    }

    .mobile-menu-backdrop.visible {
      opacity: 1;
      visibility: visible;
    }

    /* Mobile Responsive */
    @media (max-width: 1024px) {
      .footer-content {
        grid-template-columns: 1fr 1fr;
        gap: var(--space-3xl);
      }

      .nav-menu {
        gap: var(--space-xl);
      }
    }

    @media (max-width: 768px) {
      /* iOS Safe Area Support */
      .header {
        padding-top: env(safe-area-inset-top);
        background: rgba(254, 254, 254, 0.98) !important;
        z-index: 1000 !important;
      }

      .navbar {
        padding: var(--space-md) 0;
      }

      .nav-menu {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: var(--pure-white);
        flex-direction: column;
        padding: calc(80px + env(safe-area-inset-top)) var(--space-lg) calc(var(--space-2xl) + env(safe-area-inset-bottom));
        box-shadow: none;
        transform: translateX(100%);
        transition: transform 0.35s cubic-bezier(0.23, 1, 0.32, 1);
        gap: var(--space-md);
        z-index: 999;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
        min-height: 100vh;
        height: auto;
      }

      .nav-menu.nav-open {
        transform: translateX(0);
      }

      .nav-link {
        width: 100%;
        text-align: center;
        padding: var(--space-lg) var(--space-md);
        font-size: 1rem;
        border-radius: var(--radius-lg);
      }

      .nav-cta {
        width: auto;
        margin: var(--space-lg) auto 0;
        padding: var(--space-lg) var(--space-2xl);
        font-size: 1rem;
        min-width: 200px;
      }

      .language-toggle {
        margin: var(--space-lg) auto;
        width: fit-content;
        padding: 6px;
      }

      .lang-btn {
        padding: var(--space-sm) var(--space-lg);
        font-size: 0.875rem;
        min-width: 50px;
      }

      .mobile-menu-toggle {
        display: flex;
        z-index: 1001;
        padding: var(--space-md);
        min-width: 44px;
        min-height: 44px;
        justify-content: center;
        align-items: center;
      }

      .mobile-menu-toggle span {
        width: 24px;
        height: 3px;
        border-radius: 2px;
      }

      .main-content {
        margin-top: calc(70px + env(safe-area-inset-top));
      }

      .footer {
        padding: var(--space-4xl) 0 calc(var(--space-lg) + env(safe-area-inset-bottom));
      }

      .footer-content {
        grid-template-columns: 1fr;
        gap: var(--space-2xl);
        text-align: left;
      }

      .footer-brand {
        max-width: none;
        margin: 0 auto;
        text-align: center;
        margin-bottom: var(--space-xl);
        padding-bottom: var(--space-xl);
        border-bottom: 1px solid rgba(255, 255, 255, 0.2);
      }

      .footer-contact {
        align-items: center;
      }

      .footer-section {
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        padding-bottom: var(--space-md);
      }

      .footer-title {
        font-size: 1.125rem;
        margin-bottom: 0;
        padding: var(--space-lg) 0;
        cursor: pointer;
        user-select: none;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .footer-toggle {
        display: inline-block;
      }

      .footer-links {
        max-height: 0;
        overflow: hidden;
        transition: max-height var(--transition-slow), opacity var(--transition-base);
        opacity: 0;
        margin-top: 0;
      }

      .footer-links.expanded {
        max-height: 500px;
        opacity: 1;
        margin-top: var(--space-md);
        margin-bottom: var(--space-lg);
      }

      .footer-links li a,
      .footer-links li {
        font-size: 1rem;
        padding: var(--space-sm) 0;
      }

      .footer-meta {
        flex-direction: column;
        text-align: center;
        gap: var(--space-md);
      }

      .logo-text {
        font-size: 1.375rem;
      }

      .contact-item {
        font-size: 1rem;
        padding: var(--space-xs) 0;
      }
    }

    @media (max-width: 480px) {
      .logo-icon {
        font-size: 1.375rem;
      }

      .logo-text {
        font-size: 1.125rem;
      }

      .navbar {
        padding: var(--space-sm) 0;
      }

      .main-content {
        margin-top: calc(60px + env(safe-area-inset-top));
      }

      .footer-content {
        gap: var(--space-2xl);
      }
    }
  `]
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'ÉcoNet Propreté';
  mobileMenuOpen = false;
  isScrolled = false;
  currentLang = 'fr';
  footerSectionsExpanded: { [key: string]: boolean } = {
    services: false,
    company: false,
    areas: false
  };
  private langSubscription?: Subscription;
  private routerSubscription?: Subscription;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private languageService: LanguageService,
    private transloco: TranslocoService,
    public loaderService: LoaderService,
    private router: Router
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      window.addEventListener('scroll', this.onScroll.bind(this));

      // Handle route changes - only hide loader on completion
      this.routerSubscription = this.router.events.subscribe(event => {
        if (event instanceof NavigationEnd) {
          // Close mobile menu on navigation
          this.closeMobileMenu();

          // Force scroll to top with multiple methods for reliability
          setTimeout(() => {
            window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
            window.scrollTo(0, 0);
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;

            // Also try on the main content element
            const mainContent = document.querySelector('.main-content');
            if (mainContent) {
              mainContent.scrollTop = 0;
            }
          }, 0);

          // Keep loader visible for minimum duration, then hide
          setTimeout(() => {
            this.loaderService.hide();
          }, 600);
        }
      });
    }

    // Update current language from the service
    this.currentLang = this.languageService.getCurrentLanguage();

    // Subscribe to language changes to update the current language
    this.langSubscription = this.transloco.langChanges$.subscribe((lang) => {
      this.currentLang = lang as 'fr' | 'en';
    });

    // Initialize loader as hidden
    this.loaderService.hide();
  }

  ngOnDestroy() {
    if (isPlatformBrowser(this.platformId)) {
      window.removeEventListener('scroll', this.onScroll.bind(this));
    }
    if (this.langSubscription) {
      this.langSubscription.unsubscribe();
    }
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
    this.toggleBodyScroll();
  }

  closeMobileMenu() {
    if (this.mobileMenuOpen) {
      this.mobileMenuOpen = false;
      this.toggleBodyScroll();
    }
  }

  private toggleBodyScroll() {
    if (isPlatformBrowser(this.platformId)) {
      if (this.mobileMenuOpen) {
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
      } else {
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
      }
    }
  }

  switchLanguage(lang: 'fr' | 'en') {
    // Show loader with language change message
    this.loaderService.showLanguageChange(lang);

    // Update current language immediately for UI feedback
    this.currentLang = lang;

    // Switch language through the service (includes page refresh)
    this.languageService.switchLanguage(lang);

    this.closeMobileMenu();
  }

  private onScroll() {
    this.isScrolled = window.scrollY > 50;
  }

  // Method to show loader first, then navigate after delay
  navigateWithLoader(event: Event, pageName: string, route: string): void {
    // Prevent default link behavior
    event.preventDefault();

    // Scroll to top immediately
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    }

    // Show loader immediately on click
    this.loaderService.showPageLoad(pageName);
    this.closeMobileMenu();

    // Wait longer for loader to fully appear before navigating
    setTimeout(() => {
      this.router.navigate([route]);
    }, 300);
  }

  toggleFooterSection(section: string): void {
    this.footerSectionsExpanded[section] = !this.footerSectionsExpanded[section];
  }
}