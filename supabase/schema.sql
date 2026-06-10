-- Run this in Supabase SQL Editor (supabase.com → your project → SQL)
-- Then add env vars to Vercel: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, ADMIN_PASSWORD

create table if not exists products (
  id text primary key,
  slug text unique not null,
  name text not null,
  price numeric not null default 0,
  category text not null default 'Streetwear',
  is_new boolean not null default false,
  in_stock boolean not null default true,
  images jsonb not null default '[]',
  colors jsonb not null default '[]',
  description text not null default '',
  details text not null default '',
  sizes jsonb not null default '[]',
  buy_link text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists orders (
  id text primary key,
  created_at timestamptz not null default now(),
  status text not null default 'pending_prebook',
  customer jsonb not null,
  items jsonb not null,
  subtotal numeric not null default 0,
  prebook_amount numeric not null default 0
);

create index if not exists products_slug_idx on products (slug);
create index if not exists orders_created_at_idx on orders (created_at desc);
