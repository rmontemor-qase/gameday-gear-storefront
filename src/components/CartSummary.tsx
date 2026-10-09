import { useState } from "react";
import type { CartLine } from "../lib/cart";
import { formatCredits, summarize } from "../lib/pricing";

interface CartSummaryProps {
  lines: CartLine[];
  onCheckout: () => void;
}

const PROMO_MESSAGES = {
  unknown: "That code isn't valid.",
  expired: "That code has expired.",
  "minimum-not-met": "Your order doesn't meet the minimum for this code.",
} as const;

export function CartSummary({ lines, onCheckout }: CartSummaryProps) {
  const [draftCode, setDraftCode] = useState("");
  const [appliedCode, setAppliedCode] = useState<string | undefined>();
  const { subtotal, discount, shipping, total, qualifiesForFreeShipping, creditsToFreeShipping, promoError } =
    summarize(lines, appliedCode);

  return (
    <aside className="order-summary" data-testid="order-summary">
      <h2>Order Summary</h2>

      <form
        className="promo-form"
        onSubmit={(e) => {
          e.preventDefault();
          setAppliedCode(draftCode.trim() || undefined);
        }}
      >
        <input
          data-testid="promo-input"
          placeholder="Promo code"
          value={draftCode}
          onChange={(e) => setDraftCode(e.target.value)}
        />
        <button type="submit" data-testid="promo-apply">Apply</button>
      </form>
      {promoError && (
        <p className="promo-error" data-testid="promo-error">{PROMO_MESSAGES[promoError]}</p>
      )}

      <dl>
        <dt>Subtotal</dt>
        <dd data-testid="summary-subtotal">{formatCredits(subtotal)}</dd>

        {discount > 0 && (
          <>
            <dt>Discount ({appliedCode!.toUpperCase()})</dt>
            <dd data-testid="summary-discount">-{formatCredits(discount)}</dd>
          </>
        )}

        <dt>Shipping</dt>
        <dd data-testid="summary-shipping">
          {qualifiesForFreeShipping ? "FREE" : formatCredits(shipping)}
        </dd>

        <dt>Total</dt>
        <dd data-testid="summary-total">{formatCredits(total)}</dd>
      </dl>

      {lines.length > 0 && !qualifiesForFreeShipping && (
        <p className="free-shipping-hint" data-testid="free-shipping-hint">
          Add {formatCredits(creditsToFreeShipping)} more to qualify for free shipping.
        </p>
      )}

      {qualifiesForFreeShipping && (
        <p className="free-shipping-banner" data-testid="free-shipping-banner">
          Your order qualifies for free shipping.
        </p>
      )}

      <button
        type="button"
        data-testid="checkout-button"
        disabled={lines.length === 0}
        onClick={onCheckout}
      >
        Proceed to checkout
      </button>
    </aside>
  );
}
