import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { DEFAULT_TIME_SLOTS } from "@/lib/booking";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");

    if (!date) {
      return NextResponse.json({ error: "Missing date parameter" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    const [{ data: settingsData, error: settingsError }, { data: bookingsData, error: bookingsError }] =
      await Promise.all([
        supabase.from("settings").select("*").eq("key", "time_slots").maybeSingle(),
        supabase
          .from("bookings")
          .select("booking_time")
          .eq("booking_date", date)
          .in("status", ["pending", "confirmed"])
      ]);

    if (settingsError) throw settingsError;
    if (bookingsError) throw bookingsError;

    const timeSlots = settingsData?.value?.slots || DEFAULT_TIME_SLOTS;
    const bookedSlots = (bookingsData || []).map((item) => item.booking_time);

    return NextResponse.json({ timeSlots, bookedSlots });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to load availability" },
      { status: 500 }
    );
  }
}
