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
    const bookingDate = body.date || current.booking_date || current.date;
    const bookingTime = body.time || current.booking_time || current.time;
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
      service_price: Number.isFinite(body.price) ? body.price : current.service_price,
      deposit_amount: Number.isFinite(body.deposit) ? body.deposit : current.deposit_amount,
    };

    if (nextService) {
      payload.service_id = nextService.id;
      payload.service_name = getServiceLabel(nextService);
      if (!(Number.isFinite(body.price))) payload.service_price = nextService.price;
      if (!(Number.isFinite(body.deposit))) payload.deposit_amount = nextService.deposit;
    }

    const { data: updated, error: updateError } = await supabase
      .from("bookings")
      .update(payload)
      .eq("id", bookingId)
      .select("*")
      .single();

    if (updateError) throw updateError;

    const normalized = {
      id: updated.id,
      name: updated.full_name || "",
      phone: updated.phone || "",
      service: updated.service_name || "",
      date: updated.booking_date || "",
      time: updated.booking_time || "",
      price: updated.service_price ?? 0,
      deposit: updated.deposit_amount ?? 0,
      status: updated.status || "pending",
      created_at: updated.created_at || "",
      style: updated.style || "",
      lower_lashes: updated.lower_lashes ?? false,
      lash_removal: updated.lash_removal ?? false,
    };

    return NextResponse.json({ booking: normalized });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to update booking" },
      { status: 500 }
    );
  }
}
