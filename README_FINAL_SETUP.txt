REZO LASH FINAL SETUP

Added in this version:
- Homepage improvements
- Services in Arabic + English
- Free Consultation service
- Fixed appointment slots: 9 AM, 11 AM, 4 PM, 6 PM, 8 PM
- Admin can edit service, date, time, price, deposit and status
- Archive / restore bookings
- Customer booking history count
- WhatsApp confirmation button on success page
- WhatsApp button inside admin bookings

IMPORTANT ABOUT WHATSAPP:
This version creates a ready WhatsApp message link.
For fully automatic outbound WhatsApp messages to clients, you need WhatsApp Business API.

Environment Variables required in Vercel:
NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
ADMIN_PASSWORD=
ADMIN_SESSION_SECRET=
NEXT_PUBLIC_WHATSAPP_NUMBER=9665XXXXXXXX

Supabase tables expected:
1) bookings
2) settings

Recommended image replacement:
Current service images are local placeholders (.svg). Replace them inside /public/services/ with your own approved realistic model photos using the same filenames if desired.
