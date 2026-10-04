import Link from "next/link";
import { getProducts } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";
import { CATEGORY_LABELS, type Category } from "@/lib/types";

export default async function Shop({ searchParams }: PageProps<"/shop">) {
  const { category } = await searchParams;
  const active = typeof category === "string" && category in CATEGORY_LABELS ? (category as Category) : undefined;
  const products = await getProducts(active);
  const tab = (on: boolean) => `rounded-full border px-4 py-1.5 text-sm ${on ? "bg-zinc-900 text-white border-zinc-900" : "border-zinc-300"}`;
  return (
    <div>
      <h1 className="text-3xl font-black mb-4">{active ? CATEGORY_LABELS[active] : "All products"}</h1>
      <div className="flex flex-wrap gap-2 mb-8">
        <Link href="/shop" className={tab(!active)}>All</Link>
        {(Object.keys(CATEGORY_LABELS) as Category[]).map((c) => (
          <Link key={c} href={`/shop?category=${c}`} className={tab(active === c)}>{CATEGORY_LABELS[c]}</Link>
        ))}
      </div>
      {products.length === 0 ? <p className="text-zinc-500">No products found.</p> : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((p) => <ProductCard key={p.id} p={p} />)}
        </div>
      )}
    </div>
  );
}
