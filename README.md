# Threadline – shop

Next.js (App Router) store for **round neck tops, sweatshirts and snapback caps**, with a checkout page, Supabase persistence, Google sign-in and emailed order confirmations (Resend).

## Setup

1. `npm install`
2. **Supabase**: create a project, then run `supabase/migrations/0001_init.sql` followed by `supabase/seed.sql` in the SQL editor (or `supabase db push`).
3. Copy `.env.example` to `.env.local` and fill in the Supabase URL, anon key and service-role key (Project Settings → API), plus `RESEND_API_KEY` / `EMAIL_FROM`.
4. **Google auth** (Google Cloud Console):
   - APIs & Services → OAuth consent screen: configure it (External).
   - Credentials → Create credentials → OAuth client ID → *Web application*.
   - Authorized redirect URI: `https://<project-ref>.supabase.co/auth/v1/callback`
   - Authorized JavaScript origins: your site URLs (e.g. `http://localhost:3000`).
   - In Supabase: Authentication → Providers → Google → enable and paste the Client ID / Secret.
   - Supabase → Authentication → URL Configuration: Site URL = your site; add `http://localhost:3000/auth/callback` (and your production `/auth/callback`) to Redirect URLs.
5. **Email**: create a Resend API key. Without a verified domain Resend only sends from `onboarding@resend.dev` to your own account email; verify a domain to email customers.
6. `npm run dev` → http://localhost:3000

## How it works

- Catalog (`products`), `orders`, `order_items` and `profiles` live in Supabase Postgres with RLS (see migration).
- The cart lives in the browser (localStorage); checkout (`app/checkout/actions.ts`) re-prices every line from the database, stores the order with the service-role key, then sends the confirmation email.
- Guests can check out; signed-in users also get a "My orders" page. Payment is cash on delivery (no payment gateway is wired up).
