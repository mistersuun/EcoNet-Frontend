import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { LoaderService } from '../../shared/services/loader.service';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="error-page">
      <div class="container">
        <div class="error-content">
          <div class="error-icon fade-in-up">
            <span class="icon">🌿</span>
            <span class="number">404</span>
          </div>

          <h1 class="error-title fade-in-up stagger-1">Page non trouvée</h1>

          <p class="error-description fade-in-up stagger-2">
            Désolé, la page que vous recherchez semble avoir pris la poudre d'escampette.
            Peut-être a-t-elle été déplacée ou n'existe-t-elle plus.
          </p>

          <div class="error-actions fade-in-up stagger-3">
            <a routerLink="/" class="btn btn-primary btn-lg">
              <span>🏠</span>
              Retour à l'accueil
            </a>
            <button (click)="goBack()" class="btn btn-secondary btn-lg">
              <span>←</span>
              Page précédente
            </button>
          </div>

          <div class="error-suggestions fade-in-up stagger-4">
            <h3>Pages populaires :</h3>
            <div class="suggestion-links">
              <a routerLink="/services" class="suggestion-link">Services</a>
              <a routerLink="/booking" class="suggestion-link">Réservation</a>
              <a routerLink="/contact" class="suggestion-link">Contact</a>
              <a routerLink="/pricing" class="suggestion-link">Tarifs</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .error-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, var(--mint-cream) 0%, var(--azure-web) 100%);
      padding: var(--space-4xl) 0;
    }

    .error-content {
      text-align: center;
      max-width: 600px;
      margin: 0 auto;
    }

    .error-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--space-lg);
      margin-bottom: var(--space-3xl);
    }

    .error-icon .icon {
      font-size: 4rem;
      filter: drop-shadow(2px 4px 8px rgba(107, 144, 128, 0.3));
      animation: rotate 3s ease-in-out infinite;
    }

    @keyframes rotate {
      0%, 100% {
        transform: rotate(-5deg);
      }
      50% {
        transform: rotate(5deg);
      }
    }

    .error-icon .number {
      font-size: 6rem;
      font-weight: var(--font-weight-bold);
      color: var(--primary);
      line-height: 1;
      text-shadow: 2px 4px 8px rgba(107, 144, 128, 0.2);
    }

    .error-title {
      color: var(--neutral-dark);
      margin-bottom: var(--space-xl);
      font-size: clamp(2rem, 5vw, 3rem);
    }

    .error-description {
      color: var(--neutral-medium);
      font-size: 1.125rem;
      line-height: 1.8;
      margin-bottom: var(--space-3xl);
      max-width: 500px;
      margin-left: auto;
      margin-right: auto;
    }

    .error-actions {
      display: flex;
      gap: var(--space-lg);
      justify-content: center;
      align-items: center;
      margin-bottom: var(--space-4xl);
      flex-wrap: wrap;
    }

    .error-actions .btn {
      display: inline-flex;
      align-items: center;
      gap: var(--space-sm);
    }

    .error-suggestions {
      background: rgba(255, 255, 255, 0.8);
      padding: var(--space-2xl);
      border-radius: var(--radius-xl);
      backdrop-filter: blur(10px);
      box-shadow: var(--shadow-soft);
    }

    .error-suggestions h3 {
      font-size: 1.125rem;
      color: var(--neutral-dark);
      margin-bottom: var(--space-lg);
      font-weight: var(--font-weight-semibold);
    }

    .suggestion-links {
      display: flex;
      gap: var(--space-md);
      justify-content: center;
      flex-wrap: wrap;
    }

    .suggestion-link {
      padding: var(--space-sm) var(--space-lg);
      background: var(--primary-light);
      color: var(--pure-white);
      text-decoration: none;
      border-radius: var(--radius-full);
      font-size: 0.9rem;
      font-weight: var(--font-weight-medium);
      transition: all var(--transition-base);
      box-shadow: var(--shadow-subtle);
    }

    .suggestion-link:hover {
      background: var(--primary);
      transform: translateY(-2px);
      box-shadow: var(--shadow-medium);
    }

    /* Responsive */
    @media (max-width: 768px) {
      .error-page {
        padding: var(--space-2xl) 0;
      }

      .error-icon .icon {
        font-size: 3rem;
      }

      .error-icon .number {
        font-size: 4rem;
      }

      .error-actions {
        flex-direction: column;
        width: 100%;
      }

      .error-actions .btn {
        width: 100%;
        max-width: 300px;
      }

      .error-description {
        font-size: 1rem;
      }
    }
  `]
})
export class NotFoundComponent implements OnInit {
  constructor(
    private router: Router,
    private loaderService: LoaderService
  ) {}

  ngOnInit() {
    // Show brief loader before displaying error page
    this.loaderService.show('Page introuvable');
    setTimeout(() => {
      this.loaderService.hide();
      // Add visible class for animations
      this.addVisibleClasses();
    }, 400);
  }

  goBack() {
    this.loaderService.show();
    setTimeout(() => {
      window.history.back();
    }, 300);
  }

  private addVisibleClasses() {
    const elements = document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right');
    elements.forEach(el => el.classList.add('visible'));
  }
}
