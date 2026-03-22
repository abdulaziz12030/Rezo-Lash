import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const start = searchParams.get("start");
    const end = searchParams.get("end");

    const supabase = getSupabaseAdmin();

    let query = supabase
      .from("bookings")
      .select("*")
      .order("booking_date", { ascending: true })
      .order("booking_time", { ascending: true });

    if (start) query = query.gte("booking_date", start);
    if (end) query = query.lte("booking_date", end);

    const { data, error } = await query;
    if (error) throw error;

    const events = (data || []).map((row) => {
      const status = row.status || "pending";
      return {
        id: row.id,
        title: `${row.full_name || ""} — ${row.service_name || ""}`,
        start: `${row.booking_date}T${row.booking_time}`,
        className: `booking-${status}`,
        extendedProps: {
          phone: row.phone || "",
          status,
          style: row.style || "",
          deposit: row.deposit_amount ?? 0,
          price: row.service_price ?? 0,
        },
      };
    });

    return NextResponse.json({ events });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to load calendar events" },
      { status: 500 }
    );
  }
}
