"use client";
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  category: string;
  priceCents: number;
  color: { name: string; hex: string };
  size: string;
  quantity: number;
};

type CartCtx = {
  items: CartItem[];
  count: number;
  subtotalCents: number;
  add: (item: CartItem) => void;
  setQuantity: (i: CartItem, q: number) => void;
  remove: (i: CartItem) => void;
  clear: () => void;
  ready: boolean;
};

const Ctx = createContext<CartCtx | null>(null);
const KEY = "shop-cart-v1";
const same = (a: CartItem, b: CartItem) =>
  a.productId === b.productId && a.color.name === b.color.name && a.size === b.size;

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Hydrate from localStorage after mount to avoid SSR mismatches.
    const t = setTimeout(() => {
      try {
        setItems(JSON.parse(localStorage.getItem(KEY) ?? "[]"));
      } catch {}
      setReady(true);
    });
    return () => clearTimeout(t);
  }, []);
  useEffect(() => {
    if (ready) localStorage.setItem(KEY, JSON.stringify(items));
  }, [items, ready]);

  const value = useMemo<CartCtx>(
    () => ({
      items,
      ready,
      count: items.reduce((n, i) => n + i.quantity, 0),
      subtotalCents: items.reduce((n, i) => n + i.quantity * i.priceCents, 0),
      add: (item) =>
        setItems((cur) =>
          cur.some((i) => same(i, item))
            ? cur.map((i) => (same(i, item) ? { ...i, quantity: Math.min(20, i.quantity + item.quantity) } : i))
            : [...cur, item],
        ),
      setQuantity: (item, q) =>
        setItems((cur) =>
          q < 1 ? cur.filter((i) => !same(i, item)) : cur.map((i) => (same(i, item) ? { ...i, quantity: Math.min(20, q) } : i)),
        ),
      remove: (item) => setItems((cur) => cur.filter((i) => !same(i, item))),
      clear: () => setItems([]),
    }),
    [items, ready],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useCart = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart must be used inside CartProvider");
  return c;
};
