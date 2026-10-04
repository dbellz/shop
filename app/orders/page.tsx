import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { money } from "@/lib/types";

export default async function Orders() {
  const supabase = await createClient();
  const { data: orders } = await supabase.from("orders").select("id,order_number,total_cents,status,created_at").order("created_at", { ascending: false });
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-black mb-6">My orders</h1>
      {!orders?.length ? <p className="text-zinc-500">No orders yet.</p> : (
        <ul className="divide-y divide-zinc-200 border-y">
          {orders.map((o) => (
            <li key={o.id} className="flex justify-between py-3">
              <Link href={`/order/${o.id}`} className="underline">{o.order_number}</Link>
              <span className="text-sm text-zinc-500">{new Date(o.created_at).toLocaleDateString()} · {o.status}</span>
              <span>{money(o.total_cents)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
