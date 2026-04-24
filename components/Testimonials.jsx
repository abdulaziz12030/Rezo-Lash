
const TESTIMONIALS = [
  {
    name: "ريم",
    text: "الخدمة كانت جدًا مرتبة والرسمه طلعت على عيني أحلى من المتوقع، وثبات الرموش ممتاز."
  },
  {
    name: "سارة",
    text: "أحببت الاهتمام بالتفاصيل والاستشارة قبل التركيب، والنتيجة كانت ناعمة وفخمة."
  },
  {
    name: "نوف",
    text: "المكان رايق والمواعيد منظمة جدًا، وتجربة الروسي كانت جميلة وثقيلة بشكل أنيق."
  },
  {
    name: "الجوهرة",
    text: "من أفضل التجارب، خاصة اختيار الرسمة المناسبة لعيوني، والإزالة كانت لطيفة وآمنة."
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
            <div className="mb-4 flex items-center gap-1 text-[#D4B06A]">
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
