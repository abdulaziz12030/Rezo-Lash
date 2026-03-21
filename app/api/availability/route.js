import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { DEFAULT_TIME_SLOTS, isPastDateTime } from "@/lib/booking";

function buildSlotObjects(slotValues, bookedSlots, selectedDate) {
  return slotValues.map((slot) => {
    const booked = bookedSlots.includes(slot);
    const past = isPastDateTime(selectedDate, slot);
    return {
      value: slot,
      label: slot,
      available: !booked && !past,
      booked,
      past,
    };
  });
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");

    if (!date) {
      return NextResponse.json({ error: "Missing date parameter" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    const [{ data: settingsData, error: settingsError }, { data: bookingsData, error: bookingsError }] = await Promise.all([
      supabase.from("settings").select("value").eq("key", "time_slots").maybeSingle(),
      supabase
        .from("bookings")
        .select("booking_time, status")
        .eq("booking_date", date)
        .in("status", ["pending", "confirmed"]),
    ]);

    if (settingsError) throw settingsError;
    if (bookingsError) throw bookingsError;

    const configuredSlots = settingsData?.value?.slots;
    const slotValues = Array.isArray(configuredSlots) && configuredSlots.length ? configuredSlots : DEFAULT_TIME_SLOTS;
    const bookedSlots = (bookingsData || []).map((item) => item.booking_time).filter(Boolean);

    return NextResponse.json({
      date,
      slots: buildSlotObjects(slotValues, bookedSlots, date),
      slotValues,
      bookedSlots,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Could not read booked slots from the database", details: error.message },
      { status: 500 }
    );
  }
}
