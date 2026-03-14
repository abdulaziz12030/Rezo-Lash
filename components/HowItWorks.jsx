const STEPS = [
  {
    number: "01",
    title: "اختيار الخدمة والرسمة",
    subtitle: "Choose Service & Style",
    text: "اختاري الخدمة المناسبة ثم حددي الرسمة المفضلة مثل Cat Eye أو Doll Eye."
  },
  {
    number: "02",
    title: "التاريخ والوقت",
    subtitle: "Pick Date & Time",
    text: "اختاري يومك المناسب ثم أحد الأوقات المتاحة صباحًا أو مساءً."
  },
  {
    number: "03",
    title: "تأكيد الحجز",
    subtitle: "Confirm Booking",
    text: "أكملي العربون ثم انتقلي مباشرة إلى تأكيد الحجز عبر الواتس."
  }
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="container-luxe py-14">
      <div className="mb-8 max-w-3xl fade-up">
        <p className="text-sm uppercase tracking-[0.25em] text-black/45">Booking Steps</p>
        <h2 className="section-title mt-2">طريقة الحجز</h2>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {STEPS.map((step, index) => (
          <div key={step.number} className="card-luxe fade-up p-6" style={{ animationDelay: `${index * 90}ms` }}>
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
