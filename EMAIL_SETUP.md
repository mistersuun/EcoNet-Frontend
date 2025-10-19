# Email Setup Instructions for ÉcoNet Propreté

## Overview

The contact and booking forms are configured to send emails to **econetentretienmenager@gmail.com** using the Web3Forms service. This is a free, serverless form submission service that requires only a simple API key.

## Step 1: Get Your Free Web3Forms Access Key

1. Visit [https://web3forms.com](https://web3forms.com)
2. Click "Get Started" or "Get Access Key"
3. Enter your email address: **econetentretienmenager@gmail.com**
4. Click "Get Your Access Key"
5. Check your email inbox for the verification email
6. Click the verification link
7. Copy your access key (it looks like: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`)

## Step 2: Update the Email Service

1. Open the file: `src/app/services/email.service.ts`
2. Find line 23 where it says:
   ```typescript
   private accessKey = 'YOUR_WEB3FORMS_ACCESS_KEY';
   ```
3. Replace `'YOUR_WEB3FORMS_ACCESS_KEY'` with your actual access key:
   ```typescript
   private accessKey = 'your-actual-access-key-here';
   ```
4. Save the file

## Step 3: Test the Forms

### Testing Contact Form
1. Navigate to `/contact` page
2. Fill out the contact form with test data
3. Submit the form
4. You should see a success modal
5. Check the email inbox for econetentretienmenager@gmail.com

### Testing Booking Form
1. Navigate to `/booking` page
2. Go through all booking steps
3. Fill in all required information
4. Click "Confirm Booking" on the final step
5. You should see a success modal
6. Check the email inbox for the booking confirmation

## What's Already Set Up

### ✅ Email Service (`src/app/services/email.service.ts`)
- **Contact Form Handler**: `sendContactForm()` - Formats and sends contact form submissions
- **Booking Form Handler**: `sendBookingForm()` - Formats and sends booking reservations
- **Email Destination**: Both forms send to `econetentretienmenager@gmail.com`

### ✅ Success Modal Component (`src/app/shared/components/success-modal.component.ts`)
- Beautiful animated success modal
- Option to redirect to home page or stay on current page
- Proper error handling with error modal variant
- Fully responsive design

### ✅ Contact Page Integration
- Success modal replaces browser alerts
- Shows success message with option to return home
- Error handling with user-friendly messages
- Form resets after successful submission

### ✅ Translations Added (French & English)
- `COMMON.SUCCESS_TITLE` - Success modal title
- `COMMON.SUCCESS_MESSAGE` - Generic success message
- `COMMON.ERROR_MESSAGE` - Generic error message
- `COMMON.RETURN_HOME` - Return home button
- `COMMON.STAY_HERE` - Stay on page button
- `CONTACT.SUCCESS_MESSAGE` - Contact-specific success
- `CONTACT.ERROR_MESSAGE` - Contact-specific error
- `BOOKING.SUCCESS_TITLE` - Booking confirmation title
- `BOOKING.SUCCESS_MESSAGE` - Booking-specific success
- `BOOKING.ERROR_MESSAGE` - Booking-specific error

## Email Format Examples

### Contact Form Email Format
```
NOUVELLE DEMANDE DE CONTACT

Informations du client:
━━━━━━━━━━━━━━━━━━━━━━━━━━
Nom complet: Jean Dupont
Email: jean@example.com
Téléphone: (514) 123-4567

Détails de la demande:
━━━━━━━━━━━━━━━━━━━━━━━━━━
Type de service: Nettoyage résidentiel
Taille de la propriété: Moyen (1000-2000 pi²)
Date préférée: 2025-11-01
Demande urgente: Non

Message:
━━━━━━━━━━━━━━━━━━━━━━━━━━
[User's message here]
```

### Booking Form Email Format
```
NOUVELLE RÉSERVATION DE SERVICE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

INFORMATIONS CLIENT:
Nom complet: Marie Tremblay
Email: marie@example.com
Téléphone: (514) 987-6543

SERVICE DEMANDÉ:
Type de service: Nettoyage Résidentiel
Prix de base: 120$

DÉTAILS DE LA PROPRIÉTÉ:
Type: Maison unifamiliale
Superficie: 1500 pi²
Chambres: 3
Salles de bain: 2

PLANIFICATION:
Date préférée: 2025-11-15
Heure préférée: 10:00
Fréquence: Aux 2 semaines

SERVICES ADDITIONNELS:
Nettoyage vitres intérieures (+30$)

RÉSUMÉ FINANCIER:
Sous-total: 150$
Taxes (TPS + TVQ): 22.50$
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TOTAL: 172.50$
```

## To Integrate Booking Form (Future Step)

The booking form email method is already created (`sendBookingForm`). To integrate it into the booking component:

1. Import the required components:
   ```typescript
   import { EmailService, BookingFormData } from '../../services/email.service';
   import { SuccessModalComponent } from '../../shared/components/success-modal.component';
   ```

2. Add the modal to the component imports array

3. Add modal state properties:
   ```typescript
   showSuccessModal = false;
   showErrorModal = false;
   ```

4. Add the modals to the template (before closing template tag):
   ```html
   <app-success-modal
     [isVisible]="showSuccessModal"
     [title]="'BOOKING.SUCCESS_TITLE' | transloco"
     [message]="'BOOKING.SUCCESS_MESSAGE' | transloco"
     [primaryButtonText]="'COMMON.RETURN_HOME'"
     [redirectTo]="'/'"
     [autoRedirect]="true"
     [redirectDelay]="5000"
     (close)="showSuccessModal = false">
   </app-success-modal>
   ```

5. Update the submit method to call `emailService.sendBookingForm(bookingData)` and show the modal on success

## Troubleshooting

### Emails not being received?
1. Check spam/junk folder in econetentretienmenager@gmail.com
2. Verify the access key is correct in `email.service.ts`
3. Check browser console for errors
4. Make sure you verified your email with Web3Forms
5. Check Web3Forms dashboard for submission logs

### Modal not showing?
1. Ensure `SuccessModalComponent` is imported in the component
2. Check that modal state variables are defined
3. Verify translations are loaded properly

### Form validation errors?
1. All required fields must be filled
2. Email must be in valid format
3. Phone number should be in (514) XXX-XXXX format

## Support

- **Web3Forms Documentation**: https://docs.web3forms.com
- **Web3Forms Dashboard**: https://web3forms.com/dashboard (after signup)
- **API Status**: https://status.web3forms.com

## Security Notes

✅ **Safe to use**: Web3Forms access key is safe to expose in frontend code
✅ **No backend required**: Everything works client-side
✅ **Spam protection**: Web3Forms includes built-in spam protection
✅ **Email validation**: Service validates email addresses before sending
