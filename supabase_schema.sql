create extension if not exists pgcrypto;

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  full_name text not null,
  phone text not null,
  service_id text not null,
  service_name text not null,
  style text,
  lower_lashes boolean not null default false,
  lash_removal boolean not null default false,
  removal_option text,
  service_price numeric not null default 0,
  deposit_amount numeric not null default 0,
  booking_date date not null,
  booking_time text not null,
  status text not null default 'pending',
  payment_status text not null default 'unpaid',
  stripe_session_id text,
  notes text
);

-- Compatibility migration for projects created on older schema versions
alter table public.bookings add column if not exists created_at timestamptz not null default now();
alter table public.bookings add column if not exists full_name text;
alter table public.bookings add column if not exists phone text;
alter table public.bookings add column if not exists service_id text;
alter table public.bookings add column if not exists service_name text;
alter table public.bookings add column if not exists style text;
alter table public.bookings add column if not exists lower_lashes boolean not null default false;
alter table public.bookings add column if not exists lash_removal boolean not null default false;
alter table public.bookings add column if not exists removal_option text;
alter table public.bookings add column if not exists service_price numeric not null default 0;
alter table public.bookings add column if not exists deposit_amount numeric not null default 0;
alter table public.bookings add column if not exists booking_date date;
alter table public.bookings add column if not exists booking_time text;
alter table public.bookings add column if not exists status text not null default 'pending';
alter table public.bookings add column if not exists payment_status text not null default 'unpaid';
alter table public.bookings add column if not exists stripe_session_id text;
alter table public.bookings add column if not exists notes text;

-- Backfill from legacy columns when present
update public.bookings
set
  full_name = coalesce(full_name, name),
  service_name = coalesce(service_name, service),
  service_price = coalesce(nullif(service_price, 0), price, 0),
  deposit_amount = coalesce(nullif(deposit_amount, 0), deposit, 0),
  booking_date = coalesce(booking_date, date),
  booking_time = coalesce(booking_time, time)
where
  full_name is null
  or service_name is null
  or booking_date is null
  or booking_time is null
  or service_price = 0
  or deposit_amount = 0;

-- Keep a unique index for active slots only
create unique index if not exists bookings_unique_active_slot
  on public.bookings (booking_date, booking_time)
  where status in ('pending', 'confirmed');

create index if not exists bookings_created_at_idx on public.bookings (created_at desc);
create index if not exists bookings_booking_date_idx on public.bookings (booking_date);

create table if not exists public.settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb
);

insert into public.settings (key, value)
values ('time_slots', '{"slots":["09:00","11:00","16:00","18:00","20:00"]}'::jsonb)
on conflict (key) do nothing;
