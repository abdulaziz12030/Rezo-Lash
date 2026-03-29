import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const DEFAULT_SLOTS = [
  { value: "09:00", label: "9:00 AM" },
  { value: "11:00", label: "11:00 AM" },
  { value: "16:00", label: "4:00 PM" },
  { value: "18:00", label: "6:00 PM" },
  { value: "20:00", label: "8:00 PM" },
];

function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) return null;

  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
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

    const supabase = getSupabaseClient();

    // إذا لم تكن المفاتيح موجودة، أعد كل المواعيد كحل احتياطي
    if (!supabase) {
      return NextResponse.json({
        date,
        slots: DEFAULT_SLOTS.map((slot) => ({
          ...slot,
          available: true,
        })),
        bookedSlots: [],
      });
    }

    const { data, error } = await supabase
      .from("bookings")
      .select("booking_date, booking_time, status")
      .eq("booking_date", date)
      .in("status", ["pending", "confirmed"]);

    if (error) {
      console.error("Supabase availability error:", error);

      return NextResponse.json(
        {
          error: "Could not read booked slots from the database",
          details: error.message,
        },
        { status: 500 }
      );
    }

    const bookedSlots = (data || [])
      .map((item) => item.booking_time)
      .filter(Boolean);

    const slots = DEFAULT_SLOTS.map((slot) => ({
      ...slot,
      available: !bookedSlots.includes(slot.value),
    }));

    return NextResponse.json({
      date,
      slots,
      bookedSlots,
    });
  } catch (error) {
    console.error("Availability route error:", error);

    return NextResponse.json(
      {
        error: "Unexpected server error",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
