const FEATURES = [
  {
    title: "خدمة مناسبة لرسمة العين",
    subtitle: "Customized Style",
    text: "اختيار الخدمة الأنسب لشكل العين وطبيعة الرموش لكل عميلة."
  },
  {
    title: "حجز سريع وواضح",
    subtitle: "Easy Booking",
    text: "مواعيد محددة صباحية ومسائية بدون تعارض أو تكرار."
  },
  {
    title: "لمسة راقية",
    subtitle: "Elegant Finish",
    text: "نتيجة أنيقة ومظهر مرتب يليق بإطلالتك."
  }
];

export default function WhyChooseUs() {
  return (
    <section id="why-us" className="container-luxe py-14">
      <div className="mb-8 max-w-2xl">
        <p className="text-sm uppercase tracking-[0.25em] text-black/45">Why Rezo Lash</p>
        <h2 className="section-title mt-2">لماذا Rezo Lash؟</h2>
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
    </section>
  );
}
