import { createClient } from "@/lib/supabase/server";
import type { Category, Product } from "@/lib/types";

export async function getProducts(category?: Category): Promise<Product[]> {
  const supabase = await createClient();
  let q = supabase.from("products").select("*").order("created_at");
  if (category) q = q.eq("category", category);
  const { data, error } = await q;
  if (error) throw new Error(error.message);
  return data as Product[];
}

export async function getProduct(slug: string): Promise<Product | null> {
  const supabase = await createClient();
  const { data } = await supabase.from("products").select("*").eq("slug", slug).maybeSingle();
  return (data as Product) ?? null;
}
