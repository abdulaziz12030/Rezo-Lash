import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

function normalizeBooking(row) {
  return {
    id: row.id,
    name: row.full_name || "",
    phone: row.phone || "",
    service: row.service_name || "",
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

export async function GET() {
  try {
    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({
      bookings: (data || []).map(normalizeBooking),
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}
