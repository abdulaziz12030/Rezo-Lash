import { SERVICES } from "@/lib/booking";

export default function Services() {
  return (
    <section id="services" className="container-luxe py-14">
      <div className="mb-8">
        <p className="text-sm uppercase tracking-[0.25em] text-black/45">
          Services
        </p>
        <h2 className="section-title mt-2">الخدمات والأسعار</h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {SERVICES.map((service) => (
          <div key={service.id} className="card-luxe p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-xl font-semibold">{service.name}</h3>
                <p className="mt-2 text-sm text-black/60">
                  {service.description}
                </p>
              </div>
              <span className="badge">{service.duration} min</span>
            </div>

            <div className="mt-6 flex items-end justify-between">
              <div>
                <p className="text-sm text-black/45">Price</p>
                <p className="text-2xl font-semibold">{service.price} SAR</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-black/45">Deposit</p>
                <p className="font-medium">{service.deposit} SAR</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
