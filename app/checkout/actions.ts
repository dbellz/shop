"use server";
import { randomBytes } from "node:crypto";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { sendOrderConfirmation } from "@/lib/email";
import { shippingFor } from "@/lib/types";

const schema = z.object({
  email: z.email("Enter a valid email"),
  full_name: z.string().trim().min(2, "Enter your full name").max(100),
  phone: z.string().trim().max(30).optional(),
  address_line1: z.string().trim().min(3, "Enter your address").max(200),
  address_line2: z.string().trim().max(200).optional(),
  city: z.string().trim().min(2, "Enter your city").max(100),
  state: z.string().trim().max(100).optional(),
  postal_code: z.string().trim().min(2, "Enter your postal code").max(20),
  country: z.string().trim().min(2, "Enter your country").max(100),
  items: z
    .array(
      z.object({
        productId: z.uuid(),
        color: z.string().max(50),
        size: z.string().max(20),
        quantity: z.number().int().min(1).max(20),
      }),
    )
    .min(1, "Your cart is empty")
    .max(50),
});

export type CheckoutInput = z.input<typeof schema>;
export type CheckoutResult = { error: string } | { orderId: string };

export async function placeOrder(input: CheckoutInput): Promise<CheckoutResult> {
  const parsed = schema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const { items, ...customer } = parsed.data;

  // Prices always come from the database, never from the client.
  const admin = createAdminClient();
  const { data: products, error: pErr } = await admin
    .from("products")
    .select("id,name,price_cents,colors,sizes")
    .in("id", [...new Set(items.map((i) => i.productId))])
    .eq("active", true);
  if (pErr) return { error: "Could not load products. Please try again." };

  const lines = [];
  for (const i of items) {
    const p = products?.find((x) => x.id === i.productId);
    if (!p) return { error: "An item in your cart is no longer available." };
    if (!p.sizes.includes(i.size) || !p.colors.some((c: { name: string }) => c.name === i.color))
      return { error: `${p.name} is not available in that color/size.` };
    lines.push({ product_id: p.id, name: p.name, color: i.color, size: i.size, unit_price_cents: p.price_cents, quantity: i.quantity });
  }
  const subtotal = lines.reduce((n, l) => n + l.unit_price_cents * l.quantity, 0);
  const shipping = shippingFor(subtotal);

  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();

  const orderNumber = `TL-${randomBytes(4).toString("hex").toUpperCase()}`;
  const { data: order, error } = await admin
    .from("orders")
    .insert({
      ...customer,
      order_number: orderNumber,
      user_id: auth.user?.id ?? null,
      subtotal_cents: subtotal,
      shipping_cents: shipping,
      total_cents: subtotal + shipping,
    })
    .select("id")
    .single();
  if (error || !order) return { error: "Could not place your order. Please try again." };

  const { error: itemsErr } = await admin.from("order_items").insert(lines.map((l) => ({ ...l, order_id: order.id })));
  if (itemsErr) {
    await admin.from("orders").delete().eq("id", order.id);
    return { error: "Could not place your order. Please try again." };
  }

  const address = [customer.address_line1, customer.address_line2, `${customer.city}${customer.state ? ", " + customer.state : ""} ${customer.postal_code}`, customer.country]
    .filter(Boolean)
    .join("\n");
  const sent = await sendOrderConfirmation({
    orderNumber,
    to: customer.email,
    name: customer.full_name,
    items: lines,
    subtotalCents: subtotal,
    shippingCents: shipping,
    totalCents: subtotal + shipping,
    address,
  }).catch((e) => {
    console.error(e);
    return false;
  });
  if (sent) await admin.from("orders").update({ confirmation_email_sent_at: new Date().toISOString() }).eq("id", order.id);

  return { orderId: order.id };
}
