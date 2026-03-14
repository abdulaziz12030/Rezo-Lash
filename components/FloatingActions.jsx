
"use client";

import { ChevronUp, MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { buildWhatsAppUrl } from "@/lib/booking";

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
        href={buildWhatsAppUrl(`مرحبًا Rezo Lash ✨
أرغب بالحجز أو الاستفسار عن الخدمات المتاحة.`)}
        target="_blank"
        rel="noreferrer"
        aria-label="WhatsApp"
        className="floating-btn floating-whatsapp"
      >
        <MessageCircle size={22} />
      </a>

      <button
        type="button"
        aria-label="العودة للأعلى"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={`floating-btn floating-top ${visible ? "opacity-100 translate-y-0" : "pointer-events-none translate-y-4 opacity-0"}`}
      >
        <ChevronUp size={22} />
      </button>
    </>
  );
}
