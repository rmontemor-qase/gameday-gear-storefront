import type { CartLine } from "./cart";

/** Flat shipping fee applied to every order, in credits. */
export const SHIPPING_FEE = 10;

export interface OrderSummary {
  subtotal: number;
  shipping: number;
  total: number;
}

export function subtotalFor(lines: CartLine[]): number {
  return round2(lines.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0));
}

/**
 * Shipping is a flat fee on every order, including single-item orders.
 * An empty cart ships for nothing because there is no order to ship.
 */
export function shippingFor(lines: CartLine[]): number {
  if (lines.length === 0) return 0;
  return SHIPPING_FEE;
}

export function summarize(lines: CartLine[]): OrderSummary {
  const subtotal = subtotalFor(lines);
  const shipping = shippingFor(lines);
  return { subtotal, shipping, total: round2(subtotal + shipping) };
}

export function formatCredits(amount: number): string {
  return `${amount.toFixed(2)} credits`;
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
