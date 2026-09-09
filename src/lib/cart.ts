import { findProduct } from "../data/products";

export interface CartLine {
  productId: string;
  name: string;
  unitPrice: number;
  quantity: number;
}

export const MAX_QUANTITY_PER_LINE = 10;

export function addToCart(lines: CartLine[], productId: string, quantity = 1): CartLine[] {
  const product = findProduct(productId);
  if (!product) throw new Error(`Unknown product: ${productId}`);
  if (!product.inStock) throw new Error(`Product is out of stock: ${productId}`);

  const existing = lines.find((line) => line.productId === productId);
  if (existing) {
    return lines.map((line) =>
      line.productId === productId
        ? { ...line, quantity: clampQuantity(line.quantity + quantity) }
        : line,
    );
  }

  return [
    ...lines,
    {
      productId,
      name: product.name,
      unitPrice: product.price,
      quantity: clampQuantity(quantity),
    },
  ];
}

export function setQuantity(lines: CartLine[], productId: string, quantity: number): CartLine[] {
  if (quantity <= 0) return removeFromCart(lines, productId);
  return lines.map((line) =>
    line.productId === productId ? { ...line, quantity: clampQuantity(quantity) } : line,
  );
}

export function removeFromCart(lines: CartLine[], productId: string): CartLine[] {
  return lines.filter((line) => line.productId !== productId);
}

export function itemCount(lines: CartLine[]): number {
  return lines.reduce((sum, line) => sum + line.quantity, 0);
}

function clampQuantity(quantity: number): number {
  return Math.min(Math.max(quantity, 1), MAX_QUANTITY_PER_LINE);
}
