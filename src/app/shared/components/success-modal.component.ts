import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-success-modal',
  standalone: true,
  imports: [CommonModule, TranslocoPipe],
  template: `
    <div class="modal-overlay" *ngIf="isVisible" [@fadeIn] (click)="onOverlayClick()">
      <div class="modal-content" [@scaleIn] (click)="$event.stopPropagation()">
        <div class="success-icon">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="#4CAF50" stroke-width="2" fill="none"/>
            <path d="M8 12L11 15L16 9" stroke="#4CAF50" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>

        <h2>{{ title | transloco }}</h2>
        <p>{{ message | transloco }}</p>

        <div class="modal-actions">
          <button class="btn btn-primary" (click)="onPrimaryAction()">
            {{ primaryButtonText | transloco }}
          </button>
          <button class="btn btn-secondary" (click)="onSecondaryAction()" *ngIf="secondaryButtonText">
            {{ secondaryButtonText | transloco }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      padding: var(--space-lg);
    }

    .modal-content {
      background: var(--pure-white);
      border-radius: var(--radius-xl);
      padding: var(--space-3xl);
      max-width: 500px;
      width: 100%;
      text-align: center;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    }

    .success-icon {
      margin-bottom: var(--space-xl);
      animation: checkmark 0.8s ease-in-out;
    }

    @keyframes checkmark {
      0% {
        transform: scale(0) rotate(-45deg);
        opacity: 0;
      }
      50% {
        transform: scale(1.2) rotate(5deg);
      }
      100% {
        transform: scale(1) rotate(0deg);
        opacity: 1;
      }
    }

    .success-icon svg {
      display: inline-block;
    }

    h2 {
      color: var(--neutral-dark);
      font-size: 1.75rem;
      margin-bottom: var(--space-md);
      font-weight: var(--font-weight-bold);
    }

    p {
      color: var(--neutral-medium);
      font-size: 1.125rem;
      line-height: 1.6;
      margin-bottom: var(--space-2xl);
    }

    .modal-actions {
      display: flex;
      gap: var(--space-md);
      justify-content: center;
      flex-wrap: wrap;
    }

    .btn {
      min-width: 140px;
      padding: var(--space-md) var(--space-xl);
      font-size: 1rem;
    }

    @media (max-width: 480px) {
      .modal-content {
        padding: var(--space-2xl);
      }

      h2 {
        font-size: 1.5rem;
      }

      p {
        font-size: 1rem;
      }

      .modal-actions {
        flex-direction: column;
      }

      .btn {
        width: 100%;
      }
    }
  `],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-in', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms ease-out', style({ opacity: 0 }))
      ])
    ]),
    trigger('scaleIn', [
      transition(':enter', [
        style({ transform: 'scale(0.8)', opacity: 0 }),
        animate('400ms cubic-bezier(0.16, 1, 0.3, 1)', style({ transform: 'scale(1)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms ease-out', style({ transform: 'scale(0.8)', opacity: 0 }))
      ])
    ])
  ]
})
export class SuccessModalComponent {
  @Input() isVisible: boolean = false;
  @Input() title: string = 'COMMON.SUCCESS';
  @Input() message: string = '';
  @Input() primaryButtonText: string = 'COMMON.CLOSE';
  @Input() secondaryButtonText?: string;
  @Input() redirectTo?: string;
  @Input() autoRedirect: boolean = false;
  @Input() redirectDelay: number = 3000;

  @Output() primaryClick = new EventEmitter<void>();
  @Output() secondaryClick = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();

  private autoRedirectTimer?: number;

  constructor(private router: Router) {}

  ngOnChanges() {
    if (this.isVisible && this.autoRedirect && this.redirectTo) {
      this.autoRedirectTimer = window.setTimeout(() => {
        this.navigateAndClose();
      }, this.redirectDelay);
    } else if (!this.isVisible && this.autoRedirectTimer) {
      window.clearTimeout(this.autoRedirectTimer);
    }
  }

  ngOnDestroy() {
    if (this.autoRedirectTimer) {
      window.clearTimeout(this.autoRedirectTimer);
    }
  }

  onOverlayClick() {
    this.closeModal();
  }

  onPrimaryAction() {
    this.primaryClick.emit();
    if (this.redirectTo) {
      this.navigateAndClose();
    } else {
      this.closeModal();
    }
  }

  onSecondaryAction() {
    this.secondaryClick.emit();
    this.closeModal();
  }

  private navigateAndClose() {
    if (this.redirectTo) {
      this.router.navigate([this.redirectTo]);
    }
    this.closeModal();
  }

  private closeModal() {
    this.isVisible = false;
    this.close.emit();
  }
}
