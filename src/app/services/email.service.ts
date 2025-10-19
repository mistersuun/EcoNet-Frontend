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

  // Total
  subtotal: number;
  taxes: number;
  total: number;
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

      // 2. Send confirmation email to customer (in their language)
      const customerMessage = language === 'fr' ? this.getContactConfirmationFR(formData) : this.getContactConfirmationEN(formData);
      const customerSubject = language === 'fr'
        ? 'Confirmation de votre demande - EcoNet Proprete'
        : 'Confirmation of your request - EcoNet Proprete';

      const customerPayload = {
        access_key: this.accessKey,
        subject: customerSubject,
        from_name: 'EcoNet Proprete',
        email: 'econetentretienmenager@gmail.com',
        message: customerMessage,
        to_email: formData.email,
        replyto: 'econetentretienmenager@gmail.com'
      };

      // Send both emails
      const [businessResponse, customerResponse] = await Promise.all([
        firstValueFrom(this.http.post<any>('https://api.web3forms.com/submit', businessPayload)),
        firstValueFrom(this.http.post<any>('https://api.web3forms.com/submit', customerPayload))
      ]);

      if (businessResponse.success && customerResponse.success) {
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
Type: ${formData.propertyType || 'Non spécifié'}
Superficie: ${formData.propertySize || 'Non spécifiée'} pi²
Chambres: ${formData.bedrooms || 'Non spécifié'}
Salles de bain: ${formData.bathrooms || 'Non spécifiées'}
${formData.address ? `Adresse: ${formData.address}` : ''}
${formData.city ? `Ville: ${formData.city}` : ''}
${formData.postalCode ? `Code postal: ${formData.postalCode}` : ''}

PLANIFICATION:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Date préférée: ${formData.preferredDate}
Heure préférée: ${formData.preferredTime}
Fréquence: ${formData.frequency}

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

RÉSUMÉ FINANCIER:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Sous-total: ${formData.subtotal}$
Taxes (TPS + TVQ): ${formData.taxes}$
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TOTAL: ${formData.total}$

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Reservation effectuee via le site EcoNet Proprete
      `.trim();

      const businessPayload = {
        access_key: this.accessKey,
        subject: `Nouvelle réservation - ${formData.serviceName} - ${formData.firstName} ${formData.lastName}`,
        from_name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        message: businessMessage,
        to_email: 'econetentretienmenager@gmail.com'
      };

      // 2. Send confirmation email to customer (in their language)
      const customerMessage = language === 'fr' ? this.getBookingConfirmationFR(formData) : this.getBookingConfirmationEN(formData);
      const customerSubject = language === 'fr'
        ? `Confirmation de reservation - EcoNet Proprete - ${formData.preferredDate}`
        : `Booking Confirmation - EcoNet Proprete - ${formData.preferredDate}`;

      const customerPayload = {
        access_key: this.accessKey,
        subject: customerSubject,
        from_name: 'EcoNet Proprete',
        email: 'econetentretienmenager@gmail.com',
        message: customerMessage,
        to_email: formData.email,
        replyto: 'econetentretienmenager@gmail.com'
      };

      // Send both emails in parallel
      const [businessResponse, customerResponse] = await Promise.all([
        firstValueFrom(this.http.post<any>('https://api.web3forms.com/submit', businessPayload)),
        firstValueFrom(this.http.post<any>('https://api.web3forms.com/submit', customerPayload))
      ]);

      if (businessResponse.success && customerResponse.success) {
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

  // French contact confirmation template
  private getContactConfirmationFR(formData: ContactFormData): string {
    return `
Bonjour ${formData.firstName},

Merci d'avoir contacte EcoNet Proprete!

Nous avons bien recu votre demande de ${formData.urgentRequest ? 'service urgent' : 'renseignements'} et un membre de notre equipe vous contactera sous peu ${formData.urgentRequest ? '(dans les 48 heures)' : ''}.

RESUME DE VOTRE DEMANDE:
━━━━━━━━━━━━━━━━━━━━━━━━━━
Service demande: ${this.getServiceLabel(formData.serviceType)}
${formData.preferredDate ? `Date preferee: ${formData.preferredDate}` : ''}

Votre message:
${formData.message}

━━━━━━━━━━━━━━━━━━━━━━━━━━

Si vous avez des questions urgentes, n'hesitez pas a nous appeler au (514) 123-4567.

Cordialement,
L'equipe EcoNet Proprete

---
📧 econetentretienmenager@gmail.com
📞 (514) 123-4567
🌐 www.econet-proprete.ca
    `.trim();
  }

  // English contact confirmation template
  private getContactConfirmationEN(formData: ContactFormData): string {
    return `
Hello ${formData.firstName},

Thank you for contacting EcoNet Proprete!

We have received your ${formData.urgentRequest ? 'urgent service' : 'information'} request and a member of our team will contact you shortly ${formData.urgentRequest ? '(within 48 hours)' : ''}.

SUMMARY OF YOUR REQUEST:
━━━━━━━━━━━━━━━━━━━━━━━━━━
Service requested: ${this.getServiceLabelEN(formData.serviceType)}
${formData.preferredDate ? `Preferred date: ${formData.preferredDate}` : ''}

Your message:
${formData.message}

━━━━━━━━━━━━━━━━━━━━━━━━━━

If you have urgent questions, don't hesitate to call us at (514) 123-4567.

Best regards,
The EcoNet Proprete Team

---
📧 econetentretienmenager@gmail.com
📞 (514) 123-4567
🌐 www.econet-proprete.ca
    `.trim();
  }

  // French booking confirmation template
  private getBookingConfirmationFR(formData: BookingFormData): string {
    return `
Bonjour ${formData.firstName},

Merci d'avoir choisi EcoNet Proprete!

Nous avons bien recu votre reservation et un membre de notre equipe vous contactera dans les prochaines 24 heures pour confirmer tous les details.

RESUME DE VOTRE RESERVATION:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Service: ${formData.serviceName}
Date souhaitee: ${formData.preferredDate}
Heure souhaitee: ${formData.preferredTime}
Frequence: ${formData.frequency}

${formData.address ? `Adresse: ${formData.address}, ${formData.city || ''}` : ''}

${formData.additionalServices && formData.additionalServices.length > 0 ? `
Services additionnels:
${formData.additionalServices.map(s => `• ${s}`).join('\n')}
` : ''}

MONTANT ESTIME: ${formData.total}$ (taxes incluses)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PROCHAINES ETAPES:
1. Un de nos representants vous contactera pour confirmer la date et l'heure
2. Nous repondrons a toutes vos questions
3. Vous recevrez une confirmation finale par email

Si vous avez des questions ou souhaitez modifier votre reservation, n'hesitez pas a nous contacter:

📞 ${formData.phone}
📧 econetentretienmenager@gmail.com
🌐 www.econet-proprete.ca

Nous avons hate de vous servir!

Cordialement,
L'equipe EcoNet Proprete
Votre partenaire en nettoyage ecologique
    `.trim();
  }

  // English booking confirmation template
  private getBookingConfirmationEN(formData: BookingFormData): string {
    return `
Hello ${formData.firstName},

Thank you for choosing EcoNet Proprete!

We have received your booking and a member of our team will contact you within the next 24 hours to confirm all the details.

BOOKING SUMMARY:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Service: ${formData.serviceName}
Preferred date: ${formData.preferredDate}
Preferred time: ${formData.preferredTime}
Frequency: ${formData.frequency}

${formData.address ? `Address: ${formData.address}, ${formData.city || ''}` : ''}

${formData.additionalServices && formData.additionalServices.length > 0 ? `
Additional services:
${formData.additionalServices.map(s => `• ${s}`).join('\n')}
` : ''}

ESTIMATED AMOUNT: $${formData.total} (taxes included)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

NEXT STEPS:
1. One of our representatives will contact you to confirm the date and time
2. We will answer all your questions
3. You will receive a final confirmation by email

If you have any questions or wish to modify your booking, please contact us:

📞 ${formData.phone}
📧 econetentretienmenager@gmail.com
🌐 www.econet-proprete.ca

We look forward to serving you!

Best regards,
The EcoNet Proprete Team
Your eco-friendly cleaning partner
    `.trim();
  }

  // English service labels
  private getServiceLabelEN(value?: string): string {
    const labels: {[key: string]: string} = {
      'residential': 'Residential cleaning',
      'commercial': 'Commercial cleaning',
      'post-construction': 'Post-construction cleaning',
      'deep-cleaning': 'Deep cleaning',
      'maintenance': 'Regular maintenance',
      'carpet': 'Carpet cleaning',
      'other': 'Other'
    };
    return labels[value || ''] || 'Not specified';
  }
}
