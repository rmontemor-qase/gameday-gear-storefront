export type PromoRule =
  | { code: string; kind: "percent"; percent: number; expires?: string }
  | { code: string; kind: "fixed"; amount: number; minSubtotal: number; expires?: string };

/** Active and recently retired promo codes. Amounts are in credits. */
export const PROMO_CODES: PromoRule[] = [
  { code: "GAMEDAY10", kind: "percent", percent: 10 },
  { code: "WELCOME5", kind: "fixed", amount: 5, minSubtotal: 50 },
  { code: "SUMMER24", kind: "percent", percent: 15, expires: "2026-09-01" },
];

export type PromoLookup =
  | { ok: true; rule: PromoRule }
  | { ok: false; reason: "unknown" | "expired" | "minimum-not-met" };

export function lookupPromo(code: string, subtotal: number, today: Date = new Date()): PromoLookup {
  const rule = PROMO_CODES.find((r) => r.code === code.trim().toUpperCase());
  if (!rule) return { ok: false, reason: "unknown" };
  if (rule.expires && new Date(rule.expires) < today) return { ok: false, reason: "expired" };
  if (rule.kind === "fixed" && subtotal < rule.minSubtotal) return { ok: false, reason: "minimum-not-met" };
  return { ok: true, rule };
}

/** Discount in credits for a valid rule, never more than the subtotal. */
export function discountFor(rule: PromoRule, subtotal: number): number {
  const raw = rule.kind === "percent" ? (subtotal * rule.percent) / 100 : rule.amount;
  return Math.min(Math.round(raw * 100) / 100, subtotal);
}
