const TESTIMONIALS = [
  {
    name: "نوف",
    rating: "★★★★★",
    text: "أجمل شغل جربته، الرسمة طلعت مناسبة جدًا لعيني والثبات رائع."
  },
  {
    name: "رهف",
    rating: "★★★★★",
    text: "تعامل راقٍ ونتيجة فخمة جدًا، خصوصًا الهايبرد كان ناعم ومرتب."
  },
  {
    name: "لمى",
    rating: "★★★★★",
    text: "عجبني الاهتمام بالتفاصيل والاستشارة قبل الخدمة، حسيت أن الاختيار كان مدروس."
  },
  {
    name: "سارة",
    rating: "★★★★★",
    text: "المكان أنيق والمواعيد منظمة والشغل فعلاً يفتح العين بشكل جميل."
  }
];

export default function HowItWorks() {
  return (
    <section id="testimonials" className="container-luxe py-14">
      <div className="mb-8 max-w-3xl fade-up">
        <p className="text-sm uppercase tracking-[0.25em] text-black/45">Testimonials</p>
        <h2 className="section-title mt-2">ماذا قالت الجميلات عنا؟؟</h2>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {TESTIMONIALS.map((item, index) => (
          <div key={item.name} className="card-luxe fade-up p-6" style={{ animationDelay: `${index * 90}ms` }}>
            <p className="text-gold tracking-[0.2em]">{item.rating}</p>
            <h3 className="mt-4 text-xl font-semibold">{item.name}</h3>
            <p className="mt-4 text-sm leading-7 text-black/65">{item.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
