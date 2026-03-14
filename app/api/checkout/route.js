import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { getStripe } from "@/lib/payments";
import { getServiceById, getServiceLabel, isPastDateTime } from "@/lib/booking";

export async function POST(request) {
  try {
    const body = await request.json();
    const { fullName, phone, date, time, serviceId } = body;

    if (!fullName || !phone || !date || !time || !serviceId) {
      return NextResponse.json(
        { error: "Missing required booking fields" },
        { status: 400 }
      );
    }

    if (isPastDateTime(date, time)) {
      return NextResponse.json(
        { error: "Cannot book a past time slot" },
        { status: 400 }
      );
    }

    const service = getServiceById(serviceId);

    if (!service) {
      return NextResponse.json(
        { error: "Invalid service selected" },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    const { data: existing, error: existingError } = await supabase
      .from("bookings")
      .select("id")
      .eq("booking_date", date)
      .eq("booking_time", time)
      .in("status", ["pending", "confirmed"])
      .limit(1);

    if (existingError) throw existingError;

    if (existing?.length > 0) {
      return NextResponse.json(
        { error: "هذا الموعد محجوز بالفعل" },
        { status: 409 }
      );
    }

    const { data: inserted, error: insertError } = await supabase
      .from("bookings")
      .insert({
        full_name: fullName,
        phone,
        booking_date: date,
        booking_time: time,
        service_id: service.id,
        service_name: getServiceLabel(service),
        service_price: service.price,
        deposit_amount: service.deposit,
        status: "pending",
        payment_status: "unpaid"
      })
      .select()
      .single();

    if (insertError) throw insertError;

    const stripe = getStripe();
    const origin =
      request.headers.get("origin") || process.env.NEXT_PUBLIC_APP_URL;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "sar",
            product_data: {
              name: `${getServiceLabel(service)} Deposit`,
              description: `Rezo Lash booking on ${date} at ${time}`
            },
            unit_amount: service.deposit * 100
          },
          quantity: 1
        }
      ],
      mode: "payment",
      metadata: {
        bookingId: inserted.id
      },
      success_url: `${origin}/success`,
      cancel_url: `${origin}/booking`
    });

    const { error: updateError } = await supabase
      .from("bookings")
      .update({
        stripe_session_id: session.id
      })
      .eq("id", inserted.id);

    if (updateError) throw updateError;

    return NextResponse.json({ url: session.url });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Checkout failed" },
      { status: 500 }
    );
  }
}
