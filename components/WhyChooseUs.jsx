const FEATURES = [
  {
    title: "نتيجة راقية",
    subtitle: "Elegant Finish",
    text: "اختيار الخدمة المناسبة لكل عميلة مع اهتمام بالشكل النهائي وتناسق الرموش.",
  },
  {
    title: "حجز منظم",
    subtitle: "Smart Booking",
    text: "تاريخ ووقت وخدمة وعربون في رحلة واحدة واضحة وسهلة.",
  },
  {
    title: "خصوصية وراحة",
    subtitle: "Private Comfort",
    text: "تجربة مريحة في استوديو خاص يركز على الهدوء والاهتمام بالتفاصيل.",
  },
];

export default function WhyChooseUs() {
  return (
    <section id="why-us" className="container-luxe py-14">
      <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-black/45">Why Rezo Lash</p>
          <h2 className="section-title mt-2">لماذا تختارين Rezo Lash؟</h2>
          <p className="mt-4 text-lg leading-8 text-black/65">
            لأن الموقع لا يكتفي بعرض خدمة الحجز فقط، بل يشرح القيمة والجودة ويعطي
            انطباعًا بصريًا يليق بعلامة تجارية فاخرة.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {FEATURES.map((feature) => (
            <div key={feature.title} className="card-luxe p-6">
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
