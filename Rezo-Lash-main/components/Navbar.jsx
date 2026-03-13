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

        <div className="flex items-center gap-3">
          <a href="/booking" className="btn-primary">
            Book Now
          </a>
        </div>
      </div>
    </header>
  );
}
