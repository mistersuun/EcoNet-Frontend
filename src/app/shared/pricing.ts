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

/**
 * Property size ranges, matching the pricing page (PRICING.FACTORS.AREA.ITEMS).
 * A `null` multiplier means the space is too large to price online: custom quote.
 */
export type AreaRange = 'under_800' | '800_1500' | '1500_2500' | 'over_2500';

export const AREA_MULTIPLIERS: Record<AreaRange, number | null> = {
  under_800: 1,      // base price
  '800_1500': 1.25,  // +25%
  '1500_2500': 1.5,  // +50%
  over_2500: null,   // custom quote
};

/**
 * Property type adjustment, matching PRICING.FACTORS.PROPERTY_TYPE.ITEMS.
 * Houses are advertised at +10-20%; the online estimate uses the midpoint and
 * the final price is confirmed with the customer before the service.
 * Offices and stores are already priced by the commercial service's own rate.
 */
export type PropertyType = 'apartment' | 'house' | 'townhouse' | 'office' | 'retail';

export const PROPERTY_TYPE_MULTIPLIERS: Record<PropertyType, number> = {
  apartment: 1,
  house: 1.15,
  townhouse: 1.15,
  office: 1,
  retail: 1,
};

export interface EstimateInput {
  service: ServiceId | '' | null;
  area: AreaRange | '' | null;
  propertyType: PropertyType | '' | null;
  addOnIds: string[];
  frequency: string;
}

export interface Estimate {
  /** Service starting price */
  base: number;
  areaMultiplier: number;
  /** base × (area − 1) */
  areaAdjustment: number;
  propertyTypeMultiplier: number;
  /** base × area × (type − 1) */
  propertyTypeAdjustment: number;
  addOns: { id: string; name: string; price: number }[];
  addOnsTotal: number;
  /** Before the frequency discount */
  beforeDiscount: number;
  discountRate: number;
  /** Amount taken off (positive number) */
  discount: number;
  /** Rounded to the dollar, before taxes */
  subtotal: number;
  taxes: number;
  total: number;
  /** The space is too large to price online (area over 2500 sq ft) */
  quoteRequired: boolean;
}

/**
 * (base × area × propertyType + add-ons) × (1 − frequency discount),
 * rounded to the dollar, then QC taxes (rounded to the dollar).
 * Missing area or property type count as ×1 until the customer picks one.
 */
export function estimatePrice(input: EstimateInput): Estimate {
  const base = input.service ? SERVICE_PRICES[input.service].from : 0;
  const areaValue = input.area ? AREA_MULTIPLIERS[input.area] : 1;
  const quoteRequired = areaValue === null;
  const areaMultiplier = areaValue ?? 1;
  const propertyTypeMultiplier = input.propertyType ? PROPERTY_TYPE_MULTIPLIERS[input.propertyType] ?? 1 : 1;

  const sized = base * areaMultiplier;
  const adjusted = sized * propertyTypeMultiplier;
  const addOns = ADD_ONS.filter(a => input.addOnIds.includes(a.id));
  const addOnsTotal = addOns.reduce((sum, a) => sum + a.price, 0);
  const beforeDiscount = adjusted + addOnsTotal;
  const discountRate = FREQUENCY_DISCOUNTS[input.frequency] ?? 0;
  const subtotal = Math.round(beforeDiscount * (1 - discountRate));
  const taxes = Math.round(subtotal * QC_TAX_RATE);

  return {
    base,
    areaMultiplier,
    areaAdjustment: cents(sized - base),
    propertyTypeMultiplier,
    propertyTypeAdjustment: cents(adjusted - sized),
    addOns,
    addOnsTotal,
    beforeDiscount: cents(beforeDiscount),
    discountRate,
    discount: cents(beforeDiscount * discountRate),
    subtotal,
    taxes,
    total: subtotal + taxes,
    quoteRequired,
  };
}

function cents(n: number): number {
  return Math.round(n * 100) / 100;
}
