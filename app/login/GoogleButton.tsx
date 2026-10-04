"use client";
import { createClient } from "@/lib/supabase/client";

export function GoogleButton({ next }: { next: string }) {
  async function signIn() {
    await createClient().auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}` },
    });
  }
  return (
    <button onClick={signIn} className="w-full rounded-full border border-zinc-300 py-3 font-semibold hover:bg-zinc-50">
      Continue with Google
    </button>
  );
}
