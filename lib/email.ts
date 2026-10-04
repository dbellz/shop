import "server-only";
import { Resend } from "resend";
import { money } from "@/lib/types";

type OrderEmail = {
  orderNumber: string;
  to: string;
  name: string;
  items: { name: string; color: string; size: string; quantity: number; unit_price_cents: number }[];
  subtotalCents: number;
  shippingCents: number;
  totalCents: number;
  address: string;
};

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export async function sendOrderConfirmation(o: OrderEmail): Promise<boolean> {
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY not set; skipping confirmation email");
    return false;
  }
  const rows = o.items
    .map(
      (i) => `<tr><td style="padding:6px 0">${esc(i.name)}<br><small style="color:#666">${esc(i.color)} / ${esc(i.size)} × ${i.quantity}</small></td>
<td style="text-align:right">${money(i.unit_price_cents * i.quantity)}</td></tr>`,
    )
    .join("");
  const html = `<div style="font-family:Arial,sans-serif;max-width:520px;margin:auto">
<h2>Thanks for your order, ${esc(o.name)}!</h2>
<p>Order <b>${esc(o.orderNumber)}</b> is confirmed. You'll pay on delivery.</p>
<table style="width:100%;border-collapse:collapse">${rows}
<tr><td style="padding-top:12px;border-top:1px solid #ddd">Subtotal</td><td style="text-align:right;border-top:1px solid #ddd">${money(o.subtotalCents)}</td></tr>
<tr><td>Shipping</td><td style="text-align:right">${o.shippingCents ? money(o.shippingCents) : "Free"}</td></tr>
<tr><td><b>Total</b></td><td style="text-align:right"><b>${money(o.totalCents)}</b></td></tr></table>
<p><b>Shipping to</b><br>${esc(o.address).replace(/\n/g, "<br>")}</p></div>`;
  const { error } = await new Resend(process.env.RESEND_API_KEY).emails.send({
    from: process.env.EMAIL_FROM ?? "Shop <onboarding@resend.dev>",
    to: o.to,
    subject: `Order ${o.orderNumber} confirmed`,
    html,
  });
  if (error) {
    console.error("Confirmation email failed", error);
    return false;
  }
  return true;
}
