-- Create bookings table if it does not exist
create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text,
  phone text,
  service text,
  style text,
  lower_lashes boolean default false,
  lash_removal boolean default false,
  price numeric default 0,
  deposit numeric default 0,
  date date,
  time text,
  status text default 'pending'
);

-- Add any missing columns for projects created from older versions
alter table public.bookings add column if not exists name text;
alter table public.bookings add column if not exists phone text;
alter table public.bookings add column if not exists service text;
alter table public.bookings add column if not exists style text;
alter table public.bookings add column if not exists lower_lashes boolean default false;
alter table public.bookings add column if not exists lash_removal boolean default false;
alter table public.bookings add column if not exists price numeric default 0;
alter table public.bookings add column if not exists deposit numeric default 0;
alter table public.bookings add column if not exists date date;
alter table public.bookings add column if not exists time text;
alter table public.bookings add column if not exists status text default 'pending';
alter table public.bookings add column if not exists created_at timestamptz not null default now();

-- Optional settings table for custom time slots in admin settings
create table if not exists public.settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb
);
