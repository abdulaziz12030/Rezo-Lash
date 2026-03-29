Supabase final setup for Rezo Lash

1) In Vercel > Environment Variables add:
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY
- ADMIN_PASSWORD
- ADMIN_SESSION_SECRET

2) In Supabase run supabase_schema.sql in SQL Editor.
   This file creates/repairs:
   - bookings table
   - settings table

3) Redeploy the project in Vercel.

Notes:
- Availability now reads from bookings.date and bookings.time.
- Admin dashboard now reads from the simple bookings schema you created.
- If Stripe keys are not set, checkout will still save the booking and redirect to /success.
- If settings table is missing, the site falls back to default time slots.
