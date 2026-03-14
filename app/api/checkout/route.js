
import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { getStripe } from "@/lib/payments";
import {
  calculateBookingTotals,
  getDisplayTime,
  getRemovalLabel,
  getServiceById,
  getServiceLabel,
  getStyleLabel,
  isPastDateTime
} from "@/lib/booking";

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      fullName,
      phone,
      date,
      time,
      serviceId,
      styleId,
      removalOption = "no-removal",
      addLowerLashes = false,
      acceptedPolicy = false
    } = body;

    if (!fullName || !phone || !date || !time || !serviceId) {
      return NextResponse.json({ error: "Missing required booking fields" }, { status: 400 });
    }

    if (!acceptedPolicy) {
      return NextResponse.json({ error: "يرجى الموافقة على سياسة العربون قبل الدفع." }, { status: 400 });
    }

    if (isPastDateTime(date, time)) {
      return NextResponse.json({ error: "Cannot book a past time slot" }, { status: 400 });
    }

    const service = getServiceById(serviceId);
    if (!service) {
      return NextResponse.json({ error: "Invalid service selected" }, { status: 400 });
    }

    const totals = calculateBookingTotals(serviceId, removalOption, addLowerLashes);
    const styleLabel = styleId ? getStyleLabel(serviceId, styleId) : "";
    const removalLabel = service.allowsRemovalOption ? getRemovalLabel(removalOption) : "";
    const lowerLashesLabel = service.allowsLowerLashes && addLowerLashes ? "+ رموش سفلية" : "";
    const serviceLabel = getServiceLabel(service);

    const detailParts = [serviceLabel];
    if (styleLabel) detailParts.push(styleLabel);
    if (removalLabel) detailParts.push(removalLabel);
    if (lowerLashesLabel) detailParts.push(lowerLashesLabel);
    const detailedServiceName = detailParts.join(" — ");

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
      return NextResponse.json({ error: "هذا الموعد محجوز بالفعل" }, { status: 409 });
    }

    const { data: inserted, error: insertError } = await supabase
      .from("bookings")
      .insert({
        full_name: fullName,
        phone,
        booking_date: date,
        booking_time: time,
        service_id: service.id,
        service_name: detailedServiceName,
        service_price: totals.totalPrice,
        deposit_amount: totals.deposit,
        status: "pending",
        payment_status: "unpaid"
      })
      .select()
      .single();

    if (insertError) throw insertError;

    const stripe = getStripe();
    const origin = request.headers.get("origin") || process.env.NEXT_PUBLIC_APP_URL;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "sar",
            product_data: {
              name: `${serviceLabel} Deposit`,
              description: [styleLabel, removalLabel, lowerLashesLabel, date, getDisplayTime(time)].filter(Boolean).join(" | ")
            },
            unit_amount: totals.deposit * 100
          },
          quantity: 1
        }
      ],
      mode: "payment",
      metadata: {
        bookingId: inserted.id,
        serviceLabel,
        styleLabel,
        removalLabel,
        lowerLashesLabel,
        totalPrice: String(totals.totalPrice),
        depositAmount: String(totals.deposit)
      },
      success_url: `${origin}/success`,
      cancel_url: `${origin}/booking`
    });

    const { error: updateError } = await supabase
      .from("bookings")
      .update({ stripe_session_id: session.id })
      .eq("id", inserted.id);

    if (updateError) throw updateError;

    return NextResponse.json({ url: session.url });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Checkout failed" }, { status: 500 });
  }
}
