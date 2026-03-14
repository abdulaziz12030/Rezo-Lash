import { NextResponse } from "next/server";
import { getServiceById, getServiceLabel, isPastDateTime } from "@/lib/booking";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const supabase = getSupabaseAdmin();

    const { data: existing, error: existingError } = await supabase
      .from("bookings")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (existingError) throw existingError;
    if (!existing) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    const service = body.serviceId ? getServiceById(body.serviceId) : getServiceById(existing.service_id);
    if (!service) {
      return NextResponse.json({ error: "Invalid service selected" }, { status: 400 });
    }

    const booking_date = body.booking_date || existing.booking_date;
    const booking_time = body.booking_time || existing.booking_time;
    if (isPastDateTime(booking_date, booking_time)) {
      return NextResponse.json({ error: "Cannot move booking to a past time" }, { status: 400 });
    }

    const { data: clash, error: clashError } = await supabase
      .from("bookings")
      .select("id")
      .eq("booking_date", booking_date)
      .eq("booking_time", booking_time)
      .in("status", ["pending", "confirmed"])
      .neq("id", id)
      .limit(1);

    if (clashError) throw clashError;
    if (clash?.length) {
      return NextResponse.json({ error: "هذا الموعد محجوز بالفعل" }, { status: 409 });
    }

    const patch = {
      service_id: service.id,
      service_name: getServiceLabel(service),
      booking_date,
      booking_time,
      service_price: typeof body.service_price === "number" && !Number.isNaN(body.service_price) ? body.service_price : service.price,
      deposit_amount: typeof body.deposit_amount === "number" && !Number.isNaN(body.deposit_amount) ? body.deposit_amount : service.deposit,
      status: body.status || existing.status
    };

    const { data: updated, error: updateError } = await supabase
      .from("bookings")
      .update(patch)
      .eq("id", id)
      .select("*")
      .single();

    if (updateError) throw updateError;

    return NextResponse.json({ booking: updated });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Failed to update booking" }, { status: 500 });
  }
}
