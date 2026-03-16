import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { getServiceById, getServiceLabel } from "@/lib/booking";

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
    const bookingDate = body.date || current.date;
    const bookingTime = body.time || current.time;
    const status = body.status || current.status;

    const { data: conflicting, error: conflictingError } = await supabase
      .from("bookings")
      .select("id")
      .eq("date", bookingDate)
      .eq("time", bookingTime)
      .neq("id", bookingId)
      .in("status", ["pending", "confirmed"])
      .limit(1);

    if (conflictingError) throw conflictingError;
    if (conflicting?.length && ["pending", "confirmed"].includes(status)) {
      return NextResponse.json({ error: "يوجد حجز آخر على نفس الموعد." }, { status: 409 });
    }

    const payload = {
      date: bookingDate,
      time: bookingTime,
      status,
      price: Number.isFinite(body.price) ? body.price : current.price,
      deposit: Number.isFinite(body.deposit) ? body.deposit : current.deposit
    };

    if (nextService) {
      payload.service = getServiceLabel(nextService);
      if (!(Number.isFinite(body.price))) payload.price = nextService.price;
      if (!(Number.isFinite(body.deposit))) payload.deposit = nextService.deposit;
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
    return NextResponse.json({ error: error.message || "Failed to update booking" }, { status: 500 });
  }
}
