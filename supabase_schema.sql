create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  full_name text not null,
  phone text not null,
  booking_date date not null,
  booking_time text not null,
  service_id text not null,
  service_name text not null,
  service_price numeric default 0,
  deposit_amount numeric default 0,
  status text default 'pending',
  payment_status text default 'unpaid',
  stripe_session_id text
);

create table if not exists settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb
);
