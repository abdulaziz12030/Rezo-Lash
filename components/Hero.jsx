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
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#25D366] text-white shadow-md">
              <svg viewBox="0 0 32 32" className="h-6 w-6 fill-current" aria-hidden="true">
                <path d="M19.11 17.23c-.27-.13-1.6-.79-1.85-.88-.25-.09-.43-.13-.61.13-.18.27-.7.88-.86 1.06-.16.18-.31.2-.58.07-.27-.13-1.12-.41-2.13-1.31-.79-.7-1.32-1.57-1.48-1.84-.16-.27-.02-.41.12-.54.12-.12.27-.31.4-.47.13-.16.18-.27.27-.45.09-.18.04-.34-.02-.47-.07-.13-.61-1.47-.84-2.01-.22-.53-.44-.45-.61-.46h-.52c-.18 0-.47.07-.72.34-.25.27-.95.93-.95 2.27s.97 2.64 1.1 2.82c.13.18 1.9 2.9 4.6 4.06.64.28 1.14.45 1.53.58.64.2 1.22.17 1.68.1.51-.08 1.6-.65 1.82-1.28.22-.63.22-1.17.16-1.28-.07-.11-.25-.18-.52-.31z"/>
                <path d="M16.03 3.2c-7.08 0-12.82 5.74-12.82 12.82 0 2.25.58 4.45 1.69 6.39L3 29l6.77-1.78a12.78 12.78 0 0 0 6.26 1.61h.01c7.08 0 12.82-5.74 12.82-12.82S23.11 3.2 16.03 3.2zm0 23.36h-.01a10.56 10.56 0 0 1-5.39-1.48l-.39-.23-4.02 1.05 1.08-3.92-.26-.4a10.58 10.58 0 1 1 8.99 4.98z"/>
              </svg>
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
