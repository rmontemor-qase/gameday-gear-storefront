import type { CartLine } from "./cart";

/** Flat shipping fee applied to orders below the free-shipping threshold, in credits. */
export const SHIPPING_FEE = 10;

/** Orders at or above this subtotal ship for free. In credits. */
export const FREE_SHIPPING_THRESHOLD = 100;

export interface OrderSummary {
  subtotal: number;
  shipping: number;
  total: number;
  qualifiesForFreeShipping: boolean;
  creditsToFreeShipping: number;
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

export function summarize(lines: CartLine[]): OrderSummary {
  const subtotal = subtotalFor(lines);
  const shipping = shippingFor(lines);
  const qualifiesForFreeShipping = lines.length > 0 && subtotal >= FREE_SHIPPING_THRESHOLD;

  return {
    subtotal,
    shipping,
    total: round2(subtotal + shipping),
    qualifiesForFreeShipping,
    creditsToFreeShipping: qualifiesForFreeShipping
      ? 0
      : round2(FREE_SHIPPING_THRESHOLD - subtotal),
  };
}

export function formatCredits(amount: number): string {
  return `${amount.toFixed(2)} credits`;
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
