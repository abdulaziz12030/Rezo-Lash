import { SERVICES } from "@/lib/booking";

export default function Services() {
  return (
    <section id="services" className="container-luxe py-14">
      <div className="mb-8 max-w-3xl">
        <p className="text-sm uppercase tracking-[0.25em] text-black/45">Services</p>
        <h2 className="section-title mt-2">الخدمات والأسعار</h2>
        <p className="mt-4 text-lg leading-8 text-black/65">
          تم عرض الخدمات بالعربي والإنجليزي لتكون واضحة لجميع العميلات، مع صورة توضيحية
          لكل خدمة يمكنك لاحقًا استبدالها بصورة حقيقية من أعمالك.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {SERVICES.map((service) => (
          <article key={service.id} className="card-luxe overflow-hidden">
            <img
              src={service.image}
              alt={`${service.arabicName} - ${service.name}`}
              className="h-56 w-full object-cover"
            />

            <div className="p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-2xl font-semibold">{service.arabicName}</h3>
                  <p className="mt-1 text-sm uppercase tracking-[0.18em] text-black/45">
                    {service.name}
                  </p>
                </div>
                <span className="badge">{service.duration} min</span>
              </div>

              <p className="mt-4 text-sm leading-7 text-black/70">{service.arabicDescription}</p>
              <p className="mt-2 text-sm text-black/50">{service.description}</p>

              <div className="mt-5 rounded-3xl bg-stone-50 px-4 py-4 text-sm text-black/65">
                <span className="block font-medium text-black">اقتراح الصورة المناسبة:</span>
                <span className="mt-1 block">{service.suggestedPhoto}</span>
              </div>

              <div className="mt-6 flex items-end justify-between gap-4">
                <div>
                  <p className="text-sm text-black/45">Price | السعر</p>
                  <p className="text-2xl font-semibold">{service.price} SAR</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-black/45">Deposit | العربون</p>
                  <p className="font-medium">{service.deposit} SAR</p>
                </div>
              </div>

              <a href="#booking" className="btn-primary mt-6 w-full">
                احجزي هذه الخدمة
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
