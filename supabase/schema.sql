-- Run this in Supabase SQL Editor (supabase.com → your project → SQL)
-- Then add env vars to Vercel: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, ADMIN_PASSWORD

create table if not exists products (
  id text primary key,
  slug text unique not null,
  name text not null,
  price numeric not null default 0,
  category text not null default 'Men',
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

-- Profiles table for customer address and details
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  address text,
  city text,
  state text,
  pincode text,
  updated_at timestamptz not null default now()
);

-- Enable Row Level Security
alter table profiles enable row level security;

-- Policies (Dropped first to avoid "policy already exists" errors when run multiple times)
drop policy if exists "Users can view their own profile." on profiles;
create policy "Users can view their own profile." on profiles
  for select using (auth.uid() = id);

drop policy if exists "Users can insert their own profile." on profiles;
create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

drop policy if exists "Users can update their own profile." on profiles;
create policy "Users can update their own profile." on profiles
  for update using (auth.uid() = id);


-- Alter products table to support size-specific pricing
alter table products add column if not exists size_prices jsonb not null default '{}';

-- Reviews table
create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  product_id text not null references products(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  user_email text not null,
  user_name text not null,
  rating integer not null check (rating >= 1 and rating <= 5),
  comment text not null default '',
  media jsonb not null default '[]',
  created_at timestamptz not null default now()
);

-- Indexing for speed
create index if not exists reviews_product_id_idx on reviews (product_id);
create index if not exists reviews_created_at_idx on reviews (created_at desc);

-- RLS policies
alter table reviews enable row level security;

drop policy if exists "Reviews are publicly visible." on reviews;
create policy "Reviews are publicly visible." on reviews
  for select using (true);

drop policy if exists "Authenticated users can create reviews." on reviews;
create policy "Authenticated users can create reviews." on reviews
  for insert with check (auth.uid() = user_id);
