import { notFound } from "next/navigation";
import { getProduct } from "@/lib/products";
import { ProductPurchase } from "@/components/AddToCart";

export default async function ProductPage({ params }: PageProps<"/product/[slug]">) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();
  return <ProductPurchase product={product} />;
}
