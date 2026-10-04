import Link from "next/link";
import { ProductArt } from "./ProductArt";
import { CATEGORY_LABELS, money, type Product } from "@/lib/types";

export function ProductCard({ p }: { p: Product }) {
  return (
    <Link href={`/product/${p.slug}`} className="group block">
      <div className="overflow-hidden rounded-lg">
        <ProductArt category={p.category} color={p.colors[0]?.hex ?? "#999"} className="w-full transition group-hover:scale-105" />
      </div>
      <div className="mt-3 flex justify-between gap-2">
        <div>
          <h3 className="font-semibold">{p.name}</h3>
          <p className="text-xs text-zinc-500">{CATEGORY_LABELS[p.category]} · {p.colors.length} colors</p>
        </div>
        <span className="font-medium">{money(p.price_cents)}</span>
      </div>
    </Link>
  );
}
