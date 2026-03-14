import { createWhatsAppMessage } from "@/lib/booking";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export const dynamic = "force-dynamic";

export default async function SuccessPage({ searchParams }) {
  const bookingId = searchParams?.bookingId;
  let booking = null;

  if (bookingId) {
    try {
      const supabase = getSupabaseAdmin();
      const { data } = await supabase.from("bookings").select("*").eq("id", bookingId).maybeSingle();
      booking = data || null;
    } catch {
      booking = null;
    }
  }

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";
  const whatsappUrl = booking && whatsappNumber
    ? `https://wa.me/${whatsappNumber.replace(/\D/g, "")}?text=${encodeURIComponent(createWhatsAppMessage({ booking }))}`
    : "";

  return (
    <main className="container-luxe py-24">
      <div className="card-luxe mx-auto max-w-2xl p-10 text-center">
        <p className="text-sm uppercase tracking-[0.25em] text-black/45">
          Booking Success
        </p>
        <h1 className="mt-3 text-4xl font-semibold">تم تأكيد الحجز بنجاح</h1>
        <p className="mt-4 text-black/65">
          شكرًا لك. تم تسجيل موعدك بنجاح، ويمكنك الآن فتح رسالة واتساب الجاهزة لتأكيد التفاصيل بسرعة.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {whatsappUrl ? (
            <a href={whatsappUrl} className="btn-gold" target="_blank">
              تأكيد عبر واتساب
            </a>
          ) : null}
          <a href="/" className="btn-primary">
            العودة للرئيسية
          </a>
        </div>
      </div>
    </main>
  );
}
