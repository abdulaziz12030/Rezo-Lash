export default function Hero() {
  return (
    <section className="container-luxe pt-6 pb-10">
      <div className="grid items-center gap-8 md:grid-cols-[0.95fr_1.05fr]">
        <div>
          <p className="mb-3 text-sm uppercase tracking-[0.35em] text-black/45">
            Rezo Lash
          </p>
          <h2 className="text-4xl font-semibold leading-tight md:text-6xl">
            Luxury Lash Booking
          </h2>
          <p className="mt-4 max-w-xl text-lg text-black/68">
            خدمات رموش أنيقة، مواعيد واضحة، وحجز سهل بالعربي والإنجليزي.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <a href="#services" className="btn-primary">
              الخدمات
            </a>
            <a href="#booking" className="btn-gold">
              احجزي الآن
            </a>
          </div>
        </div>

        <div className="card-luxe overflow-hidden">
          <img
            src="/services/hero.svg"
            alt="Rezo Lash hero"
            className="h-[460px] w-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}
