export default function Navbar() {
  return (
    <header className="container-luxe py-5">
      <div className="flex flex-col gap-4 rounded-[28px] bg-white/90 px-5 py-4 shadow-luxe sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-black/45">
            Private VIP Studio
          </p>
          <h1 className="mt-1 text-2xl font-semibold">Rezo Lash</h1>
          <p className="mt-1 text-sm text-black/55">ريزو لاش | Lash Booking & Beauty Experience</p>
        </div>

        <nav className="flex flex-wrap items-center gap-3 text-sm text-black/70">
          <a href="#services" className="transition hover:text-black">الخدمات</a>
          <a href="#why-us" className="transition hover:text-black">لماذا نحن</a>
          <a href="#how-it-works" className="transition hover:text-black">طريقة الحجز</a>
          <a href="#booking" className="btn-primary">احجزي الآن</a>
        </nav>
      </div>
    </header>
  );
}
