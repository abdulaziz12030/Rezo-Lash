import { SERVICES, getServiceLabel } from "@/lib/booking";

export default function Services() {
  return (
    <section id="services" className="container-luxe py-14">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div className="fade-up">
          <p className="text-sm uppercase tracking-[0.25em] text-black/45">Services</p>
          <h2 className="section-title mt-2">الخدمات</h2>
        </div>
        <a href="#booking" className="btn-gold hidden sm:inline-flex">
          احجزي الآن
        </a>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {SERVICES.map((service, index) => (
          <div key={service.id} className="card-luxe service-card overflow-hidden" style={{ animationDelay: `${index * 90}ms` }}>
            <div className="aspect-[4/5] overflow-hidden bg-[#f5ede5]">
              <img
                src={service.image}
                alt={getServiceLabel(service)}
                className="h-full w-full object-cover transition duration-700 hover:scale-[1.03]"
              />
            </div>

            <div className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-xl font-semibold">{service.nameAr}</h3>
                  <p className="text-sm text-black/55">{service.nameEn}</p>
                </div>
                <span className="badge">{service.duration} min</span>
              </div>

              <p className="mt-3 text-sm leading-7 text-black/70">{service.descriptionAr}</p>
              <p className="mt-2 text-sm font-medium text-black/60">{service.styleSummary}</p>

              <div className="mt-5 flex items-end justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-black/40">Price</p>
                  <p className="text-2xl font-semibold">{service.price} SAR</p>
                </div>
                <a href={`#booking`} className="btn-primary px-4 py-2 text-sm">
                  احجزي
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
