import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { getStripe } from "@/lib/payments";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(request) {
  const stripe = getStripe();
  const body = await request.text();
  const signature = headers().get("stripe-signature");

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const bookingId = session.metadata?.bookingId;

      if (bookingId) {
        const supabase = getSupabaseAdmin();

        const { error } = await supabase
          .from("bookings")
          .update({
            status: "confirmed",
            payment_status: "paid"
          })
          .eq("id", bookingId);

        if (error) {
          throw error;
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    return NextResponse.json(
      { error: `Webhook Error: ${error.message}` },
      { status: 400 }
    );
  }
}
