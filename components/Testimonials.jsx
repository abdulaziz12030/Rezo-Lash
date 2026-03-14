const TESTIMONIALS = [
  {
    name: "نورة",
    text: "شغل مرتب جدًا والرسمة طلعت على عيني أجمل من المتوقع، والثبات ممتاز والخدمة راقية."
  },
  {
    name: "ريم",
    text: "أكثر شيء عجبني أنهم فهموا شكل عيني واختاروا لي رسمة مناسبة جدًا وطلعت النتيجة ناعمة وفخمة."
  },
  {
    name: "جود",
    text: "المكان مريح والحجز سهل جدًا، والرموش خفيفة على العين وتعطي جمال واضح بدون مبالغة."
  },
  {
    name: "سارة",
    text: "الريفل كان ممتاز وحافظ على نفس اللوك بشكل جميل، وأنصح فيهم جدًا خصوصًا لعشاق الترتيب والدقة."
  }
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="container-luxe py-14">
      <div className="mb-8 max-w-3xl fade-up">
        <p className="text-sm uppercase tracking-[0.25em] text-black/45">Testimonials</p>
        <h2 className="section-title mt-2">ماذا قالت الجميلات عنا؟؟</h2>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {TESTIMONIALS.map((item, index) => (
          <div key={item.name} className="card-luxe fade-up p-6" style={{ animationDelay: `${index * 90}ms` }}>
            <div className="mb-4 flex items-center gap-1 text-[#d4b06a]" aria-hidden="true">
              <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
            </div>
            <p className="text-sm leading-7 text-black/70">{item.text}</p>
            <p className="mt-5 text-sm font-semibold">{item.name}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
