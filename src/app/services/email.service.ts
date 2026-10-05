import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { SupabaseService, ContactSubmission, BookingRequest } from './supabase.service';

export interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  serviceType?: string;
  propertySize?: string;
  preferredDate?: string;
  message: string;
  urgentRequest: boolean;
}

export interface BookingFormData {
  // Service details
  serviceType: string;
  serviceName: string;
  servicePrice: number;

  // Property details
  propertyType?: string;
  propertySize?: number;
  bedrooms?: number;
  bathrooms?: number;
  address?: string;
  city?: string;
  postalCode?: string;

  // Scheduling
  preferredDate: string;
  preferredTime: string;
  frequency: string;

  // Additional services
  additionalServices?: string[];
  specialInstructions?: string;

  // Contact info
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  contactMethod?: string;

  // Total (0 when quoteRequired)
  subtotal: number;
  taxes: number;
  total: number;

  /** Size range id from the booking form (see AREA_MULTIPLIERS in shared/pricing.ts) */
  propertySizeRange?: string;
  /** How the estimate was computed, so the team can check it */
  estimate?: BookingEstimateDetails;
}

export interface BookingEstimateDetails {
  basePrice: number;
  areaMultiplier: number;
  areaAdjustment: number;
  propertyTypeMultiplier: number;
  propertyTypeAdjustment: number;
  addOnsTotal: number;
  frequencyDiscountRate: number;
  frequencyDiscount: number;
  /** Space over 2500 sq ft: no online price, the team sends a custom quote */
  quoteRequired: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  // Web3Forms Access Key - Public key (safe to expose in frontend)
  private accessKey = '20159e31-e7b0-4071-be4f-d8380f878c7f';

  constructor(
    private http: HttpClient,
    private supabaseService: SupabaseService
  ) {}

  async sendContactForm(formData: ContactFormData, language: 'fr' | 'en' = 'fr'): Promise<{ success: boolean; message: string }> {
    try {
      // 0. Save to database (if configured)
      if (this.supabaseService.isConfigured()) {
        const contactSubmission: ContactSubmission = {
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          service_type: formData.serviceType,
          property_size: formData.propertySize,
          preferred_date: formData.preferredDate,
          message: formData.message,
          urgent_request: formData.urgentRequest,
          language: language
        };

        const dbResult = await this.supabaseService.saveContactSubmission(contactSubmission);
        if (!dbResult.success) {
          console.warn('Failed to save to database, but continuing with email:', dbResult.error);
        }
      }

      // 1. Send detailed email to business (always in French for internal use)
      const businessMessage = `
NOUVELLE DEMANDE DE CONTACT${formData.urgentRequest ? ' - URGENT (48H)' : ''}

Informations du client:
━━━━━━━━━━━━━━━━━━━━━━━━━━
Nom complet: ${formData.firstName} ${formData.lastName}
Email: ${formData.email}
Téléphone: ${formData.phone || 'Non fourni'}

Détails de la demande:
━━━━━━━━━━━━━━━━━━━━━━━━━━
Type de service: ${this.getServiceLabel(formData.serviceType)}
Taille de la propriété: ${this.getSizeLabel(formData.propertySize)}
Date préférée: ${formData.preferredDate || 'Non spécifiée'}
Demande urgente: ${formData.urgentRequest ? '⚠️ OUI - Dans les 48h' : 'Non'}

Message:
━━━━━━━━━━━━━━━━━━━━━━━━━━
${formData.message}

━━━━━━━━━━━━━━━━━━━━━━━━━━
Envoye depuis le formulaire de contact EcoNet Proprete
      `.trim();

      const businessPayload = {
        access_key: this.accessKey,
        subject: `${formData.urgentRequest ? '🚨 URGENT - ' : ''}Nouvelle demande de ${formData.firstName} ${formData.lastName}`,
        from_name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        message: businessMessage,
        to_email: 'econetentretienmenager@gmail.com'
      };

      const businessResponse = await firstValueFrom(
        this.http.post<any>('https://api.web3forms.com/submit', businessPayload)
      );

      if (businessResponse.success) {
        return {
          success: true,
          message: 'Votre demande a été envoyée avec succès!'
        };
      } else {
        throw new Error('Erreur lors de l\'envoi');
      }
    } catch (error: any) {
      console.error('Erreur d\'envoi:', error);
      return {
        success: false,
        message: 'Une erreur est survenue lors de l\'envoi de votre demande.'
      };
    }
  }

