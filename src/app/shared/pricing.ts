/**
 * Single source of truth for prices shown or charged anywhere on the site
 * (booking estimate, pricing page, services page). Change a price here only.
 */

export type ServiceId = 'residential' | 'commercial' | 'deep_cleaning' | 'post_construction';

export interface ServicePrice {
  id: ServiceId;
  icon: string;
  /** Starting price in CAD, before taxes */
  from: number;
  /** Bookable online; otherwise the customer requests a quote */
  bookable: boolean;
}

export const SERVICE_PRICES: Record<ServiceId, ServicePrice> = {
  residential:       { id: 'residential',       icon: 'home',     from: 120, bookable: true },
  commercial:        { id: 'commercial',        icon: 'building', from: 200, bookable: true },
  deep_cleaning:     { id: 'deep_cleaning',     icon: 'sparkles', from: 280, bookable: true },
  post_construction: { id: 'post_construction', icon: 'hammer',   from: 350, bookable: false },
};

export const ADD_ONS = [
  { id: 'windows',  name: 'BOOKING.ADDITIONAL_SERVICES_LIST.WINDOWS',  price: 30 },
  { id: 'oven',     name: 'BOOKING.ADDITIONAL_SERVICES_LIST.OVEN',     price: 25 },
  { id: 'fridge',   name: 'BOOKING.ADDITIONAL_SERVICES_LIST.FRIDGE',   price: 35 },
  { id: 'basement', name: 'BOOKING.ADDITIONAL_SERVICES_LIST.BASEMENT', price: 50 },
  { id: 'garage',   name: 'BOOKING.ADDITIONAL_SERVICES_LIST.GARAGE',   price: 40 },
];

/** Discount applied to the subtotal, keyed by the booking form's frequency value */
export const FREQUENCY_DISCOUNTS: Record<string, number> = {
  'one-time': 0,
  'monthly': 0.05,
  'bi-weekly': 0.10,
  'weekly': 0.15,
};

/** QC sales taxes (GST 5% + QST 9.975%) */
export const QC_TAX_RATE = 0.14975;
