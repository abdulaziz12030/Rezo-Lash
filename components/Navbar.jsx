export default function Navbar() {
  return (
    <header className="container-luxe py-5">
      <div className="flex items-center justify-between rounded-3xl bg-white/90 px-5 py-4 shadow-luxe">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-black/45">
            Private VIP Studio
          </p>
          <h1 className="text-2xl font-semibold">Rezo Lash</h1>
        </div>

        <nav className="hidden items-center gap-5 md:flex">
          <a href="#services" className="text-sm text-black/70 hover:text-black">
            الخدمات
          </a>
          <a href="#booking" className="text-sm text-black/70 hover:text-black">
            الحجز
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <a href="#booking" className="btn-primary">
            احجزي الآن
          </a>
        </div>
      </div>
    </header>
  );
}
