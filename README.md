# GameDay Gear — Storefront

Application code for the [GameDay Gear](https://gameday-gear.lovable.app) storefront:
catalogue, cart, and order pricing.

## Layout

| Path | What lives there |
| --- | --- |
| `src/data/products.ts` | Product catalogue. Prices are in credits. |
| `src/lib/cart.ts` | Cart line management — add, remove, quantity. |
| `src/lib/pricing.ts` | Subtotal, shipping, and total calculation. |
| `src/components/CartSummary.tsx` | Order summary panel on the cart page. |

## Testing

Behaviour in this repository is covered by the manual regression suite in
Qase project **GAMEDAY**, and by the automated suite in
[`gameday-gear-e2e`](https://github.com/rmontemor-qase/gameday-gear-e2e).

When a pull request changes customer-visible behaviour, the QA team's AI client
reads the diff through GitHub MCP and drafts the manual regression checklist
into Qase before the change is merged.
