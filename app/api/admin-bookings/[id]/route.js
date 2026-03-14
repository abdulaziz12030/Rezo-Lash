
import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { calculateBookingTotals, getServiceById, getServiceLabel } from "@/lib/booking";

export async function PATCH(request, { params }) {
  try {
    const bookingId = params.id;
    const body = await request.json();
    const supabase = getSupabaseAdmin();

    const { data: current, error: currentError } = await supabase
      .from("bookings")
      .select("*")
      .eq("id", bookingId)
      .single();

    if (currentError) throw currentError;

    const nextService = body.serviceId ? getServiceById(body.serviceId) : null;
    const bookingDate = body.booking_date || current.booking_date;
    const bookingTime = body.booking_time || current.booking_time;
    const status = body.status || current.status;

    const { data: conflicting, error: conflictingError } = await supabase
      .from("bookings")
      .select("id")
      .eq("booking_date", bookingDate)
      .eq("booking_time", bookingTime)
      .neq("id", bookingId)
      .in("status", ["pending", "confirmed"])
      .limit(1);

    if (conflictingError) throw conflictingError;
    if (conflicting?.length && ["pending", "confirmed"].includes(status)) {
      return NextResponse.json({ error: "يوجد حجز آخر على نفس الموعد." }, { status: 409 });
    }

    const payload = {
      booking_date: bookingDate,
      booking_time: bookingTime,
      status,
      service_price: Number.isFinite(body.service_price) ? body.service_price : current.service_price,
      deposit_amount: Number.isFinite(body.deposit_amount) ? body.deposit_amount : current.deposit_amount
    };

    if (nextService) {
      const totals = calculateBookingTotals(nextService.id, "no-removal", false);
      payload.service_id = nextService.id;
      payload.service_name = getServiceLabel(nextService);
      if (!body.service_price && body.service_price !== 0) payload.service_price = totals.totalPrice;
      if (!body.deposit_amount && body.deposit_amount !== 0) payload.deposit_amount = totals.deposit;
    }

    const { data: updated, error: updateError } = await supabase
      .from("bookings")
      .update(payload)
      .eq("id", bookingId)
      .select("*")
      .single();

    if (updateError) throw updateError;

    return NextResponse.json({ booking: updated });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to update booking" },
      { status: 500 }
    );
  }
}
