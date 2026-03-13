Rezo Lash - Corrected Project

Important:
1) Copy .env.local.example to .env.local and fill all values.
2) Install packages:
   npm install
3) Run locally:
   npm run dev

Supabase SQL:
create extension if not exists pgcrypto;

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text not null,
  booking_date date not null,
  booking_time text not null,
  service_id text not null,
  service_name text not null,
  service_price integer not null,
  deposit_amount integer not null,
  stripe_session_id text,
  status text not null default 'pending',
  payment_status text not null default 'unpaid',
  created_at timestamptz not null default now()
);

create table if not exists public.settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create index if not exists bookings_date_idx on public.bookings (booking_date);
create index if not exists bookings_status_idx on public.bookings (status);

create unique index if not exists unique_active_slot
on public.bookings (booking_date, booking_time)
where status in ('pending', 'confirmed');

insert into public.settings (key, value)
values ('time_slots', '{"slots":["11:00","13:30","16:00","18:30"]}')
on conflict (key) do nothing;
