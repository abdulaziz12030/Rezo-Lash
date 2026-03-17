import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import {
  DEFAULT_TIME_SLOTS,
  getDisplayTime,
  getTodayRiyadhDate,
  isPastDateTime,
} from "@/lib/booking";

function normalizeSlots(rawSlots) {
  if (!Array.isArray(rawSlots)) return DEFAULT_TIME_SLOTS;
  const normalized = rawSlots
    .map((slot) => String(slot || "").trim())
    .filter(Boolean);
  return normalized.length ? normalized : DEFAULT_TIME_SLOTS;
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");

    if (!date) {
      return NextResponse.json(
        { error: "Missing date parameter" },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    const [{ data: bookings, error: bookingsError }, { data: settingsRow, error: settingsError }] =
      await Promise.all([
        supabase
          .from("bookings")
          .select("booking_time, status")
          .eq("booking_date", date)
          .in("status", ["pending", "confirmed"]),
        supabase
          .from("settings")
          .select("value")
          .eq("key", "time_slots")
          .maybeSingle(),
      ]);

    if (bookingsError) throw bookingsError;
    if (settingsError) throw settingsError;

    const configuredSlots = normalizeSlots(settingsRow?.value?.slots);
    const bookedSlots = (bookings || [])
      .map((item) => item.booking_time)
      .filter(Boolean);

    const isToday = date === getTodayRiyadhDate();

    const slots = configuredSlots.map((slot) => {
      const booked = bookedSlots.includes(slot);
      const inPast = isToday && isPastDateTime(date, slot);

      return {
        value: slot,
        label: getDisplayTime(slot),
        available: !booked && !inPast,
        booked,
        inPast,
      };
    });

    return NextResponse.json({
      date,
      slots,
      bookedSlots,
      timeSlots: configuredSlots,
      warning: isToday ? "تم إخفاء المواعيد التي مضى وقتها في تاريخ اليوم." : "",
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Unexpected server error",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
