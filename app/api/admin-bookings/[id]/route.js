import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import {
  getServiceById,
  getServiceLabel,
  getStyleLabel,
  calculateBookingTotals,
} from "@/lib/booking";

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
    price: Number(row.service_price ?? row.price ?? 0),
    deposit: Number(row.deposit_amount ?? row.deposit ?? 0),
    status: row.status || "pending",
    created_at: row.created_at || "",
    style: row.style || "",
    lower_lashes: Boolean(row.lower_lashes),
    lash_removal: Boolean(row.lash_removal),
    removal_option:
      row.removal_option || (row.lash_removal ? "needs-removal" : "no-removal"),
    payment_status: row.payment_status || "unpaid",
    notes: row.notes || "",
  };
}

export async function PATCH(request, { params }) {
  try {
    const bookingId = params?.id;

    if (!bookingId) {
      return NextResponse.json(
        { error: "معرف الحجز غير موجود." },
        {
          status: 400,
          headers: {
            "Cache-Control": "no-store",
          },
        }
      );
    }

    const body = await request.json();
    const supabase = getSupabaseAdmin();

    const { data: current, error: currentError } = await supabase
      .from("bookings")
      .select("*")
      .eq("id", bookingId)
      .single();

    if (currentError || !current) {
      throw new Error(currentError?.message || "لم يتم العثور على الحجز.");
    }

    const serviceId = body.serviceId || current.service_id;
    const nextService = getServiceById(serviceId);

    if (!nextService) {
      return NextResponse.json(
        { error: "الخدمة المختارة غير صالحة." },
        {
          status: 400,
          headers: {
            "Cache-Control": "no-store",
          },
        }
      );
    }

    const bookingDate = body.date || current.booking_date || current.date;
    const bookingTime = body.time || current.booking_time || current.time;
    const status = body.status || current.status || "pending";
    const paymentStatus = body.paymentStatus || current.payment_status || "unpaid";

    const lowerLashes =
      typeof body.lowerLashes === "boolean"
        ? body.lowerLashes
        : Boolean(current.lower_lashes);

    const removalOption =
      body.removalOption ||
      current.removal_option ||
      (current.lash_removal ? "needs-removal" : "no-removal");

    const styleId = typeof body.styleId === "string" ? body.styleId : null;

    const notes =
      typeof body.notes === "string" ? body.notes.trim() : current.notes || "";

    if (!bookingDate || !bookingTime) {
      return NextResponse.json(
        { error: "التاريخ أو الوقت غير مكتمل." },
        {
          status: 400,
          headers: {
            "Cache-Control": "no-store",
          },
        }
      );
    }

    const { data: conflicting, error: conflictingError } = await supabase
      .from("bookings")
      .select("id")
      .eq("booking_date", bookingDate)
      .eq("booking_time", bookingTime)
      .neq("id", bookingId)
      .in("status", ["pending", "confirmed"])
      .limit(1);

    if (conflictingError) {
      throw conflictingError;
    }

    if (conflicting?.length && ["pending", "confirmed"].includes(status)) {
      return NextResponse.json(
        { error: "يوجد حجز آخر على نفس الموعد." },
        {
          status: 409,
          headers: {
            "Cache-Control": "no-store",
          },
        }
      );
    }

    const totals = calculateBookingTotals(nextService, {
      lowerLashes,
      removalOption,
    });

    const serviceLabel = getServiceLabel(nextService);
    const styleLabel = styleId && nextService?.id ? getStyleLabel(nextService.id, styleId) : "";

    const customerName = current.full_name || current.name || "";

    const payload = {
      full_name: customerName,
      phone: current.phone || "",
      service_id: nextService.id,
      service_name: serviceLabel,
      service_price: totals.totalPrice,
      deposit_amount: totals.depositAmount,
      booking_date: bookingDate,
      booking_time: bookingTime,
      status,
      payment_status: paymentStatus,
      style: styleLabel,
      lower_lashes: lowerLashes,
      lash_removal: removalOption === "needs-removal",
      removal_option: removalOption,
      notes,

      // Sync legacy columns too so older UI paths stay consistent across devices
      name: customerName,
      service: serviceLabel,
      price: totals.totalPrice,
      deposit: totals.depositAmount,
      date: bookingDate,
      time: bookingTime,
    };

    const { data: updated, error: updateError } = await supabase
      .from("bookings")
      .update(payload)
      .eq("id", bookingId)
      .select("*")
      .single();

    if (updateError || !updated) {
      throw new Error(updateError?.message || "فشل حفظ التعديلات.");
    }

    return NextResponse.json(
      {
        success: true,
        booking: normalizeBooking(updated),
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
          Pragma: "no-cache",
          Expires: "0",
          "Surrogate-Control": "no-store",
        },
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: error.message || "Failed to update booking",
      },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
          Pragma: "no-cache",
          Expires: "0",
          "Surrogate-Control": "no-store",
        },
      }
    );
  }
}