  private getServiceLabel(value?: string): string {
    const labels: {[key: string]: string} = {
      'residential': 'Nettoyage résidentiel',
      'commercial': 'Nettoyage commercial',
      'post-construction': 'Nettoyage après construction',
      'deep-cleaning': 'Grand ménage',
      'maintenance': 'Entretien régulier',
      'carpet': 'Nettoyage de tapis',
      'other': 'Autre'
    };
    return labels[value || ''] || 'Non spécifié';
  }

  private getSizeLabel(value?: string): string {
    const labels: {[key: string]: string} = {
      'small': 'Petit (< 1000 pi²)',
      'medium': 'Moyen (1000-2000 pi²)',
      'large': 'Grand (2000-3500 pi²)',
      'xlarge': 'Très grand (> 3500 pi²)'
    };
    return labels[value || ''] || 'Non spécifié';
  }

  private getAreaRangeLabel(value: string): string {
    const labels: {[key: string]: string} = {
      'under_800': 'Moins de 800 pi²',
      '800_1500': '800 à 1500 pi²',
      '1500_2500': '1500 à 2500 pi²',
      'over_2500': 'Plus de 2500 pi² (devis personnalisé)'
    };
    return labels[value] || value;
  }

  private getPropertyTypeLabel(value?: string): string {
    const labels: {[key: string]: string} = {
      'apartment': 'Appartement/Condo',
      'house': 'Maison unifamiliale',
      'townhouse': 'Maison en rangée',
      'office': 'Bureau',
      'retail': 'Commerce de détail'
    };
    return labels[value || ''] || value || 'Non spécifié';
  }

  private getFrequencyLabel(value?: string): string {
    const labels: {[key: string]: string} = {
      'one-time': 'Une fois seulement',
      'weekly': 'Hebdomadaire',
      'bi-weekly': 'Aux 2 semaines',
      'monthly': 'Mensuel'
    };
    return labels[value || ''] || value || 'Non spécifiée';
  }

  /** Itemized estimate so the team sees exactly how the customer's total was computed. */
  private getFinancialSummary(formData: BookingFormData): string {
    const e = formData.estimate;
    const line = '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
    if (!e) {
      return `RÉSUMÉ FINANCIER:\n${line}\nSous-total: ${formData.subtotal}$\nTaxes (TPS + TVQ): ${formData.taxes}$\n${line}\nTOTAL: ${formData.total}$`;
    }
    const pct = (rate: number) => `${Math.round(rate * 100)}%`;
    const rows = [
      `Prix de base: ${e.basePrice}$`,
      `Ajustement superficie (x${e.areaMultiplier}): +${e.areaAdjustment}$`,
      `Ajustement type de propriété (x${e.propertyTypeMultiplier}): +${e.propertyTypeAdjustment}$`,
      `Services additionnels: +${e.addOnsTotal}$`,
      `Rabais fréquence (${pct(e.frequencyDiscountRate)}): -${e.frequencyDiscount}$`,
    ];
    if (e.quoteRequired) {
      return `ESTIMATION (CLIENT):\n${line}\n⚠️ DEVIS PERSONNALISÉ REQUIS - superficie de plus de 2500 pi², aucun prix affiché au client.\n`
        + `Prix de départ du service: ${e.basePrice}$\nAjustement type de propriété: x${e.propertyTypeMultiplier}\n`
        + `Services additionnels: +${e.addOnsTotal}$\nRabais fréquence applicable: ${pct(e.frequencyDiscountRate)}`;
    }
    return `ESTIMATION AFFICHÉE AU CLIENT:\n${line}\n${rows.join('\n')}\nSous-total: ${formData.subtotal}$\nTaxes (TPS + TVQ): ${formData.taxes}$\n${line}\nTOTAL ESTIMÉ: ${formData.total}$\n(Estimation - prix final à confirmer avec le client avant le service)`;
  }

