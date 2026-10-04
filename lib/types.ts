export type Category = "tops" | "sweatshirts" | "caps";

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: Category;
  description: string;
  price_cents: number;
  colors: { name: string; hex: string }[];
  sizes: string[];
};

export const CATEGORY_LABELS: Record<Category, string> = {
  tops: "Round Neck Tops",
  sweatshirts: "Sweatshirts",
  caps: "Snapback Caps",
};

export const money = (cents: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);

export const FREE_SHIPPING_CENTS = 7500;
export const SHIPPING_CENTS = 599;
export const shippingFor = (subtotal: number) =>
  subtotal === 0 || subtotal >= FREE_SHIPPING_CENTS ? 0 : SHIPPING_CENTS;
