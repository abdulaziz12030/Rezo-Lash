"use client";

import { useEffect, useState } from "react";
import { buildWhatsAppUrl } from "@/lib/booking";

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className="h-6 w-6 fill-current">
      <path d="M19.11 17.34c-.3-.15-1.77-.87-2.05-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.95 1.16-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.38-1.48-.88-.78-1.47-1.75-1.64-2.05-.17-.3-.02-.46.13-.61.14-.14.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.05 1.02-1.05 2.48 0 1.45 1.08 2.86 1.23 3.06.15.2 2.1 3.2 5.08 4.48.71.31 1.27.49 1.7.63.72.23 1.37.2 1.89.12.58-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.08-.12-.27-.2-.57-.35Z" />
      <path d="M16.03 3.2c-7.07 0-12.79 5.72-12.79 12.79 0 2.25.59 4.45 1.7 6.38L3 29l6.85-1.8a12.76 12.76 0 0 0 6.18 1.58h.01c7.07 0 12.8-5.72 12.8-12.79S23.1 3.2 16.03 3.2Zm0 23.44h-.01a10.6 10.6 0 0 1-5.4-1.48l-.39-.23-4.06 1.07 1.08-3.96-.25-.41a10.6 10.6 0 1 1 9.03 5.01Z" />
    </svg>
  );
}

export default function FloatingActions() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 320);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <a
        href={buildWhatsAppUrl(`مرحبًا Rezo Lash ✨\nأرغب بالحجز أو الاستفسار عن الخدمات المتاحة.`)}
        target="_blank"
        rel="noreferrer"
        aria-label="WhatsApp"
        className="floating-btn floating-whatsapp"
      >
        <WhatsAppIcon />
      </a>

      <button
        type="button"
        aria-label="العودة للأعلى"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={`floating-btn floating-top ${visible ? "opacity-100 translate-y-0" : "pointer-events-none translate-y-4 opacity-0"}`}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 stroke-current" fill="none" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 14l6-6 6 6" />
        </svg>
      </button>
    </>
  );
}
