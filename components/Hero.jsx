import { buildWhatsAppUrl } from "@/lib/booking";

const consultationMessage = `مرحبًا Rezo Lash ✨
أرغب بحجز استشارة مجانية لمعرفة الرسمة المناسبة لرسمة عيني.`;

export default function Hero() {
  return (
    <section id="top" className="container-luxe pt-3 pb-10">
      <div className="hero-card overflow-hidden rounded-[2rem] bg-white shadow-luxe border border-black/5">
        <div className="relative">
          <a href="#booking" className="block">
            <img
              src="/branding/rezo-lash-hero.png"
              alt="Rezo Lash hero banner"
              className="h-auto w-full object-cover"
            />
          </a>

          <a
            href={buildWhatsAppUrl(consultationMessage)}
            target="_blank"
            rel="noreferrer"
            className="consult-chip absolute left-4 top-4 flex max-w-[260px] items-center gap-3 rounded-full bg-white/92 px-4 py-3 text-right shadow-lg backdrop-blur md:left-8 md:top-8"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#25D366] text-xl text-white shadow-md">
              ✆
            </span>
            <span>
              <strong className="block text-sm md:text-base">استشارة مجانية</strong>
              <span className="mt-1 block text-xs leading-5 text-black/65 md:text-sm">
                احجزي استشارة مجانية مع الأخصائية لمعرفة الرسمة المناسبة للعين.
              </span>
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
