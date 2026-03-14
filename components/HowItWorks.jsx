const STEPS = [
  {
    number: "01",
    title: "اختيار الخدمة",
    subtitle: "Choose Service",
    text: "تصفحي الخدمات، قارني الشكل والسعر والمدة، ثم اختاري الخدمة المناسبة.",
  },
  {
    number: "02",
    title: "تحديد التاريخ والوقت",
    subtitle: "Select Date & Time",
    text: "اختاري الموعد المتاح المناسب لك حسب التقويم والأوقات المفتوحة.",
  },
  {
    number: "03",
    title: "دفع العربون",
    subtitle: "Pay Deposit",
    text: "يتم دفع العربون لتأكيد الحجز، ثم تنتقلين مباشرة إلى صفحة النجاح.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="container-luxe py-14">
      <div className="mb-8 max-w-3xl">
        <p className="text-sm uppercase tracking-[0.25em] text-black/45">Booking Steps</p>
        <h2 className="section-title mt-2">طريقة الحجز</h2>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {STEPS.map((step) => (
          <div key={step.number} className="card-luxe p-6">
            <p className="text-sm font-semibold tracking-[0.35em] text-gold">{step.number}</p>
            <h3 className="mt-4 text-2xl font-semibold">{step.title}</h3>
            <p className="mt-1 text-sm uppercase tracking-[0.18em] text-black/45">{step.subtitle}</p>
            <p className="mt-4 text-sm leading-7 text-black/65">{step.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
