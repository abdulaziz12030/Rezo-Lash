function read(searchParams, key) {
  const value = searchParams?.[key];
  return Array.isArray(value) ? value[0] : value || "";
}

export default function SuccessPage({ searchParams }) {
  const name = read(searchParams, "name");
  const phone = read(searchParams, "phone");
  const service = read(searchParams, "service");
  const style = read(searchParams, "style");
  const date = read(searchParams, "date");
  const time = read(searchParams, "time");
  const total = read(searchParams, "total");
  const deposit = read(searchParams, "deposit");
  const adminWhatsApp = read(searchParams, "admin_whatsapp");
  const customerMessage = read(searchParams, "customer_message");

  return (
    <main className="container-luxe py-24">
      <div className="card-luxe mx-auto max-w-3xl p-10 text-center fade-up">
        <p className="text-sm uppercase tracking-[0.25em] text-black/45">Booking Success</p>
        <h1 className="mt-3 text-4xl font-semibold">تم تسجيل الحجز بنجاح</h1>
        <p className="mt-4 text-black/65">تم حفظ طلبك في النظام. الخطوة التالية هي إرسال رسالة التأكيد للإدارة عبر الواتساب، ويمكن للإدارة إرسال رسالة جاهزة لك من داخل لوحة الأدمن.</p>

        <div className="mt-8 grid gap-3 rounded-3xl border border-black/5 bg-black/[0.02] p-5 text-right text-sm">
          <Row label="الاسم" value={name} />
          <Row label="الجوال" value={phone} />
          <Row label="الخدمة" value={service} />
          <Row label="الرسمة" value={style} />
          <Row label="التاريخ" value={date} />
          <Row label="الوقت" value={time} />
          <Row label="الإجمالي" value={`${total} SAR`} />
          <Row label="العربون" value={`${deposit} SAR`} />
        </div>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a href="/" className="btn-primary">العودة للرئيسية</a>
          {adminWhatsApp ? <a href={adminWhatsApp} target="_blank" rel="noreferrer" className="btn-gold">إرسال تفاصيل الحجز للإدارة عبر الواتساب</a> : null}
        </div>

        <div className="mt-6 rounded-3xl bg-[#fff7ef] p-5 text-right text-sm text-black/70">
          <p className="font-semibold text-black">نص الرسالة الجاهز للعميلة داخل لوحة الأدمن</p>
          <pre className="mt-3 whitespace-pre-wrap font-sans text-sm">{customerMessage}</pre>
        </div>
      </div>
    </main>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between gap-4 border-b border-black/5 pb-3 last:border-none last:pb-0">
      <span className="text-black/55">{label}</span>
      <span className="font-medium text-left">{value || "—"}</span>
    </div>
  );
}