  async sendBookingForm(formData: BookingFormData, language: 'fr' | 'en' = 'fr'): Promise<{ success: boolean; message: string }> {
    try {
      // 0. Save to database (if configured)
      if (this.supabaseService.isConfigured()) {
        const bookingRequest: BookingRequest = {
          service_type: formData.serviceType,
          service_name: formData.serviceName,
          service_price: formData.servicePrice,
          property_type: formData.propertyType,
          property_size: formData.propertySize,
          bedrooms: formData.bedrooms,
          bathrooms: formData.bathrooms,
          address: formData.address,
          city: formData.city,
          postal_code: formData.postalCode,
          preferred_date: formData.preferredDate,
          preferred_time: formData.preferredTime,
          frequency: formData.frequency,
          additional_services: formData.additionalServices,
          special_instructions: formData.specialInstructions,
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          contact_method: formData.contactMethod,
          subtotal: formData.subtotal,
          taxes: formData.taxes,
          total: formData.total,
          language: language
        };

        const dbResult = await this.supabaseService.saveBookingRequest(bookingRequest);
        if (!dbResult.success) {
          console.warn('Failed to save to database, but continuing with email:', dbResult.error);
        }
      }

      // 1. Send detailed booking email to business (always in French for internal use)
      const businessMessage = `
NOUVELLE RÉSERVATION DE SERVICE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

INFORMATIONS CLIENT:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Nom complet: ${formData.firstName} ${formData.lastName}
Email: ${formData.email}
Téléphone: ${formData.phone}
Méthode de contact préférée: ${formData.contactMethod || 'Non spécifiée'}

SERVICE DEMANDÉ:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Type de service: ${formData.serviceName}
Prix de base: ${formData.servicePrice}$

DÉTAILS DE LA PROPRIÉTÉ:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Type: ${this.getPropertyTypeLabel(formData.propertyType)}
Superficie: ${formData.propertySizeRange ? this.getAreaRangeLabel(formData.propertySizeRange) : formData.propertySize ? `${formData.propertySize} pi²` : 'Non spécifiée'}
Chambres: ${formData.bedrooms || 'Non spécifié'}
Salles de bain: ${formData.bathrooms || 'Non spécifiées'}
${formData.address ? `Adresse: ${formData.address}` : ''}
${formData.city ? `Ville: ${formData.city}` : ''}
${formData.postalCode ? `Code postal: ${formData.postalCode}` : ''}

PLANIFICATION:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Date préférée: ${formData.preferredDate}
Heure préférée: ${formData.preferredTime}
Fréquence: ${this.getFrequencyLabel(formData.frequency)}

${formData.additionalServices && formData.additionalServices.length > 0 ? `
SERVICES ADDITIONNELS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${formData.additionalServices.join('\n')}
` : ''}

${formData.specialInstructions ? `
INSTRUCTIONS SPÉCIALES:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${formData.specialInstructions}
` : ''}

${this.getFinancialSummary(formData)}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Reservation effectuee via le site EcoNet Proprete
      `.trim();

      const businessPayload = {
        access_key: this.accessKey,
        subject: `${formData.estimate?.quoteRequired ? 'DEVIS REQUIS - ' : ''}Nouvelle réservation - ${formData.serviceName} - ${formData.firstName} ${formData.lastName}`,
        from_name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        message: businessMessage,
        to_email: 'econetentretienmenager@gmail.com'
      };

      const businessResponse = await firstValueFrom(
        this.http.post<any>('https://api.web3forms.com/submit', businessPayload)
      );

      if (businessResponse.success) {
        return {
          success: true,
          message: 'Votre réservation a été envoyée avec succès!'
        };
      } else {
        throw new Error('Erreur lors de l\'envoi');
      }
    } catch (error: any) {
      console.error('Erreur d\'envoi:', error);
      return {
        success: false,
        message: 'Une erreur est survenue lors de l\'envoi de votre réservation.'
      };
    }
  }
}
