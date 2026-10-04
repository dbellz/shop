import { createClient } from "@/lib/supabase/server";
import { CheckoutForm } from "./CheckoutForm";

export default async function CheckoutPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const user = data.user;
  return (
    <CheckoutForm
      signedIn={!!user}
      defaultEmail={user?.email ?? ""}
      defaultName={(user?.user_metadata?.full_name as string | undefined) ?? ""}
    />
  );
}
