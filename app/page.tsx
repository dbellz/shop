import Link from "next/link";
import { getProducts } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";
import { ProductArt } from "@/components/ProductArt";
import { CATEGORY_LABELS, type Category } from "@/lib/types";

export default async function Home() {
  const products = await getProducts();
  const cats: [Category, string][] = [["tops", "#1e293b"], ["sweatshirts", "#a1a1aa"], ["caps", "#b91c1c"]];
  return (
    <div className="space-y-14">
      <section className="rounded-2xl bg-zinc-900 text-white px-8 py-16 text-center">
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight">Everyday essentials.</h1>
        <p className="mt-4 text-zinc-300 max-w-xl mx-auto">Round neck tops, sweatshirts and snapback caps made to be worn on repeat.</p>
        <Link href="/shop" className="inline-block mt-8 rounded-full bg-white text-zinc-900 px-8 py-3 font-semibold">Shop all</Link>
      </section>
      <section className="grid sm:grid-cols-3 gap-6">
        {cats.map(([c, hex]) => (
          <Link key={c} href={`/shop?category=${c}`} className="group relative block overflow-hidden rounded-xl">
            <ProductArt category={c} color={hex} className="w-full transition group-hover:scale-105" />
            <span className="absolute bottom-3 left-3 rounded-full bg-white px-4 py-1 text-sm font-semibold">{CATEGORY_LABELS[c]}</span>
          </Link>
        ))}
      </section>
      <section>
        <h2 className="text-2xl font-black mb-6">Best sellers</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.slice(0, 4).map((p) => <ProductCard key={p.id} p={p} />)}
        </div>
      </section>
    </div>
  );
}
