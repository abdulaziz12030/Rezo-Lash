import { buildWhatsAppUrl } from "@/lib/booking";

export default function SuccessPage() {
  return (
    <main className="container-luxe py-24">
      <div className="card-luxe mx-auto max-w-2xl p-10 text-center fade-up">
        <p className="text-sm uppercase tracking-[0.25em] text-black/45">
          Payment Success
        </p>
        <h1 className="mt-3 text-4xl font-semibold">تم تأكيد الحجز بنجاح</h1>
        <p className="mt-4 text-black/65">
          شكراً لك. تم تسجيل الدفع ويمكنك الآن إرسال تفاصيل الحجز مباشرة عبر الواتس لتأكيد أسرع.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a href="/" className="btn-primary">
            العودة للرئيسية
          </a>
          <a
            href={buildWhatsAppUrl(`مرحبًا Rezo Lash ✨
قمت بإتمام الحجز عبر الموقع وأرغب بتأكيد الموعد.`)}
            target="_blank"
            rel="noreferrer"
            className="btn-gold"
          >
            تأكيد عبر الواتس
          </a>
        </div>
      </div>
    </main>
  );
}
