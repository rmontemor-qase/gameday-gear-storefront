import type { CartLine } from "../lib/cart";
import { formatCredits, summarize } from "../lib/pricing";

interface CartSummaryProps {
  lines: CartLine[];
  onCheckout: () => void;
}

export function CartSummary({ lines, onCheckout }: CartSummaryProps) {
  const { subtotal, shipping, total, qualifiesForFreeShipping, creditsToFreeShipping } =
    summarize(lines);

  return (
    <aside className="order-summary" data-testid="order-summary">
      <h2>Order Summary</h2>

      <dl>
        <dt>Subtotal</dt>
        <dd data-testid="summary-subtotal">{formatCredits(subtotal)}</dd>

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
