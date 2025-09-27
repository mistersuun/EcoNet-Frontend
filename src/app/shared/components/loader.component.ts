import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, state, style, transition, animate, keyframes } from '@angular/animations';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="loader-overlay" *ngIf="isVisible" [@fadeIn]>
      <div class="loader-container">
        <!-- Bouncing Logo -->
        <div class="logo-bouncer">
          <span class="logo-icon">🌿</span>
          <span class="logo-text">ÉcoNet</span>
        </div>

        <!-- Loading Message -->
        <div class="loading-message" [@slideUp]>
          <p>{{ loadingText }}</p>
          <div class="progress-dots">
            <span [@dotPulse]="{ value: '', params: { delay: '0s' } }">•</span>
            <span [@dotPulse]="{ value: '', params: { delay: '0.2s' } }">•</span>
            <span [@dotPulse]="{ value: '', params: { delay: '0.4s' } }">•</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .loader-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, var(--pure-white) 0%, var(--secondary) 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      backdrop-filter: blur(10px);
    }

    .loader-container {
      text-align: center;
      max-width: 300px;
    }

    .logo-bouncer {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--space-sm);
      margin-bottom: var(--space-2xl);
      padding: var(--space-lg);
      background: rgba(255, 255, 255, 0.9);
      border-radius: var(--radius-xl);
      box-shadow: var(--shadow-large);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(107, 144, 128, 0.2);
      animation: bounceHorizontal 2s ease-in-out infinite;
    }

    @keyframes bounceHorizontal {
      0% {
        transform: translateX(-60px) scale(0.9);
        opacity: 0.7;
      }
      25% {
        transform: translateX(-30px) scale(0.95);
        opacity: 0.8;
      }
      50% {
        transform: translateX(0) scale(1);
        opacity: 1;
      }
      75% {
        transform: translateX(30px) scale(1.05);
        opacity: 0.9;
      }
      100% {
        transform: translateX(60px) scale(0.9);
        opacity: 0.7;
      }
    }

    .logo-icon {
      font-size: 2rem;
      filter: drop-shadow(2px 2px 4px rgba(107, 144, 128, 0.3));
    }

    .logo-text {
      font-family: var(--font-primary);
      font-size: 1.5rem;
      font-weight: var(--font-weight-bold);
      color: var(--primary);
      letter-spacing: -0.01em;
      text-shadow: 2px 2px 4px rgba(107, 144, 128, 0.2);
    }

    .loading-message {
      color: var(--neutral-dark);
    }

    .loading-message p {
      font-size: 1rem;
      font-weight: var(--font-weight-medium);
      margin: 0 0 var(--space-md) 0;
      color: var(--neutral-medium);
    }

    .progress-dots {
      display: flex;
      justify-content: center;
      gap: var(--space-xs);
    }

    .progress-dots span {
      font-size: 1.5rem;
      color: var(--primary);
      opacity: 0.3;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .logo-icon {
        font-size: 1.75rem;
      }

      .logo-text {
        font-size: 1.25rem;
      }

      .loading-message p {
        font-size: 0.9rem;
      }
    }
  `],
  animations: [
    // Fade in animation for overlay
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-in', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms ease-out', style({ opacity: 0 }))
      ])
    ]),


    // Slide up animation for loading message
    trigger('slideUp', [
      transition(':enter', [
        style({ transform: 'translateY(20px)', opacity: 0 }),
        animate('400ms 200ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
      ])
    ]),

    // Pulsing dots animation
    trigger('dotPulse', [
      transition('* => *', [
        animate('1.5s ease-in-out', keyframes([
          style({ opacity: 0.3, transform: 'scale(1)', offset: 0 }),
          style({ opacity: 1, transform: 'scale(1.3)', offset: 0.5 }),
          style({ opacity: 0.3, transform: 'scale(1)', offset: 1 })
        ]))
      ])
    ])
  ]
})
export class LoaderComponent {
  @Input() isVisible: boolean = false;
  @Input() loadingText: string = 'Chargement...';
}