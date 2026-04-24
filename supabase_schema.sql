-- Rezo Lash unified schema + migration
create extension if not exists pgcrypto;

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  full_name text,
  phone text,
  service_id text,
  service_name text,
  service_price numeric default 0,
  deposit_amount numeric default 0,
  booking_date date,
  booking_time text,
  status text default 'pending',
  payment_status text default 'unpaid',
  stripe_session_id text,
  style text,
  lower_lashes boolean default false,
  lash_removal boolean default false,
  removal_option text,
  notes text,
  -- legacy columns kept for backward compatibility
  name text,
  service text,
  price numeric default 0,
  deposit numeric default 0,
  date date,
  time text
);

alter table public.bookings add column if not exists created_at timestamptz not null default now();
alter table public.bookings add column if not exists full_name text;
alter table public.bookings add column if not exists phone text;
alter table public.bookings add column if not exists service_id text;
alter table public.bookings add column if not exists service_name text;
alter table public.bookings add column if not exists service_price numeric default 0;
alter table public.bookings add column if not exists deposit_amount numeric default 0;
alter table public.bookings add column if not exists booking_date date;
alter table public.bookings add column if not exists booking_time text;
alter table public.bookings add column if not exists status text default 'pending';
alter table public.bookings add column if not exists payment_status text default 'unpaid';
alter table public.bookings add column if not exists stripe_session_id text;
alter table public.bookings add column if not exists style text;
alter table public.bookings add column if not exists lower_lashes boolean default false;
alter table public.bookings add column if not exists lash_removal boolean default false;
alter table public.bookings add column if not exists removal_option text;
alter table public.bookings add column if not exists notes text;
alter table public.bookings add column if not exists name text;
alter table public.bookings add column if not exists service text;
alter table public.bookings add column if not exists price numeric default 0;
alter table public.bookings add column if not exists deposit numeric default 0;
alter table public.bookings add column if not exists date date;
alter table public.bookings add column if not exists time text;

update public.bookings
set
  full_name = coalesce(full_name, name),
  service_name = coalesce(service_name, service),
  service_price = coalesce(service_price, price, 0),
  deposit_amount = coalesce(deposit_amount, deposit, 0),
  booking_date = coalesce(booking_date, date),
  booking_time = coalesce(booking_time, time),
  name = coalesce(name, full_name),
  service = coalesce(service, service_name),
  price = coalesce(price, service_price, 0),
  deposit = coalesce(deposit, deposit_amount, 0),
  date = coalesce(date, booking_date),
  time = coalesce(time, booking_time),
  payment_status = coalesce(payment_status, 'unpaid'),
  lower_lashes = coalesce(lower_lashes, false),
  lash_removal = coalesce(lash_removal, false),
  removal_option = coalesce(removal_option, case when lash_removal = true then 'needs-removal' else 'no-removal' end);

create index if not exists idx_bookings_booking_date on public.bookings (booking_date);
create index if not exists idx_bookings_booking_date_time on public.bookings (booking_date, booking_time);
create index if not exists idx_bookings_status on public.bookings (status);

create table if not exists public.settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.settings add column if not exists updated_at timestamptz not null default now();

insert into public.settings (key, value)
values ('time_slots', '{"slots": ["09:00", "11:00", "16:00", "18:00", "20:00"]}'::jsonb)
on conflict (key) do nothing;
