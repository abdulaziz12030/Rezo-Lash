export default function Hero() {
  return (
    <section className="container-luxe pt-8 pb-14">
      <div className="grid items-center gap-8 md:grid-cols-2">
        <div>
          <p className="mb-3 text-sm uppercase tracking-[0.35em] text-black/45">
            Luxury Lash Experience
          </p>
          <h2 className="text-5xl md:text-6xl font-semibold leading-tight">
            Rezo Lash
          </h2>
          <p className="mt-5 max-w-xl text-lg text-black/70">
            استوديو رموش خاص بالحجز المسبق فقط. تجربة هادئة، نتائج راقية،
            وتنظيم احترافي للمواعيد.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#services" className="btn-primary">
              الخدمات
            </a>
            <a href="#booking" className="btn-gold">
              احجزي الآن
            </a>
          </div>
        </div>

        <div className="card-luxe min-h-[440px] overflow-hidden">
          <div className="h-full w-full bg-[radial-gradient(circle_at_top,#f0dfc6,transparent_45%),linear-gradient(135deg,#f7f3ee,#ead8d3)] p-8">
            <div className="flex h-full flex-col justify-end rounded-3xl border border-white/70 bg-white/55 p-8 backdrop-blur-sm">
              <p className="text-sm uppercase tracking-[0.25em] text-black/45">
                Signature Booking
              </p>
              <h3 className="mt-3 text-3xl font-semibold">
                Premium lashes. Private comfort.
              </h3>
              <p className="mt-3 text-black/65">
                مناسب لخدمة VIP داخل استوديو خاص مع حجز عربون وتأكيد تلقائي.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
