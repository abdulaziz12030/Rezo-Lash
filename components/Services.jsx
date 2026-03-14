import { SERVICES, getServiceLabel } from "@/lib/booking";

export default function Services() {
  return (
    <section id="services" className="container-luxe py-14">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-black/45">
            Services
          </p>
          <h2 className="section-title mt-2">الخدمات</h2>
        </div>
        <a href="#booking" className="btn-gold hidden sm:inline-flex">
          احجزي الآن
        </a>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {SERVICES.map((service) => (
          <div key={service.id} className="card-luxe overflow-hidden">
            <div className="aspect-[4/5] overflow-hidden bg-[#f5ede5]">
              <img
                src={service.image}
                alt={getServiceLabel(service)}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold">{service.nameAr}</h3>
                  <p className="text-xs text-black/55">{service.nameEn}</p>
                </div>
                <span className="badge whitespace-nowrap">{service.duration} min</span>
              </div>

              <p className="mt-3 min-h-[48px] text-sm text-black/65">{service.descriptionAr}</p>

              <div className="mt-5 flex items-end justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-black/40">Price</p>
                  <p className="text-xl font-semibold">{service.price === 0 ? "مجاني" : `${service.price} SAR`}</p>
                </div>
                <a href="#booking" className="btn-primary px-4 py-2 text-sm">
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
