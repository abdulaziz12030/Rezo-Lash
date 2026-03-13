export default function Hero() {
  return (
    <section className="container-luxe pt-6 pb-14">
      <div className="grid items-stretch gap-8 lg:grid-cols-[1.08fr_0.92fr]">
        <div className="flex flex-col justify-center">
          <p className="mb-3 text-sm uppercase tracking-[0.35em] text-black/45">
            Luxury Lash Experience
          </p>
          <h2 className="text-4xl font-semibold leading-tight md:text-6xl">
            Rezo Lash
            <span className="mt-2 block text-2xl md:text-4xl">رموش فاخرة بحجز مسبق</span>
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-black/70">
            تجربة راقية وهادئة للعناية بالرموش، مع حجز إلكتروني منظم، تفاصيل واضحة،
            وخدمات مصممة لتناسب الإطلالات الطبيعية والفاخرة.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="card-luxe p-4">
              <p className="text-sm text-black/45">الخدمات</p>
              <p className="mt-2 text-2xl font-semibold">6+</p>
              <p className="mt-1 text-sm text-black/60">Classic • Volume • Hybrid</p>
            </div>
            <div className="card-luxe p-4">
              <p className="text-sm text-black/45">الحجز</p>
              <p className="mt-2 text-2xl font-semibold">Online</p>
              <p className="mt-1 text-sm text-black/60">عربون وتأكيد تلقائي</p>
            </div>
            <div className="card-luxe p-4">
              <p className="text-sm text-black/45">اللغة</p>
              <p className="mt-2 text-2xl font-semibold">AR / EN</p>
              <p className="mt-1 text-sm text-black/60">مناسب للعميلات العرب والأجانب</p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#services" className="btn-primary">استعرضي الخدمات</a>
            <a href="#booking" className="btn-gold">احجزي الآن</a>
          </div>
        </div>

        <div className="card-luxe overflow-hidden">
          <div className="hero-art min-h-[500px] p-6 md:p-8">
            <div className="flex h-full flex-col justify-between rounded-[28px] border border-white/75 bg-white/50 p-6 backdrop-blur-sm">
              <div>
                <span className="inline-flex rounded-full bg-white/90 px-4 py-2 text-xs uppercase tracking-[0.3em] text-black/50">
                  Signature Beauty
                </span>
              </div>

              <div className="space-y-4">
                <div className="eyelash-visual">
                  <span className="iris" />
                  <span className="lash lash-1" />
                  <span className="lash lash-2" />
                  <span className="lash lash-3" />
                  <span className="lash lash-4" />
                  <span className="lash lash-5" />
                  <span className="lash lash-6" />
                  <span className="lash lash-7" />
                </div>
                <div>
                  <h3 className="text-3xl font-semibold md:text-4xl">Premium lashes.</h3>
                  <h4 className="mt-1 text-xl text-black/75 md:text-2xl">Private comfort.</h4>
                  <p className="mt-3 max-w-lg text-black/65">
                    مناسب لعلامة تجارية فاخرة تريد عرض الخدمات بشكل أجمل، مع صور توضيحية،
                    ملخصات للحجز، وتجربة عميلة أكثر احترافية.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
