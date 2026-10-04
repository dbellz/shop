import { notFound } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { money } from "@/lib/types";
import { ClearCart } from "./ClearCart";

export default async function OrderPage({ params }: PageProps<"/order/[id]">) {
  const { id } = await params;
  if (!z.uuid().safeParse(id).success) notFound();
  // The unguessable UUID acts as the access token so guests can view their confirmation.
  const { data: order } = await createAdminClient().from("orders").select("*, order_items(*)").eq("id", id).maybeSingle();
  if (!order) notFound();
  return (
    <div className="max-w-2xl mx-auto">
      <ClearCart />
      <h1 className="text-3xl font-black">Thank you, {order.full_name}!</h1>
      <p className="mt-2 text-zinc-600">
        Order <b>{order.order_number}</b> is confirmed.{" "}
        {order.confirmation_email_sent_at ? `A confirmation email was sent to ${order.email}.` : ""}
      </p>
      <ul className="mt-8 divide-y divide-zinc-200 border-y border-zinc-200">
        {order.order_items.map((i: { id: string; name: string; color: string; size: string; quantity: number; unit_price_cents: number }) => (
          <li key={i.id} className="flex justify-between py-3">
            <span>{i.name} <span className="text-zinc-500 text-sm">({i.color}/{i.size}) × {i.quantity}</span></span>
            <span>{money(i.unit_price_cents * i.quantity)}</span>
          </li>
        ))}
      </ul>
      <div className="mt-4 space-y-1 text-right">
        <p>Shipping: {order.shipping_cents ? money(order.shipping_cents) : "Free"}</p>
        <p className="font-bold text-lg">Total: {money(order.total_cents)}</p>
      </div>
      <p className="mt-6 text-sm text-zinc-600">
        Shipping to {order.address_line1}, {order.city} {order.postal_code}, {order.country}. Pay on delivery.
      </p>
      <Link href="/shop" className="inline-block mt-8 underline">Continue shopping</Link>
    </div>
  );
}
