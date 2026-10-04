"use client";
import Link from "next/link";
import { useCart } from "@/lib/cart";

export function CartLink() {
  const { count, ready } = useCart();
  return (
    <Link href="/cart" className="rounded-full bg-zinc-900 text-white px-4 py-1.5 font-medium">
      Cart{ready && count > 0 ? ` (${count})` : ""}
    </Link>
  );
}
