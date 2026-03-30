import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

function normalizeBooking(row) {
  return {
    id: row.id,
    name: row.full_name || row.name || "",
    phone: row.phone || "",
    service: row.service_name || row.service || "",
    service_id: row.service_id || "",
    date: row.booking_date || row.date || "",
    time: row.booking_time || row.time || "",
    price: row.service_price ?? row.price ?? 0,
    deposit: row.deposit_amount ?? row.deposit ?? 0,
    status: row.status || "pending",
    created_at: row.created_at || "",
    style: row.style || "",
    lower_lashes: row.lower_lashes ?? false,
    lash_removal: row.lash_removal ?? false,
    removal_option:
      row.removal_option || (row.lash_removal ? "needs-removal" : "no-removal"),
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
      .order("booking_date", { ascending: true })
      .order("booking_time", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    const bookings = (data || []).map(normalizeBooking);

    return NextResponse.json(
      { bookings },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
          Pragma: "no-cache",
          Expires: "0",
          Surrogate-Control": "no-store",
        },
      }
    );
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "تعذر جلب الحجوزات" },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
          Pragma: "no-cache",
          Expires: "0",
          Surrogate-Control": "no-store",
        },
      }
    );
  }
}
