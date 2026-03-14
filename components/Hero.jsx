"use client";

import { useEffect, useState } from "react";

const LINKS = [
  { href: "#services", label: "الخدمات" },
  { href: "#why-us", label: "لماذا ريزو" },
  { href: "#booking", label: "الحجز" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="site-header">
      <div className="container-luxe">
        <div className={`nav-shell ${scrolled ? "nav-shell-scrolled" : ""}`}>
          <a href="#top" className="brand-mark" aria-label="Rezo Lash home">
            <div className="brand-logo-wrap">
              <img
                src="/branding/rezo-lash-logo.png"
                alt="Rezo Lash logo"
                className="brand-logo"
              />
            </div>
            <div className="brand-copy">
              <span className="brand-overline">Luxury Lash Studio</span>
              <strong className="brand-title">Rezo Lash</strong>
            </div>
          </a>

          <nav className="nav-links" aria-label="Primary navigation">
            {LINKS.map((link) => (
              <a key={link.href} href={link.href} className="nav-link-item">
                {link.label}
              </a>
            ))}
          </nav>

          <a href="#booking" className="nav-book-btn">
            احجزي الآن
          </a>
        </div>
      </div>
    </header>
  );
}
