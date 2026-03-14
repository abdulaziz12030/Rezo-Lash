export default function Navbar() {
  return (
    <header className="container-luxe py-5">
      <div className="flex items-center justify-between rounded-3xl bg-white/92 px-4 py-4 shadow-luxe backdrop-blur sm:px-5">
        <a href="#top" className="flex items-center gap-3">
          <img
            src="/branding/rezo-lash-logo.png"
            alt="Rezo Lash logo"
            className="h-14 w-14 rounded-2xl object-contain bg-black p-1"
          />
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-black/45">
              Luxury Lash Studio
            </p>
            <h1 className="text-xl font-semibold sm:text-2xl">Rezo Lash</h1>
          </div>
        </a>

        <nav className="hidden items-center gap-5 md:flex">
          <a href="#services" className="text-sm text-black/70 hover:text-black">
            الخدمات
          </a>
          <a href="#booking" className="text-sm text-black/70 hover:text-black">
            الحجز
          </a>
        </nav>

        <a href="#booking" className="btn-primary">
          احجزي الآن
        </a>
      </div>
    </header>
  );
}
