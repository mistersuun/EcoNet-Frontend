import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit, Inject, PLATFORM_ID, HostListener } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ScrollAnimationService } from '../../services/scroll-animation.service';

interface BookingStep {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}

interface ServiceOption {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  duration: string;
  icon: string;
  features: string[];
  popular?: boolean;
}

interface TimeSlot {
  time: string;
  available: boolean;
}

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <section #bookingHeader class="booking-header" [class.visible]="isHeaderVisible">
      <div class="container">
        <div class="header-content text-center fade-in-up" [class.visible]="isHeaderVisible">
          <h1 class="stagger-1">Réservez Votre Service</h1>
          <p class="stagger-2">Planifiez votre nettoyage écologique en quelques clics</p>
        </div>

        <!-- Progress Steps -->
        <div class="booking-progress fade-in-up" [class.visible]="isHeaderVisible">
          <div class="progress-steps stagger-3">
            <div class="progress-line"
                 [style.width.%]="getProgressPercentage()"></div>
            <div class="step"
                 *ngFor="let step of bookingSteps"
                 [class.active]="currentStep === step.id"
                 [class.completed]="step.completed">
              <div class="step-number">
                <span *ngIf="!step.completed">{{step.id}}</span>
                <span *ngIf="step.completed">✓</span>
              </div>
              <div class="step-info">
                <div class="step-title">{{step.title}}</div>
                <div class="step-description">{{step.description}}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section #bookingFormSection class="booking-form-section section">
      <div class="container">
        <form [formGroup]="bookingForm" class="booking-form fade-in-up" [class.visible]="isFormVisible">

          <!-- Step 1: Service Selection -->
          <div class="form-step" *ngIf="currentStep === 1">
            <div class="step-header stagger-1">
              <h2>Choisissez Votre Service</h2>
              <p>Sélectionnez le type de nettoyage dont vous avez besoin</p>
            </div>

            <div class="services-selection">
              <div class="service-option"
                   *ngFor="let service of serviceOptions; let i = index"
                   [class.selected]="selectedService?.id === service.id"
                   [class.popular]="service.popular"
                   [class]="'stagger-' + (i + 2)"
                   (click)="selectService(service)">

                <div class="service-badge" *ngIf="service.popular">⭐ POPULAIRE</div>

                <div class="service-header">
                  <div class="service-icon">{{service.icon}}</div>
                  <div class="service-pricing">
                    <span class="price">À partir de {{service.basePrice}}$</span>
                    <span class="duration">{{service.duration}}</span>
                  </div>
                </div>

                <h3>{{service.name}}</h3>
                <p class="service-description">{{service.description}}</p>

                <ul class="service-features">
                  <li *ngFor="let feature of service.features">
                    <span class="check-icon">✓</span>
                    {{feature}}
                  </li>
                </ul>
              </div>
            </div>

            <div class="step-actions">
              <button type="button"
                      class="btn btn-primary btn-lg"
                      [disabled]="!selectedService"
                      (click)="nextStep()">
                Continuer vers les Détails
              </button>
            </div>
          </div>

          <!-- Step 2: Property Details -->
          <div class="form-step" *ngIf="currentStep === 2">
            <div class="step-header stagger-1">
              <h2>Détails de la Propriété</h2>
              <p>Aidez-nous à mieux comprendre vos besoins</p>
            </div>

            <div class="form-sections">
              <div class="form-section stagger-2 form-section-with-dropdowns">
                <h3>Informations de Base</h3>
                <div class="form-row">
                  <div class="form-group">
                    <label>Type de propriété</label>
                    <div class="custom-dropdown" [class.open]="dropdownStates['propertyType']">
                      <div class="dropdown-trigger" (click)="toggleDropdown('propertyType')">
                        <span class="selected-text">{{getSelectedOptionLabel('propertyType', propertyTypeOptions)}}</span>
                        <svg class="dropdown-icon" [class.rotated]="dropdownStates['propertyType']" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <polyline points="6,9 12,15 18,9"></polyline>
                        </svg>
                      </div>
                      <div class="dropdown-menu" *ngIf="dropdownStates['propertyType']">
                        <div class="dropdown-option"
                             *ngFor="let option of propertyTypeOptions"
                             [class.selected]="bookingForm.get('propertyType')?.value === option.value"
                             (click)="selectDropdownOption('propertyType', option.value)">
                          {{option.label}}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="form-group">
                    <label for="propertySize">Superficie (pi²)</label>
                    <input type="number" formControlName="propertySize" id="propertySize"
                           class="form-control" placeholder="Ex: 1200">
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label>Nombre de chambres</label>
                    <div class="custom-dropdown" [class.open]="dropdownStates['bedrooms']">
                      <div class="dropdown-trigger" (click)="toggleDropdown('bedrooms')">
                        <span class="selected-text">{{getSelectedOptionLabel('bedrooms', bedroomOptions)}}</span>
                        <svg class="dropdown-icon" [class.rotated]="dropdownStates['bedrooms']" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <polyline points="6,9 12,15 18,9"></polyline>
                        </svg>
                      </div>
                      <div class="dropdown-menu" *ngIf="dropdownStates['bedrooms']">
                        <div class="dropdown-option"
                             *ngFor="let option of bedroomOptions"
                             [class.selected]="bookingForm.get('bedrooms')?.value === option.value"
                             (click)="selectDropdownOption('bedrooms', option.value)">
                          {{option.label}}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="form-group">
                    <label>Nombre de salles de bain</label>
                    <div class="custom-dropdown" [class.open]="dropdownStates['bathrooms']">
                      <div class="dropdown-trigger" (click)="toggleDropdown('bathrooms')">
                        <span class="selected-text">{{getSelectedOptionLabel('bathrooms', bathroomOptions)}}</span>
                        <svg class="dropdown-icon" [class.rotated]="dropdownStates['bathrooms']" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <polyline points="6,9 12,15 18,9"></polyline>
                        </svg>
                      </div>
                      <div class="dropdown-menu" *ngIf="dropdownStates['bathrooms']">
                        <div class="dropdown-option"
                             *ngFor="let option of bathroomOptions"
                             [class.selected]="bookingForm.get('bathrooms')?.value === option.value"
                             (click)="selectDropdownOption('bathrooms', option.value)">
                          {{option.label}}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="form-section stagger-3">
                <h3>Services Additionnels</h3>
                <div class="additional-services">
                  <label class="service-checkbox" *ngFor="let addon of additionalServices; let i = index"
                         [class]="'stagger-' + (i + 4)">
                    <input type="checkbox"
                           [formControlName]="'addon_' + addon.id"
                           (change)="updateTotalPrice()">
                    <span class="checkmark"></span>
                    <div class="addon-info">
                      <div class="addon-name">{{addon.name}}</div>
                      <div class="addon-price">+{{addon.price}}$</div>
                    </div>
                  </label>
                </div>
              </div>

              <div class="form-section stagger-4">
                <h3>Instructions Spéciales</h3>
                <div class="form-group">
                  <textarea formControlName="specialInstructions"
                           class="form-control"
                           rows="4"
                           placeholder="Avez-vous des instructions particulières, des zones à éviter, ou des demandes spéciales?">
                  </textarea>
                </div>
              </div>
            </div>

            <div class="step-actions">
              <button type="button" class="btn btn-secondary" (click)="previousStep()">
                Retour
              </button>
              <button type="button" class="btn btn-primary btn-lg" (click)="nextStep()">
                Continuer vers la Planification
              </button>
            </div>
          </div>

          <!-- Step 3: Date & Time -->
          <div class="form-step" *ngIf="currentStep === 3">
            <div class="step-header">
              <h2>Choisissez Date et Heure</h2>
              <p>Sélectionnez votre créneau préféré</p>
            </div>

            <div class="datetime-selection">
              <div class="calendar-section">
                <h3>Date Préférée</h3>
                <input type="date"
                       formControlName="preferredDate"
                       class="form-control date-picker"
                       [min]="getTomorrowDate()">
              </div>

              <div class="time-slots-section">
                <h3>Créneaux Disponibles</h3>
                <div class="time-slots">
                  <button type="button"
                          class="time-slot-btn"
                          *ngFor="let slot of timeSlots"
                          [disabled]="!slot.available"
                          [class.selected]="selectedTimeSlot === slot.time"
                          (click)="selectTimeSlot(slot.time)">
                    {{slot.time}}
                    <span class="slot-status" *ngIf="!slot.available">(Occupé)</span>
                  </button>
                </div>
              </div>

              <div class="frequency-section">
                <h3>Fréquence du Service</h3>
                <div class="frequency-options">
                  <label class="frequency-option" *ngFor="let freq of frequencyOptions">
                    <input type="radio"
                           name="frequency"
                           [value]="freq.value"
                           formControlName="frequency">
                    <span class="radio-custom"></span>
                    <div class="freq-info">
                      <div class="freq-name">{{freq.name}}</div>
                      <div class="freq-discount" *ngIf="freq.discount">{{freq.discount}}</div>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            <div class="step-actions">
              <button type="button" class="btn btn-secondary" (click)="previousStep()">
                Retour
              </button>
              <button type="button"
                      class="btn btn-primary btn-lg"
                      [disabled]="!selectedTimeSlot"
                      (click)="nextStep()">
                Continuer vers les Informations
              </button>
            </div>
          </div>

          <!-- Step 4: Contact Information -->
          <div class="form-step" *ngIf="currentStep === 4">
            <div class="step-header">
              <h2>Vos Informations</h2>
              <p>Complétez vos coordonnées pour finaliser la réservation</p>
            </div>

            <div class="contact-info-section">
              <div class="form-row">
                <div class="form-group">
                  <label for="firstName">Prénom *</label>
                  <input type="text" formControlName="firstName" id="firstName"
                         class="form-control" required>
                </div>
                <div class="form-group">
                  <label for="lastName">Nom de famille *</label>
                  <input type="text" formControlName="lastName" id="lastName"
                         class="form-control" required>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="email">Courriel *</label>
                  <input type="email" formControlName="email" id="email"
                         class="form-control" required>
                </div>
                <div class="form-group">
                  <label for="phone">Téléphone *</label>
                  <input type="tel" formControlName="phone" id="phone"
                         class="form-control" placeholder="(514) 123-4567" required>
                </div>
              </div>

              <div class="form-group">
                <label for="address">Adresse complète *</label>
                <textarea formControlName="address" id="address"
                         class="form-control"
                         rows="3"
                         placeholder="Adresse, ville, code postal"
                         required>
                </textarea>
              </div>

              <div class="preferences-section">
                <h3>Préférences de Communication</h3>
                <div class="checkbox-group">
                  <label class="checkbox-label">
                    <input type="checkbox" formControlName="smsReminders">
                    <span class="checkmark"></span>
                    Recevoir des rappels par SMS
                  </label>
                  <label class="checkbox-label">
                    <input type="checkbox" formControlName="emailUpdates">
                    <span class="checkmark"></span>
                    Recevoir des mises à jour par courriel
                  </label>
                </div>
              </div>
            </div>

            <div class="step-actions">
              <button type="button" class="btn btn-secondary" (click)="previousStep()">
                Retour
              </button>
              <button type="button" class="btn btn-primary btn-lg" (click)="nextStep()">
                Voir le Résumé
              </button>
            </div>
          </div>

          <!-- Step 5: Confirmation -->
          <div class="form-step" *ngIf="currentStep === 5">
            <div class="step-header">
              <h2>Confirmation de Réservation</h2>
              <p>Vérifiez les détails avant de confirmer</p>
            </div>

            <div class="booking-summary">
              <div class="summary-section">
                <h3>Service Sélectionné</h3>
                <div class="service-summary">
                  <div class="summary-item">
                    <span class="service-icon">{{selectedService?.icon}}</span>
                    <div>
                      <div class="item-name">{{selectedService?.name}}</div>
                      <div class="item-details">{{selectedService?.duration}}</div>
                    </div>
                    <div class="item-price">{{selectedService?.basePrice}}$</div>
                  </div>
                </div>
              </div>

              <div class="summary-section" *ngIf="getSelectedAddons().length > 0">
                <h3>Services Additionnels</h3>
                <div class="addons-summary">
                  <div class="summary-item" *ngFor="let addon of getSelectedAddons()">
                    <span>{{addon.name}}</span>
                    <span>+{{addon.price}}$</span>
                  </div>
                </div>
              </div>

              <div class="summary-section">
                <h3>Date et Heure</h3>
                <div class="datetime-summary">
                  <div class="summary-item">
                    <span>📅 Date:</span>
                    <span>{{formatDate(bookingForm.get('preferredDate')?.value)}}</span>
                  </div>
                  <div class="summary-item">
                    <span>⏰ Heure:</span>
                    <span>{{selectedTimeSlot}}</span>
                  </div>
                  <div class="summary-item">
                    <span>🔄 Fréquence:</span>
                    <span>{{getFrequencyName()}}</span>
                  </div>
                </div>
              </div>

              <div class="total-section">
                <div class="total-item">
                  <span>Sous-total:</span>
                  <span>{{calculateSubtotal()}}$</span>
                </div>
                <div class="total-item" *ngIf="getTaxAmount() > 0">
                  <span>Taxes (TPS + TVQ):</span>
                  <span>{{getTaxAmount()}}$</span>
                </div>
                <div class="total-item total-final">
                  <span>Total:</span>
                  <span>{{calculateTotal()}}$</span>
                </div>
              </div>
            </div>

            <div class="step-actions">
              <button type="button" class="btn btn-secondary" (click)="previousStep()">
                Modifier
              </button>
              <button type="submit"
                      class="btn btn-primary btn-lg"
                      [disabled]="isSubmitting"
                      (click)="confirmBooking()">
                <span *ngIf="!isSubmitting">✅ Confirmer la Réservation</span>
                <span *ngIf="isSubmitting">⏳ Traitement...</span>
              </button>
            </div>
          </div>

        </form>
      </div>
    </section>
  `,
  styles: [`
    /* Booking Header */
    .booking-header {
      background: linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%);
      color: var(--pure-white);
      padding: var(--space-4xl) 0;
    }

    .header-content h1 {
      font-size: clamp(2.5rem, 5vw, 3.5rem);
      margin-bottom: var(--space-lg);
      color: var(--pure-white);
      font-weight: var(--font-weight-bold);
      letter-spacing: -0.02em;
    }

    .header-content p {
      font-size: clamp(1.1rem, 2vw, 1.3rem);
      opacity: 0.95;
      margin-bottom: var(--space-2xl);
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
    }

    /* Progress Steps - Apple Style */
    .booking-progress {
      margin-top: var(--space-3xl);
      padding: var(--space-2xl) 0;
      background: rgba(255, 255, 255, 0.05);
      border-radius: var(--radius-2xl);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .progress-steps {
      display: flex;
      justify-content: space-between;
      max-width: 1000px;
      margin: 0 auto;
      position: relative;
      padding: 0 var(--space-lg);
    }

    .progress-steps::before {
      content: '';
      position: absolute;
      top: 22px;
      left: var(--space-3xl);
      right: var(--space-3xl);
      height: 3px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: var(--radius-full);
      z-index: 1;
    }

    .progress-line {
      position: absolute;
      top: 22px;
      left: var(--space-3xl);
      height: 3px;
      background: linear-gradient(90deg, var(--pure-white), rgba(255, 255, 255, 0.8));
      border-radius: var(--radius-full);
      z-index: 2;
      transition: width 0.6s cubic-bezier(0.16, 1, 0.3, 1);
      width: 0;
    }

    .step {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      position: relative;
      z-index: 3;
      flex: 1;
      max-width: 120px;
      transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
      transform: scale(0.95);
      opacity: 0.7;
    }

    .step.active,
    .step.completed {
      transform: scale(1);
      opacity: 1;
    }

    .step-number {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.2);
      border: 2px solid rgba(255, 255, 255, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 16px;
      color: rgba(255, 255, 255, 0.8);
      transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      backdrop-filter: blur(10px);
      margin-bottom: var(--space-md);
    }

    .step.active .step-number {
      background: var(--pure-white);
      color: var(--primary);
      border-color: var(--pure-white);
      box-shadow: 0 8px 30px rgba(255, 255, 255, 0.3);
      transform: scale(1.1);
    }

    .step.completed .step-number {
      background: var(--pure-white);
      color: var(--primary);
      border-color: var(--pure-white);
      box-shadow: 0 4px 20px rgba(255, 255, 255, 0.2);
    }


    .step-info {
      flex: 1;
    }

    .step-title {
      font-weight: 600;
      font-size: 15px;
      margin-bottom: 4px;
      color: var(--pure-white);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      letter-spacing: -0.01em;
    }

    .step-description {
      font-size: 13px;
      color: rgba(255, 255, 255, 0.8);
      line-height: 1.3;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      letter-spacing: -0.01em;
    }

    .step:not(.active):not(.completed) .step-title,
    .step:not(.active):not(.completed) .step-description {
      color: rgba(255, 255, 255, 0.6);
    }

    /* Form Steps */
    .booking-form-section {
      padding: var(--space-5xl) 0;
      background: rgba(248, 249, 250, 0.8);
      min-height: 70vh;
    }

    .form-step {
      max-width: 1000px;
      margin: 0 auto;
      padding: 0 var(--space-lg);
      opacity: 0;
      transform: translateY(40px);
      animation: slideInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    @keyframes slideInUp {
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    /* Stagger animations */
    .stagger-1 {
      animation-delay: 0.1s;
    }

    .stagger-2 {
      animation-delay: 0.2s;
    }

    .stagger-3 {
      animation-delay: 0.3s;
    }

    .stagger-4 {
      animation-delay: 0.4s;
    }

    .stagger-5 {
      animation-delay: 0.5s;
    }

    .stagger-6 {
      animation-delay: 0.6s;
    }

    .step-header {
      text-align: center;
      margin-bottom: var(--space-4xl);
      padding: var(--space-2xl) 0;
    }

    .step-header h2 {
      margin-bottom: 16px;
      color: var(--neutral-dark);
      font-size: clamp(2rem, 4vw, 2.8rem);
      font-weight: 700;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      letter-spacing: -0.025em;
      line-height: 1.1;
    }

    .step-header p {
      color: rgba(60, 60, 67, 0.8);
      font-size: 19px;
      max-width: 600px;
      margin: 0 auto;
      line-height: 1.4;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      letter-spacing: -0.022em;
      font-weight: 400;
    }

    /* Service Selection */
    .services-selection {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
      gap: var(--space-2xl);
      margin-bottom: var(--space-3xl);
    }

    .service-option {
      cursor: pointer;
      transition: all var(--transition-base);
      position: relative;
      border: 1px solid rgba(212, 165, 116, 0.2);
      background: var(--pure-white);
      padding: var(--space-xl);
      border-radius: var(--radius-lg);
    }

    .service-option:hover {
      transform: translateY(-8px);
      box-shadow: var(--shadow-large);
      border-color: var(--primary);
    }

    .service-option.selected {
      border-color: var(--primary);
      background: var(--secondary);
      box-shadow: var(--shadow-medium);
    }

    .service-option.popular {
      border-color: var(--accent);
    }

    .service-badge {
      position: absolute;
      top: var(--space-md);
      right: var(--space-md);
      background: var(--accent);
      color: var(--pure-white);
      padding: var(--space-xs) var(--space-sm);
      border-radius: var(--radius-md);
      font-size: 0.75rem;
      font-weight: var(--font-weight-bold);
      box-shadow: var(--shadow-soft);
    }

    .service-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: var(--space-md);
    }

    .service-icon {
      font-size: 2.8rem;
      line-height: 1;
    }

    .service-pricing {
      text-align: right;
    }

    .price {
      display: block;
      font-size: 1.3rem;
      font-weight: var(--font-weight-bold);
      color: var(--primary);
      line-height: 1.2;
    }

    .duration {
      font-size: 0.875rem;
      color: var(--neutral-medium);
      margin-top: var(--space-xs);
    }

    .service-option h3 {
      color: var(--neutral-dark);
      margin-bottom: var(--space-sm);
      font-size: 1.25rem;
    }

    .service-description {
      margin-bottom: var(--space-lg);
      color: var(--neutral-medium);
      line-height: 1.5;
    }

    .service-features {
      list-style: none;
    }

    .service-features li {
      display: flex;
      align-items: center;
      gap: var(--space-sm);
      margin-bottom: var(--space-xs);
      font-size: 0.95rem;
      color: var(--neutral-medium);
    }

    .check-icon {
      color: var(--success);
      font-weight: var(--font-weight-bold);
      width: 16px;
      flex-shrink: 0;
    }

    /* Form Sections */
    .form-sections {
      display: grid;
      gap: 32px;
    }

    .form-section {
      background: var(--pure-white);
      padding: 32px;
      border-radius: 16px;
      box-shadow: 0 2px 20px rgba(0, 0, 0, 0.06);
      border: 1px solid rgba(0, 0, 0, 0.05);
    }

    .form-section h3 {
      margin-bottom: 24px;
      color: var(--neutral-dark);
      font-size: 22px;
      font-weight: 600;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      letter-spacing: -0.022em;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }

    .form-group {
      margin-bottom: 24px;
    }

    .form-group label {
      display: block;
      margin-bottom: 8px;
      font-weight: 500;
      color: var(--neutral-dark);
      font-size: 17px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      letter-spacing: -0.022em;
    }

    .form-control {
      width: 100%;
      padding: 16px 20px;
      border: 1px solid rgba(0, 0, 0, 0.1);
      border-radius: 12px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 17px;
      font-weight: 400;
      background: rgba(255, 255, 255, 0.8);
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
      color: var(--neutral-dark);
      letter-spacing: -0.022em;
      backdrop-filter: blur(10px);
    }

    .form-control:focus {
      outline: none;
      border-color: #007AFF;
      box-shadow: 0 0 0 4px rgba(0, 122, 255, 0.1);
      background: var(--pure-white);
      transform: translateY(-1px);
    }

    .form-control::placeholder {
      color: rgba(60, 60, 67, 0.6);
      font-weight: 400;
    }


    /* Input Styling */
    input.form-control {
      font-variant-numeric: tabular-nums;
    }

    input.form-control[type="number"] {
      -moz-appearance: textfield;
    }

    input.form-control[type="number"]::-webkit-outer-spin-button,
    input.form-control[type="number"]::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    textarea.form-control {
      resize: vertical;
      min-height: 120px;
      line-height: 1.5;
    }

    /* Custom Dropdown Styles */
    .custom-dropdown {
      position: relative;
      width: 100%;
    }

    .custom-dropdown {
      position: relative;
    }

    .dropdown-trigger {
      width: 100%;
      padding: 16px 20px;
      border: 1px solid rgba(0, 0, 0, 0.1);
      border-radius: 12px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 17px;
      font-weight: 400;
      background: rgba(255, 255, 255, 0.8);
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
      color: var(--neutral-dark);
      letter-spacing: -0.022em;
      backdrop-filter: blur(10px);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: space-between;
      user-select: none;
    }

    .dropdown-trigger:hover {
      background-color: rgba(255, 255, 255, 0.95);
      border-color: rgba(0, 0, 0, 0.2);
    }

    .custom-dropdown.open .dropdown-trigger {
      border-color: #007AFF;
      box-shadow: 0 0 0 4px rgba(0, 122, 255, 0.1);
      background: var(--pure-white);
      transform: translateY(-1px);
    }

    .selected-text {
      flex: 1;
      text-align: left;
      color: var(--neutral-dark);
    }

    .dropdown-trigger .selected-text:empty::before,
    .dropdown-trigger .selected-text:contains('Sélectionnez') {
      color: rgba(60, 60, 67, 0.6);
    }

    .dropdown-icon {
      color: rgba(60, 60, 67, 0.6);
      transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
      flex-shrink: 0;
      margin-left: 12px;
    }

    .dropdown-icon.rotated {
      transform: rotate(180deg);
      color: #007AFF;
    }

    .dropdown-menu {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      z-index: 1000;
      background: var(--pure-white);
      border: 1px solid rgba(0, 0, 0, 0.1);
      border-radius: 12px;
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
      backdrop-filter: blur(20px);
      margin-top: 4px;
      max-height: 240px;
      overflow-y: auto;
      animation: dropdownSlideIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    @keyframes dropdownSlideIn {
      from {
        opacity: 0;
        transform: translateY(-8px) scale(0.95);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    .dropdown-option {
      padding: 14px 20px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 17px;
      color: var(--neutral-dark);
      cursor: pointer;
      transition: all 0.15s ease;
      letter-spacing: -0.022em;
      border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    }

    .dropdown-option:last-child {
      border-bottom: none;
    }

    .dropdown-option:hover {
      background: rgba(0, 122, 255, 0.05);
      color: #007AFF;
    }

    .dropdown-option.selected {
      background: rgba(0, 122, 255, 0.1);
      color: #007AFF;
      font-weight: 500;
    }

    .dropdown-option.selected::after {
      content: '✓';
      float: right;
      color: #007AFF;
      font-weight: 600;
    }

    /* Additional Services */
    .additional-services {
      display: grid;
      gap: 12px;
    }

    .service-checkbox {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px 20px;
      border: 1px solid rgba(0, 0, 0, 0.1);
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
      background: rgba(255, 255, 255, 0.8);
      backdrop-filter: blur(10px);
    }

    .service-checkbox:hover {
      border-color: rgba(0, 0, 0, 0.2);
      background: rgba(255, 255, 255, 0.95);
      transform: translateY(-1px);
    }

    .service-checkbox input:checked + .checkmark + .addon-info {
      color: #007AFF;
    }

    .service-checkbox input[type="checkbox"] {
      position: absolute;
      opacity: 0;
      cursor: pointer;
      height: 0;
      width: 0;
    }

    .checkmark {
      height: 20px;
      width: 20px;
      background-color: transparent;
      border: 2px solid rgba(60, 60, 67, 0.3);
      border-radius: 6px;
      position: relative;
      flex-shrink: 0;
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .service-checkbox input[type="checkbox"]:checked ~ .checkmark {
      background-color: var(--primary-green);
      border-color: var(--primary-green);
    }

    .checkmark:after {
      content: "";
      position: absolute;
      display: none;
      left: 6px;
      top: 2px;
      width: 6px;
      height: 10px;
      border: solid white;
      border-width: 0 2px 2px 0;
      transform: rotate(45deg);
    }

    .service-checkbox input[type="checkbox"]:checked ~ .checkmark:after {
      display: block;
    }

    .addon-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex: 1;
    }

    .addon-name {
      font-weight: var(--font-weight-medium);
      color: var(--neutral-dark);
    }

    .addon-price {
      font-weight: var(--font-weight-semibold);
      color: var(--primary);
      font-size: 0.95rem;
    }

    /* DateTime Selection */
    .datetime-selection {
      display: grid;
      gap: 32px;
    }

    .calendar-section,
    .time-slots-section,
    .frequency-section {
      background: var(--pure-white);
      padding: 32px;
      border-radius: 16px;
      box-shadow: 0 2px 20px rgba(0, 0, 0, 0.06);
      border: 1px solid rgba(0, 0, 0, 0.05);
      backdrop-filter: blur(10px);
    }

    .calendar-section h3,
    .time-slots-section h3,
    .frequency-section h3 {
      color: var(--neutral-dark);
      margin-bottom: 24px;
      font-size: 22px;
      font-weight: 600;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      letter-spacing: -0.022em;
    }

    .date-picker {
      max-width: 300px;
    }

    .time-slots {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
      gap: var(--space-md);
    }

    .time-slot-btn {
      padding: var(--space-md);
      border: 1px solid rgba(212, 165, 116, 0.3);
      border-radius: var(--radius-md);
      background: var(--neutral-lightest);
      cursor: pointer;
      transition: all var(--transition-base);
      font-weight: var(--font-weight-medium);
    }

    .time-slot-btn:hover:not(:disabled) {
      border-color: var(--primary);
      background: var(--pure-white);
    }

    .time-slot-btn.selected {
      background: var(--primary);
      color: var(--pure-white);
      border-color: var(--primary);
      box-shadow: var(--shadow-soft);
    }

    .time-slot-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      background: var(--neutral-lightest);
    }

    .frequency-options {
      display: grid;
      gap: var(--space-md);
    }

    .frequency-option {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px 20px;
      border: 1px solid rgba(0, 0, 0, 0.1);
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
      background: rgba(255, 255, 255, 0.8);
      backdrop-filter: blur(10px);
    }

    .frequency-option:hover {
      border-color: rgba(0, 0, 0, 0.2);
      background: rgba(255, 255, 255, 0.95);
      transform: translateY(-1px);
    }

    .frequency-option input[type="radio"]:checked ~ .freq-info {
      color: #007AFF;
    }

    .frequency-option input[type="radio"] {
      position: absolute;
      opacity: 0;
      cursor: pointer;
      height: 0;
      width: 0;
    }

    .radio-custom {
      height: 20px;
      width: 20px;
      background-color: transparent;
      border: 2px solid rgba(60, 60, 67, 0.3);
      border-radius: 50%;
      position: relative;
      flex-shrink: 0;
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .frequency-option input[type="radio"]:checked ~ .radio-custom {
      border-color: #007AFF;
    }

    .radio-custom:after {
      content: "";
      position: absolute;
      display: none;
      top: 4px;
      left: 4px;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--primary-green);
    }

    .frequency-option input[type="radio"]:checked ~ .radio-custom:after {
      display: block;
    }

    .freq-info {
      flex: 1;
    }

    .freq-name {
      font-weight: var(--font-weight-medium);
      color: var(--neutral-dark);
      margin-bottom: var(--space-xs);
    }

    .freq-discount {
      font-size: 0.875rem;
      color: var(--success);
      font-weight: var(--font-weight-semibold);
    }

    /* Contact Information */
    .contact-info-section {
      background: var(--pure-white);
      padding: 32px;
      border-radius: 16px;
      box-shadow: 0 2px 20px rgba(0, 0, 0, 0.06);
      border: 1px solid rgba(0, 0, 0, 0.05);
      backdrop-filter: blur(10px);
    }

    .preferences-section {
      margin-top: 32px;
      padding-top: 32px;
      border-top: 1px solid rgba(0, 0, 0, 0.1);
    }

    .preferences-section h3 {
      color: var(--neutral-dark);
      margin-bottom: 20px;
      font-size: 22px;
      font-weight: 600;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      letter-spacing: -0.022em;
    }

    .checkbox-group {
      display: grid;
      gap: var(--space-md);
    }

    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 12px;
      cursor: pointer;
      color: var(--neutral-dark);
      font-weight: 400;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 17px;
      letter-spacing: -0.022em;
      padding: 12px 0;
      transition: color 0.2s ease;
    }

    .checkbox-label:hover {
      color: #007AFF;
    }

    .checkbox-label input[type="checkbox"] {
      position: absolute;
      opacity: 0;
      cursor: pointer;
      height: 0;
      width: 0;
    }

    .checkbox-label .checkmark {
      height: 20px;
      width: 20px;
      background-color: transparent;
      border: 2px solid rgba(60, 60, 67, 0.3);
      border-radius: 6px;
      position: relative;
      flex-shrink: 0;
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .checkbox-label input[type="checkbox"]:checked ~ .checkmark {
      background-color: var(--primary-green);
      border-color: var(--primary-green);
    }

    .checkbox-label .checkmark:after {
      content: "";
      position: absolute;
      display: none;
      left: 6px;
      top: 2px;
      width: 6px;
      height: 10px;
      border: solid white;
      border-width: 0 2px 2px 0;
      transform: rotate(45deg);
    }

    .checkbox-label input[type="checkbox"]:checked ~ .checkmark:after {
      display: block;
    }

    /* Booking Summary */
    .booking-summary {
      background: var(--pure-white);
      border-radius: 16px;
      box-shadow: 0 2px 20px rgba(0, 0, 0, 0.06);
      border: 1px solid rgba(0, 0, 0, 0.05);
      overflow: hidden;
      backdrop-filter: blur(10px);
    }

    .summary-section {
      padding: 32px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    }

    .summary-section:last-child {
      border-bottom: none;
    }

    .summary-section h3 {
      margin-bottom: 20px;
      color: var(--neutral-dark);
      font-size: 22px;
      font-weight: 600;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      letter-spacing: -0.022em;
    }

    .summary-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--space-md) 0;
      color: var(--neutral-dark);
    }

    .item-name {
      font-weight: var(--font-weight-semibold);
    }

    .item-details {
      font-size: 0.875rem;
      color: var(--neutral-medium);
      margin-top: var(--space-xs);
    }

    .item-price {
      font-weight: var(--font-weight-semibold);
      color: var(--primary);
    }

    .total-section {
      background: var(--secondary);
      padding: var(--space-xl);
    }

    .total-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--space-sm) 0;
      color: var(--neutral-dark);
    }

    .total-final {
      font-size: 1.3rem;
      font-weight: var(--font-weight-bold);
      color: var(--primary);
      border-top: 2px solid var(--primary);
      margin-top: var(--space-md);
      padding-top: var(--space-md);
    }

    /* Step Actions - Apple Style Buttons */
    .step-actions {
      display: flex;
      gap: 16px;
      justify-content: center;
      margin-top: var(--space-3xl);
      flex-wrap: wrap;
    }

    .step-actions .btn {
      min-width: 200px;
      padding: 16px 32px;
      border: none;
      border-radius: var(--radius-full);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 17px;
      font-weight: 500;
      letter-spacing: -0.022em;
      cursor: pointer;
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      text-align: center;
    }

    .btn-primary {
      background: linear-gradient(135deg, var(--viridian) 0%, var(--cambridge-blue) 100%);
      color: var(--pure-white);
      border: 2px solid transparent;
      box-shadow: var(--shadow-soft);
    }

    .btn-primary:hover:not(:disabled) {
      background: linear-gradient(135deg, var(--cambridge-blue) 0%, var(--viridian) 100%);
      transform: translateY(-3px) scale(1.02);
      box-shadow: var(--shadow-large);
    }

    .btn-primary:active:not(:disabled) {
      transform: translateY(-1px) scale(1.01);
      box-shadow: var(--shadow-medium);
    }

    .btn-secondary {
      background: rgba(255, 255, 255, 0.9);
      color: var(--viridian);
      border: 2px solid var(--cambridge-blue);
      backdrop-filter: blur(10px);
    }

    .btn-secondary:hover:not(:disabled) {
      background: var(--cambridge-blue);
      color: var(--pure-white);
      transform: translateY(-3px) scale(1.02);
      box-shadow: var(--shadow-medium);
      border-color: var(--viridian);
    }

    .btn-lg {
      padding: 18px 36px;
      font-size: 19px;
      min-width: 220px;
    }

    .btn:disabled {
      opacity: 0.4;
      cursor: not-allowed;
      transform: none !important;
      box-shadow: none !important;
    }

    /* Mobile Responsive */
    @media (max-width: 1024px) {
      .services-selection {
        grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      }
    }

    @media (max-width: 768px) {
      .booking-header {
        padding: var(--space-3xl) 0;
      }

      .booking-progress {
        padding: var(--space-lg) 0;
        margin-top: var(--space-2xl);
      }

      .progress-steps {
        flex-direction: column;
        gap: var(--space-lg);
        padding: 0 var(--space-md);
      }

      .progress-steps::before,
      .progress-line {
        display: none;
      }

      .step {
        flex-direction: row;
        text-align: left;
        max-width: none;
        transform: scale(1);
        opacity: 1;
      }

      .step-number {
        margin-bottom: 0;
        margin-right: var(--space-md);
        width: 36px;
        height: 36px;
        font-size: 14px;
      }

      .step.active .step-number {
        transform: scale(1);
      }

      .services-selection {
        grid-template-columns: 1fr;
        gap: var(--space-lg);
      }

      .form-row {
        grid-template-columns: 1fr;
      }

      .time-slots {
        grid-template-columns: repeat(auto-fit, minmax(110px, 1fr));
      }

      .step-actions {
        flex-direction: column;
        align-items: center;
      }

      .step-actions .btn {
        width: 100%;
        max-width: 300px;
      }
    }

    @media (max-width: 640px) {
      .time-slots {
        grid-template-columns: repeat(2, 1fr);
      }
    }
  `]
})
export class BookingComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('bookingHeader') bookingHeader!: ElementRef;
  @ViewChild('bookingFormSection') bookingFormSection!: ElementRef;

  bookingForm!: FormGroup;
  currentStep = 1;
  selectedService: ServiceOption | null = null;
  selectedTimeSlot: string = '';
  isSubmitting = false;

  isHeaderVisible = false;
  isFormVisible = false;

  // Custom dropdown states
  dropdownStates: {[key: string]: boolean} = {
    propertyType: false,
    bedrooms: false,
    bathrooms: false
  };

  // Dropdown options
  propertyTypeOptions = [
    { value: '', label: 'Sélectionnez' },
    { value: 'apartment', label: 'Appartement' },
    { value: 'house', label: 'Maison' },
    { value: 'condo', label: 'Condo' },
    { value: 'office', label: 'Bureau' },
    { value: 'commercial', label: 'Commercial' }
  ];

  bedroomOptions = [
    { value: '', label: 'Sélectionnez' },
    { value: '0', label: 'Studio' },
    { value: '1', label: '1 chambre' },
    { value: '2', label: '2 chambres' },
    { value: '3', label: '3 chambres' },
    { value: '4', label: '4 chambres' },
    { value: '5+', label: '5+ chambres' }
  ];

  bathroomOptions = [
    { value: '', label: 'Sélectionnez' },
    { value: '1', label: '1 salle de bain' },
    { value: '1.5', label: '1.5 salle de bain' },
    { value: '2', label: '2 salles de bain' },
    { value: '2.5', label: '2.5 salles de bain' },
    { value: '3+', label: '3+ salles de bain' }
  ];

  bookingSteps: BookingStep[] = [
    { id: 1, title: 'Service', description: 'Choisir le service', completed: false },
    { id: 2, title: 'Détails', description: 'Informations propriété', completed: false },
    { id: 3, title: 'Planning', description: 'Date et heure', completed: false },
    { id: 4, title: 'Contact', description: 'Vos informations', completed: false },
    { id: 5, title: 'Confirmation', description: 'Finaliser', completed: false }
  ];

  serviceOptions: ServiceOption[] = [
    {
      id: 'residential',
      name: 'Nettoyage Résidentiel',
      description: 'Service complet pour votre domicile',
      basePrice: 120,
      duration: '2-3 heures',
      icon: '🏠',
      features: ['Toutes les pièces', 'Salle de bain', 'Cuisine', 'Aspirateur'],
      popular: true
    },
    {
      id: 'commercial',
      name: 'Nettoyage Commercial',
      description: 'Solutions pour entreprises',
      basePrice: 200,
      duration: '3-5 heures',
      icon: '🏢',
      features: ['Bureaux', 'Sanitaires', 'Espaces communs', 'Désinfection']
    },
    {
      id: 'deep-cleaning',
      name: 'Nettoyage en Profondeur',
      description: 'Service intensif et détaillé',
      basePrice: 280,
      duration: '4-5 heures',
      icon: '✨',
      features: ['Nettoyage complet', 'Intérieur appareils', 'Plinthes', 'Luminaires']
    }
  ];

  additionalServices = [
    { id: 'windows', name: 'Nettoyage des vitres intérieures', price: 30 },
    { id: 'oven', name: 'Nettoyage du four', price: 25 },
    { id: 'fridge', name: 'Nettoyage du réfrigérateur', price: 35 },
    { id: 'basement', name: 'Nettoyage du sous-sol', price: 50 },
    { id: 'garage', name: 'Nettoyage du garage', price: 40 }
  ];

  timeSlots: TimeSlot[] = [
    { time: '08:00', available: true },
    { time: '09:00', available: true },
    { time: '10:00', available: false },
    { time: '11:00', available: true },
    { time: '13:00', available: true },
    { time: '14:00', available: true },
    { time: '15:00', available: false },
    { time: '16:00', available: true }
  ];

  frequencyOptions = [
    { value: 'one-time', name: 'Une fois seulement', discount: '' },
    { value: 'weekly', name: 'Hebdomadaire', discount: '15% de rabais' },
    { value: 'bi-weekly', name: 'Aux deux semaines', discount: '10% de rabais' },
    { value: 'monthly', name: 'Mensuel', discount: '5% de rabais' }
  ];

  constructor(
    private formBuilder: FormBuilder,
    @Inject(PLATFORM_ID) private platformId: Object,
    private scrollAnimationService: ScrollAnimationService
  ) {}

  ngOnInit() {
    this.initializeForm();
    if (isPlatformBrowser(this.platformId)) {
      // Initialize header visibility immediately
      setTimeout(() => {
        this.isHeaderVisible = true;
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
        element: this.bookingFormSection.nativeElement,
        callback: () => { this.isFormVisible = true; }
      }
    ];

    this.scrollAnimationService.initializeAnimations(elements);
  }

  initializeForm() {
    const formControls: any = {
      // Step 1
      service: [''],

      // Step 2
      propertyType: [''],
      propertySize: [''],
      bedrooms: [''],
      bathrooms: [''],
      specialInstructions: [''],

      // Step 3
      preferredDate: [''],
      timeSlot: [''],
      frequency: ['one-time'],

      // Step 4
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      address: ['', Validators.required],
      smsReminders: [false],
      emailUpdates: [true]
    };

    // Add addon controls
    this.additionalServices.forEach(addon => {
      formControls[`addon_${addon.id}`] = [false];
    });

    this.bookingForm = this.formBuilder.group(formControls);
  }

  selectService(service: ServiceOption) {
    this.selectedService = service;
    this.bookingForm.patchValue({ service: service.id });
  }

  selectTimeSlot(time: string) {
    this.selectedTimeSlot = time;
    this.bookingForm.patchValue({ timeSlot: time });
  }

  nextStep() {
    if (this.currentStep < 5) {
      this.bookingSteps[this.currentStep - 1].completed = true;
      this.currentStep++;
    }
  }

  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  getTomorrowDate(): string {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  }

  getSelectedAddons() {
    return this.additionalServices.filter(addon =>
      this.bookingForm.get(`addon_${addon.id}`)?.value
    );
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'Non sélectionnée';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-CA', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  getFrequencyName(): string {
    const frequency = this.bookingForm.get('frequency')?.value;
    const option = this.frequencyOptions.find(opt => opt.value === frequency);
    return option?.name || 'Non sélectionnée';
  }

  calculateSubtotal(): number {
    let total = this.selectedService?.basePrice || 0;

    // Add addon prices
    this.getSelectedAddons().forEach(addon => {
      total += addon.price;
    });

    // Apply frequency discount
    const frequency = this.bookingForm.get('frequency')?.value;
    switch (frequency) {
      case 'weekly':
        total *= 0.85; // 15% discount
        break;
      case 'bi-weekly':
        total *= 0.9; // 10% discount
        break;
      case 'monthly':
        total *= 0.95; // 5% discount
        break;
    }

    return Math.round(total);
  }

  getTaxAmount(): number {
    return Math.round(this.calculateSubtotal() * 0.14975); // QC taxes
  }

  calculateTotal(): number {
    return this.calculateSubtotal() + this.getTaxAmount();
  }

  updateTotalPrice() {
    // Trigger recalculation when addons change
    setTimeout(() => {
      // Force change detection
    });
  }

  confirmBooking() {
    this.isSubmitting = true;

    // Simulate booking process
    setTimeout(() => {
      console.log('Booking confirmed:', this.bookingForm.value);
      alert('Réservation confirmée! Vous recevrez un courriel de confirmation sous peu.');
      this.isSubmitting = false;
      // Redirect to success page or reset form
    }, 3000);
  }

  getProgressPercentage(): number {
    const completedSteps = this.bookingSteps.filter(step => step.completed).length;
    const totalSteps = this.bookingSteps.length - 1; // Don't count the last step for progress line
    return (completedSteps / totalSteps) * 100;
  }

  // Custom dropdown methods
  toggleDropdown(dropdownName: string): void {
    // Close all other dropdowns
    Object.keys(this.dropdownStates).forEach(key => {
      if (key !== dropdownName) {
        this.dropdownStates[key] = false;
      }
    });
    // Toggle the selected dropdown
    this.dropdownStates[dropdownName] = !this.dropdownStates[dropdownName];
  }

  selectDropdownOption(dropdownName: string, value: string): void {
    this.bookingForm.patchValue({[dropdownName]: value});
    this.dropdownStates[dropdownName] = false;
  }

  getSelectedOptionLabel(dropdownName: string, options: any[]): string {
    const currentValue = this.bookingForm.get(dropdownName)?.value;
    const option = options.find(opt => opt.value === currentValue);
    return option?.label || 'Sélectionnez';
  }

  closeAllDropdowns(): void {
    Object.keys(this.dropdownStates).forEach(key => {
      this.dropdownStates[key] = false;
    });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.custom-dropdown')) {
      this.closeAllDropdowns();
    }
  }
}