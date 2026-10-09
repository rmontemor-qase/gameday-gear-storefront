import type { CartLine } from "./cart";
import { discountFor, lookupPromo, type PromoLookup } from "./promo";

/** Flat shipping fee applied to orders below the free-shipping threshold, in credits. */
export const SHIPPING_FEE = 10;

/** Orders at or above this subtotal ship for free. In credits. */
export const FREE_SHIPPING_THRESHOLD = 100;

export interface OrderSummary {
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  qualifiesForFreeShipping: boolean;
  creditsToFreeShipping: number;
  promoError?: Exclude<PromoLookup, { ok: true }>["reason"];
}

export function subtotalFor(lines: CartLine[]): number {
  return round2(lines.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0));
}

/**
 * Shipping is a flat fee, waived once the subtotal reaches the free-shipping
 * threshold. The threshold is measured on the subtotal alone, before shipping.
 * An empty cart ships for nothing because there is no order to ship.
 */
export function shippingFor(lines: CartLine[]): number {
  if (lines.length === 0) return 0;
  if (subtotalFor(lines) >= FREE_SHIPPING_THRESHOLD) return 0;
  return SHIPPING_FEE;
}

/**
 * Promo discounts come off the subtotal. Shipping is charged on top and is
 * never discounted. An invalid code leaves the order unchanged and reports why.
 */
export function summarize(lines: CartLine[], promoCode?: string, today: Date = new Date()): OrderSummary {
  const subtotal = subtotalFor(lines);
  const shipping = shippingFor(lines);
  const qualifiesForFreeShipping = lines.length > 0 && subtotal >= FREE_SHIPPING_THRESHOLD;

  let discount = 0;
  let promoError: OrderSummary["promoError"];
  if (promoCode && lines.length > 0) {
    const lookup = lookupPromo(promoCode, subtotal, today);
    if (lookup.ok) discount = discountFor(lookup.rule, subtotal);
    else promoError = lookup.reason;
  }

  return {
    subtotal,
    discount,
    shipping,
    total: round2(subtotal - discount + shipping),
    qualifiesForFreeShipping,
    creditsToFreeShipping: qualifiesForFreeShipping
      ? 0
      : round2(FREE_SHIPPING_THRESHOLD - subtotal),
    ...(promoError ? { promoError } : {}),
  };
}

export function formatCredits(amount: number): string {
  return `${amount.toFixed(2)} credits`;
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
