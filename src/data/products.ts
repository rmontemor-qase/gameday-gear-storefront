export interface Product {
  id: string;
  name: string;
  price: number;
  category: "Apparel" | "Balls" | "Accessories" | "Footwear";
  rating: number;
  reviews: number;
  inStock: boolean;
}

/** Prices are in credits. Mirrors the catalogue served by the storefront. */
export const PRODUCTS: Product[] = [
  { id: "athletic-shorts", name: "Athletic Shorts", price: 40, category: "Apparel", rating: 4.5, reviews: 41, inStock: true },
  { id: "basketball", name: "Basketball", price: 35, category: "Balls", rating: 4.8, reviews: 64, inStock: true },
  { id: "gym-duffel-bag", name: "Gym Duffel Bag", price: 65, category: "Accessories", rating: 4.4, reviews: 93, inStock: true },
  { id: "running-sneakers", name: "Running Sneakers", price: 120, category: "Footwear", rating: 4.9, reviews: 32, inStock: true },
  { id: "soccer-ball", name: "Soccer Ball", price: 25, category: "Balls", rating: 4.5, reviews: 128, inStock: true },
  { id: "sports-jersey", name: "Sports Jersey", price: 55, category: "Apparel", rating: 4.6, reviews: 87, inStock: true },
  { id: "tennis-ball-set", name: "Tennis Ball Set", price: 15, category: "Balls", rating: 4.7, reviews: 156, inStock: false },
  { id: "volleyball", name: "Volleyball", price: 30, category: "Balls", rating: 4.3, reviews: 215, inStock: true },
];

export function findProduct(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}
