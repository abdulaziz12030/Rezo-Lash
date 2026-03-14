const FEATURES = [
  {
    title: "تخصيص الرسمة",
    subtitle: "Eye Mapping",
    text: "كل خدمة يمكن تنسيقها بحسب شكل العين والنتيجة المرغوبة مثل Cat Eye أو Doll Eye."
  },
  {
    title: "حجز سريع",
    subtitle: "Fast Booking",
    text: "اختيار الخدمة والتاريخ والوقت بخطوات واضحة مع مواعيد محددة ومنظمة."
  },
  {
    title: "لمسة فاخرة",
    subtitle: "Luxury Finish",
    text: "واجهة ناعمة وتجربة مريحة تعكس هوية Rezo Lash كاستوديو فاخر للرموش."
  }
];

export default function WhyChooseUs() {
  return (
    <section id="why-us" className="container-luxe py-14">
      <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="fade-up">
          <p className="text-sm uppercase tracking-[0.25em] text-black/45">Why Rezo Lash</p>
          <h2 className="section-title mt-2">لماذا تختارين Rezo Lash؟</h2>
          <p className="mt-4 text-lg leading-8 text-black/65">
            خدمات رموش مختارة بعناية مع خيارات رسمة واضحة واستشارة مجانية عبر الواتس.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {FEATURES.map((feature, index) => (
            <div key={feature.title} className="card-luxe fade-up p-6" style={{ animationDelay: `${index * 80}ms` }}>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gold/20 text-xl">
                ✦
              </div>
              <h3 className="text-xl font-semibold">{feature.title}</h3>
              <p className="mt-1 text-sm uppercase tracking-[0.18em] text-black/45">{feature.subtitle}</p>
              <p className="mt-4 text-sm leading-7 text-black/65">{feature.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
