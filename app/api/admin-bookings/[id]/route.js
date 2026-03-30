import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import {
  getServiceById,
  getServiceLabel,
  getStyleLabel,
  calculateBookingTotals,
} from "@/lib/booking";

function normalizeBooking(row) {
  return {
    id: row.id,
    name: row.full_name || "",
    phone: row.phone || "",
    service: row.service_name || "",
    service_id: row.service_id || "",
    date: row.booking_date || "",
    time: row.booking_time || "",
    price: row.service_price ?? 0,
    deposit: row.deposit_amount ?? 0,
    status: row.status || "pending",
    created_at: row.created_at || "",
    style: row.style || "",
    lower_lashes: row.lower_lashes ?? false,
    lash_removal: row.lash_removal ?? false,
    removal_option: row.removal_option || "no-removal",
    payment_status: row.payment_status || "unpaid",
    notes: row.notes || "",
  };
}

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

    const nextService = body.serviceId
      ? getServiceById(body.serviceId)
      : getServiceById(current.service_id);

    const bookingDate = body.date || current.booking_date;
    const bookingTime = body.time || current.booking_time;
    const status = body.status || current.status;
    const paymentStatus = body.paymentStatus || current.payment_status || "unpaid";

    const lowerLashes =
      typeof body.lowerLashes === "boolean"
        ? body.lowerLashes
        : Boolean(current.lower_lashes);

    const removalOption =
      body.removalOption ||
      current.removal_option ||
      (current.lash_removal ? "needs-removal" : "no-removal");

    const styleId = body.styleId || null;

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
      return NextResponse.json(
        { error: "يوجد حجز آخر على نفس الموعد." },
        { status: 409 }
      );
    }

    const totals = calculateBookingTotals(nextService, {
      lowerLashes,
      removalOption,
    });

    const payload = {
      booking_date: bookingDate,
      booking_time: bookingTime,
      status,
      payment_status: paymentStatus,
      service_price: totals.totalPrice,
      deposit_amount: totals.depositAmount,
      lower_lashes: lowerLashes,
      lash_removal: removalOption === "needs-removal",
      removal_option: removalOption,
      notes: body.notes ?? current.notes ?? "",
    };

    if (nextService) {
      payload.service_id = nextService.id;
      payload.service_name = getServiceLabel(nextService);
    }

    if (styleId && nextService?.id) {
      payload.style = getStyleLabel(nextService.id, styleId);
    } else if (body.styleId === "" || body.styleId === null) {
      payload.style = "";
    }

    const { data: updated, error: updateError } = await supabase
      .from("bookings")
      .update(payload)
      .eq("id", bookingId)
      .select("*")
      .single();

    if (updateError) throw updateError;

    return NextResponse.json({ booking: normalizeBooking(updated) });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to update booking" },
      { status: 500 }
    );
  }
}
