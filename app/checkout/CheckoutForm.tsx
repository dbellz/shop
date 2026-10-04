"use client";
import Link from "next/link";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart";
import { money, shippingFor } from "@/lib/types";
import { placeOrder } from "./actions";

const field = "w-full rounded border border-zinc-300 px-3 py-2";

export function CheckoutForm({ signedIn, defaultEmail, defaultName }: { signedIn: boolean; defaultEmail: string; defaultName: string }) {
  const { items, ready, subtotalCents } = useCart();
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, start] = useTransition();
  const shipping = shippingFor(subtotalCents);

  if (!ready) return null;
  if (items.length === 0)
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-black">Nothing to check out</h1>
        <Link href="/shop" className="underline mt-4 inline-block">Back to shop</Link>
      </div>
    );

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const get = (k: string) => String(f.get(k) ?? "");
    setError("");
    start(async () => {
      const res = await placeOrder({
        email: get("email"),
        full_name: get("full_name"),
        phone: get("phone"),
        address_line1: get("address_line1"),
        address_line2: get("address_line2"),
        city: get("city"),
        state: get("state"),
        postal_code: get("postal_code"),
        country: get("country"),
        items: items.map((i) => ({ productId: i.productId, color: i.color.name, size: i.size, quantity: i.quantity })),
      });
      if ("error" in res) setError(res.error);
      else router.push(`/order/${res.orderId}`);
    });
  }

  return (
    <div className="grid md:grid-cols-5 gap-10">
      <form onSubmit={onSubmit} className="md:col-span-3 space-y-4">
        <h1 className="text-3xl font-black">Checkout</h1>
        {!signedIn && (
          <p className="text-sm rounded bg-zinc-100 p-3">
            <Link href="/login?next=/checkout" className="underline font-medium">Sign in with Google</Link> to track your orders, or continue as guest.
          </p>
        )}
        <h2 className="font-bold pt-2">Contact</h2>
        <input name="email" type="email" required placeholder="Email" defaultValue={defaultEmail} className={field} autoComplete="email" />
        <h2 className="font-bold pt-2">Shipping address</h2>
        <input name="full_name" required placeholder="Full name" defaultValue={defaultName} className={field} autoComplete="name" />
        <input name="phone" type="tel" placeholder="Phone (optional)" className={field} autoComplete="tel" />
        <input name="address_line1" required placeholder="Address" className={field} autoComplete="address-line1" />
        <input name="address_line2" placeholder="Apartment, suite, etc. (optional)" className={field} autoComplete="address-line2" />
        <div className="grid grid-cols-2 gap-4">
          <input name="city" required placeholder="City" className={field} autoComplete="address-level2" />
          <input name="state" placeholder="State / Region" className={field} autoComplete="address-level1" />
          <input name="postal_code" required placeholder="Postal code" className={field} autoComplete="postal-code" />
          <input name="country" required placeholder="Country" defaultValue="United States" className={field} autoComplete="country-name" />
        </div>
        <h2 className="font-bold pt-2">Payment</h2>
        <p className="rounded border border-zinc-300 p-3 text-sm">Cash on delivery — pay when your order arrives.</p>
        {error && <p role="alert" className="text-red-600 text-sm">{error}</p>}
        <button disabled={pending} className="w-full rounded-full bg-zinc-900 text-white py-3 font-semibold disabled:opacity-60">
          {pending ? "Placing order…" : `Place order · ${money(subtotalCents + shipping)}`}
        </button>
      </form>
      <aside className="md:col-span-2 rounded-xl border border-zinc-200 p-6 h-fit space-y-3">
        <h2 className="font-bold">Order summary</h2>
        {items.map((i) => (
          <div key={`${i.productId}-${i.color.name}-${i.size}`} className="flex justify-between text-sm">
            <span>{i.name} <span className="text-zinc-500">({i.color.name}/{i.size}) × {i.quantity}</span></span>
            <span>{money(i.priceCents * i.quantity)}</span>
          </div>
        ))}
        <div className="flex justify-between text-sm border-t pt-3"><span>Shipping</span><span>{shipping ? money(shipping) : "Free"}</span></div>
        <div className="flex justify-between font-bold"><span>Total</span><span>{money(subtotalCents + shipping)}</span></div>
      </aside>
    </div>
  );
}
