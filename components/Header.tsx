import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { CartLink } from "./CartLink";

export async function Header() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const user = data.user;
  return (
    <header className="border-b border-zinc-200 bg-white sticky top-0 z-10">
      <div className="mx-auto max-w-6xl flex items-center justify-between px-4 h-16">
        <Link href="/" className="text-xl font-black tracking-tight">THREADLINE</Link>
        <nav className="hidden sm:flex gap-6 text-sm font-medium">
          <Link href="/shop?category=tops">Tops</Link>
          <Link href="/shop?category=sweatshirts">Sweatshirts</Link>
          <Link href="/shop?category=caps">Caps</Link>
        </nav>
        <div className="flex items-center gap-4 text-sm">
          {user ? (
            <>
              <Link href="/orders" className="hover:underline">My orders</Link>
              <form action="/auth/signout" method="post">
                <button className="hover:underline">Sign out</button>
              </form>
            </>
          ) : (
            <Link href="/login" className="hover:underline">Sign in</Link>
          )}
          <CartLink />
        </div>
      </div>
    </header>
  );
}
