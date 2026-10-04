"use client";
import Link from "next/link";
import { useCart } from "@/lib/cart";
import { ProductArt } from "@/components/ProductArt";
import { money, shippingFor } from "@/lib/types";

export default function CartPage() {
  const { items, ready, subtotalCents, setQuantity, remove } = useCart();
  if (!ready) return null;
  if (items.length === 0)
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-black">Your cart is empty</h1>
        <Link href="/shop" className="inline-block mt-6 rounded-full bg-zinc-900 text-white px-6 py-2.5">Continue shopping</Link>
      </div>
    );
  const shipping = shippingFor(subtotalCents);
  return (
    <div className="grid md:grid-cols-3 gap-10">
      <div className="md:col-span-2">
        <h1 className="text-3xl font-black mb-6">Your cart</h1>
        <ul className="divide-y divide-zinc-200">
          {items.map((i) => (
            <li key={`${i.productId}-${i.color.name}-${i.size}`} className="flex gap-4 py-4">
              <ProductArt category={i.category} color={i.color.hex} className="w-24 rounded" />
              <div className="flex-1">
                <Link href={`/product/${i.slug}`} className="font-semibold">{i.name}</Link>
                <p className="text-sm text-zinc-500">{i.color.name} / {i.size}</p>
                <div className="mt-2 flex items-center gap-3 text-sm">
                  <button aria-label="Decrease" className="h-7 w-7 rounded border" onClick={() => setQuantity(i, i.quantity - 1)}>−</button>
                  <span>{i.quantity}</span>
                  <button aria-label="Increase" className="h-7 w-7 rounded border" onClick={() => setQuantity(i, i.quantity + 1)}>+</button>
                  <button className="ml-3 text-red-600 underline" onClick={() => remove(i)}>Remove</button>
                </div>
              </div>
              <span className="font-medium">{money(i.priceCents * i.quantity)}</span>
            </li>
          ))}
        </ul>
      </div>
      <aside className="rounded-xl border border-zinc-200 p-6 h-fit space-y-3">
        <div className="flex justify-between"><span>Subtotal</span><span>{money(subtotalCents)}</span></div>
        <div className="flex justify-between"><span>Shipping</span><span>{shipping ? money(shipping) : "Free"}</span></div>
        <div className="flex justify-between font-bold border-t pt-3"><span>Total</span><span>{money(subtotalCents + shipping)}</span></div>
        <Link href="/checkout" className="block text-center rounded-full bg-zinc-900 text-white py-3 font-semibold">Checkout</Link>
      </aside>
    </div>
  );
}
