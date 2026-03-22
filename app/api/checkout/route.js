import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import {
  calculateBookingTotals,
  getDisplayTime,
  getRemovalLabel,
  getServiceById,
  getServiceLabel,
  getStyleLabel,
  normalizePhoneNumber,
  buildAdminWhatsAppUrl,
  buildCustomerReplyTemplate,
} from "@/lib/booking";

export async function POST(request) {
  try {
    const body = await request.json();
    const { fullName, phone, date, time, serviceId, styleId, removalOption, lowerLashes } = body;

    if (!fullName || !phone || !date || !time || !serviceId || !styleId) {
      return NextResponse.json({ error: "يرجى تعبئة جميع الحقول المطلوبة." }, { status: 400 });
    }

    const service = getServiceById(serviceId);
    if (!service) {
      return NextResponse.json({ error: "الخدمة غير موجودة." }, { status: 404 });
    }

    const totals = calculateBookingTotals(service, { removalOption, lowerLashes });
    const styleLabel = getStyleLabel(serviceId, styleId);
    const serviceLabel = getServiceLabel(service);
    const removalLabel = getRemovalLabel(removalOption);
    const phoneNormalized = normalizePhoneNumber(phone);

    const supabase = getSupabaseAdmin();

    const { data: conflicting, error: conflictError } = await supabase
      .from("bookings")
      .select("id")
      .eq("date", date)
      .eq("time", time)
      .in("status", ["pending", "confirmed"])
      .limit(1);

    if (conflictError) throw conflictError;

    if (conflicting?.length) {
      return NextResponse.json({ error: "هذا الموعد غير متاح، يرجى اختيار وقت آخر." }, { status: 409 });
    }

    const payload = {
      name: fullName,
      phone: phoneNormalized || phone,
      service: serviceLabel,
      style: styleLabel,
      lower_lashes: Boolean(lowerLashes),
      lash_removal: removalOption === "needs-removal",
      price: totals.totalPrice,
      deposit: totals.depositAmount,
      date,
      time,
      status: "pending",
    };

    const { data: inserted, error: insertError } = await supabase
      .from("bookings")
      .insert(payload)
      .select("*")
      .single();

    if (insertError) throw insertError;

    const origin = request.headers.get("origin") || process.env.NEXT_PUBLIC_APP_URL || "";
    const adminLink = buildAdminWhatsAppUrl({
      name: fullName,
      phone: phoneNormalized || phone,
      serviceLabel,
      styleLabel,
      date,
      time: getDisplayTime(time),
      totalPrice: totals.totalPrice,
      depositAmount: totals.depositAmount,
    });
    const customerTemplate = buildCustomerReplyTemplate({
      name: fullName,
      serviceLabel,
      date,
      time: getDisplayTime(time),
      depositAmount: totals.depositAmount,
    });

    const params = new URLSearchParams({
      booking: inserted.id,
      name: fullName,
      phone: phoneNormalized || phone,
      service: serviceLabel,
      style: styleLabel,
      date,
      time: getDisplayTime(time),
      total: String(totals.totalPrice),
      deposit: String(totals.depositAmount),
      admin_whatsapp: adminLink,
      customer_message: customerTemplate,
      removal: removalLabel,
    });

    return NextResponse.json({ url: `${origin}/success?${params.toString()}` });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Checkout failed" }, { status: 500 });
  }
}
