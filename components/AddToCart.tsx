"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart";
import { ProductArt } from "./ProductArt";
import { money, type Product } from "@/lib/types";

export function ProductPurchase({ product: p }: { product: Product }) {
  const { add } = useCart();
  const router = useRouter();
  const [color, setColor] = useState(p.colors[0]);
  const [size, setSize] = useState(p.sizes.length === 1 ? p.sizes[0] : "");
  const [qty, setQty] = useState(1);
  const [error, setError] = useState("");

  function submit(goCheckout: boolean) {
    if (!size) return setError("Please choose a size");
    add({ productId: p.id, slug: p.slug, name: p.name, category: p.category, priceCents: p.price_cents, color, size, quantity: qty });
    if (goCheckout) router.push("/checkout");
    else setError("");
  }

  return (
    <div className="grid md:grid-cols-2 gap-10">
      <ProductArt category={p.category} color={color.hex} className="w-full rounded-xl" />
      <div>
        <h1 className="text-3xl font-black">{p.name}</h1>
        <p className="text-2xl mt-2">{money(p.price_cents)}</p>
        <p className="mt-4 text-zinc-600">{p.description}</p>

        <p className="mt-6 text-sm font-semibold">Color: <span className="font-normal">{color.name}</span></p>
        <div className="flex gap-2 mt-2">
          {p.colors.map((c) => (
            <button key={c.name} aria-label={c.name} title={c.name} onClick={() => setColor(c)}
              style={{ background: c.hex }}
              className={`h-9 w-9 rounded-full border ${c.name === color.name ? "ring-2 ring-offset-2 ring-zinc-900" : "border-zinc-300"}`} />
          ))}
        </div>

        <p className="mt-6 text-sm font-semibold">Size</p>
        <div className="flex flex-wrap gap-2 mt-2">
          {p.sizes.map((s) => (
            <button key={s} onClick={() => { setSize(s); setError(""); }}
              className={`min-w-12 rounded border px-3 py-2 text-sm ${s === size ? "bg-zinc-900 text-white border-zinc-900" : "border-zinc-300"}`}>
              {s}
            </button>
          ))}
        </div>

        <div className="mt-6 flex items-center gap-3">
          <label className="text-sm font-semibold" htmlFor="qty">Qty</label>
          <input id="qty" type="number" min={1} max={20} value={qty}
            onChange={(e) => setQty(Math.max(1, Math.min(20, Number(e.target.value) || 1)))}
            className="w-20 rounded border border-zinc-300 px-2 py-2" />
        </div>
        {error && <p className="mt-3 text-sm text-red-600" role="alert">{error}</p>}
        <div className="mt-6 flex gap-3">
          <button onClick={() => submit(false)} className="flex-1 rounded-full border-2 border-zinc-900 py-3 font-semibold">Add to cart</button>
          <button onClick={() => submit(true)} className="flex-1 rounded-full bg-zinc-900 text-white py-3 font-semibold">Buy now</button>
        </div>
      </div>
    </div>
  );
}
