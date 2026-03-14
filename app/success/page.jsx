export default function SuccessPage() {
  return (
    <main className="container-luxe py-24">
      <div className="card-luxe mx-auto max-w-2xl p-10 text-center">
        <p className="text-sm uppercase tracking-[0.25em] text-black/45">
          Payment Success
        </p>
        <h1 className="mt-3 text-4xl font-semibold">تم تأكيد الحجز بنجاح</h1>
        <p className="mt-4 text-black/65">
          شكراً لك. تم تسجيل الدفع وسيظهر الموعد في لوحة الإدارة كموعد مؤكد.
        </p>
        <a href="/" className="btn-primary mt-8">
          العودة للرئيسية
        </a>
      </div>
    </main>
  );
}
