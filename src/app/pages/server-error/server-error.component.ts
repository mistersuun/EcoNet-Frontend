import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LoaderService } from '../../shared/services/loader.service';

@Component({
  selector: 'app-server-error',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="error-page">
      <div class="container">
        <div class="error-content">
          <div class="error-icon fade-in-up">
            <span class="icon">⚠️</span>
            <span class="number">500</span>
          </div>

          <h1 class="error-title fade-in-up stagger-1">Erreur du serveur</h1>

          <p class="error-description fade-in-up stagger-2">
            Oups ! Quelque chose s'est mal passé de notre côté.
            Notre équipe technique a été notifiée et travaille à résoudre le problème.
          </p>

          <div class="error-actions fade-in-up stagger-3">
            <a routerLink="/" class="btn btn-primary btn-lg">
              <span>🏠</span>
              Retour à l'accueil
            </a>
            <button (click)="retry()" class="btn btn-secondary btn-lg">
              <span>🔄</span>
              Réessayer
            </button>
          </div>

          <div class="error-suggestions fade-in-up stagger-4">
            <h3>En attendant, vous pouvez :</h3>
            <ul>
              <li>Rafraîchir la page dans quelques instants</li>
              <li>Retourner à la page d'accueil</li>
              <li>Nous contacter si le problème persiste</li>
            </ul>
            <a routerLink="/contact" class="contact-link">
              Contactez-nous
            </a>
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
      background: linear-gradient(135deg, #fff5f5 0%, #ffe5e5 100%);
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
      filter: drop-shadow(2px 4px 8px rgba(232, 122, 122, 0.3));
      animation: shake 2s ease-in-out infinite;
    }

    @keyframes shake {
      0%, 100% {
        transform: translateX(0);
      }
      25% {
        transform: translateX(-5px) rotate(-5deg);
      }
      75% {
        transform: translateX(5px) rotate(5deg);
      }
    }

    .error-icon .number {
      font-size: 6rem;
      font-weight: var(--font-weight-bold);
      color: var(--error);
      line-height: 1;
      text-shadow: 2px 4px 8px rgba(232, 122, 122, 0.2);
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
      background: rgba(255, 255, 255, 0.9);
      padding: var(--space-2xl);
      border-radius: var(--radius-xl);
      backdrop-filter: blur(10px);
      box-shadow: var(--shadow-soft);
      text-align: left;
    }

    .error-suggestions h3 {
      font-size: 1.125rem;
      color: var(--neutral-dark);
      margin-bottom: var(--space-lg);
      font-weight: var(--font-weight-semibold);
      text-align: center;
    }

    .error-suggestions ul {
      list-style: none;
      padding: 0;
      margin: 0 0 var(--space-xl) 0;
    }

    .error-suggestions li {
      padding: var(--space-sm) 0;
      color: var(--neutral-medium);
      position: relative;
      padding-left: var(--space-lg);
    }

    .error-suggestions li::before {
      content: '•';
      position: absolute;
      left: 0;
      color: var(--error);
      font-weight: bold;
    }

    .contact-link {
      display: inline-block;
      padding: var(--space-md) var(--space-xl);
      background: var(--error);
      color: var(--pure-white);
      text-decoration: none;
      border-radius: var(--radius-full);
      font-size: 0.9rem;
      font-weight: var(--font-weight-semibold);
      transition: all var(--transition-base);
      box-shadow: var(--shadow-subtle);
      margin: 0 auto;
      display: block;
      width: fit-content;
    }

    .contact-link:hover {
      background: #d66b6b;
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
export class ServerErrorComponent implements OnInit {
  constructor(private loaderService: LoaderService) {}

  ngOnInit() {
    // Show brief loader before displaying error page
    this.loaderService.show('Erreur serveur');
    setTimeout(() => {
      this.loaderService.hide();
      // Add visible class for animations
      this.addVisibleClasses();
    }, 400);
  }

  retry() {
    this.loaderService.show('Nouvelle tentative...');
    setTimeout(() => {
      window.location.reload();
    }, 500);
  }

  private addVisibleClasses() {
    const elements = document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right');
    elements.forEach(el => el.classList.add('visible'));
  }
}
