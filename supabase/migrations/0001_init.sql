create extension if not exists pgcrypto;

create table public.products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  category text not null check (category in ('tops','sweatshirts','caps')),
  description text not null,
  price_cents integer not null check (price_cents >= 0),
  colors jsonb not null default '[]',
  sizes text[] not null default '{}',
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.profiles (
  id uuid primary key references auth.users on delete cascade,
  email text,
  full_name text,
  avatar_url text,
  created_at timestamptz not null default now()
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text unique not null,
  user_id uuid references auth.users on delete set null,
  email text not null,
  full_name text not null,
  phone text,
  address_line1 text not null,
  address_line2 text,
  city text not null,
  state text,
  postal_code text not null,
  country text not null,
  subtotal_cents integer not null,
  shipping_cents integer not null,
  total_cents integer not null,
  payment_method text not null default 'cod',
  status text not null default 'placed',
  confirmation_email_sent_at timestamptz,
  created_at timestamptz not null default now()
);
create index orders_user_idx on public.orders (user_id, created_at desc);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders on delete cascade,
  product_id uuid references public.products on delete set null,
  name text not null,
  color text not null,
  size text not null,
  unit_price_cents integer not null,
  quantity integer not null check (quantity > 0)
);
create index order_items_order_idx on public.order_items (order_id);

-- RLS: catalog is public; orders are only readable by their owner.
-- Orders are written server-side with the service role key (bypasses RLS).
alter table public.products enable row level security;
alter table public.profiles enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

create policy "products are public" on public.products for select using (active);
create policy "own profile" on public.profiles for select using (auth.uid() = id);
create policy "own profile update" on public.profiles for update using (auth.uid() = id);
create policy "own orders" on public.orders for select using (auth.uid() = user_id);
create policy "own order items" on public.order_items for select
  using (exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid()));

-- Create a profile whenever someone signs up (e.g. with Google).
create function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (new.id, new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    new.raw_user_meta_data->>'avatar_url')
  on conflict (id) do nothing;
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();
