export const WHATSAPP_NUMBER = "966570905999";
export const REMOVAL_FEE = 120;
export const REMOVAL_ENABLED_SERVICES = ["classic", "hybrid", "volume", "mega", "russian"];

export const SERVICE_STYLES = {
  classic: [
    { id: "cat-eye", label: "Cat Eye", description: "لتطويل العين", icon: "↗" },
    { id: "doll-eye", label: "Doll Eye", description: "يوسع العين", icon: "◉" },
    { id: "natural-volume", label: "Natural Volume", description: "مظهر طبيعي", icon: "✦" }
  ],
  hybrid: [
    { id: "cat-eye", label: "Cat Eye", description: "لتطويل العين", icon: "↗" },
    { id: "doll-eye", label: "Doll Eye", description: "يوسع العين", icon: "◉" },
    { id: "natural-volume", label: "Natural Volume", description: "مظهر طبيعي", icon: "✦" }
  ],
  volume: [
    { id: "cat-eye", label: "Cat Eye", description: "لتطويل العين", icon: "↗" },
    { id: "doll-eye", label: "Doll Eye", description: "يوسع العين", icon: "◉" },
    { id: "natural-volume", label: "Natural Volume", description: "مظهر طبيعي", icon: "✦" }
  ],
  mega: [
    { id: "cat-eye", label: "Cat Eye", description: "لتطويل العين", icon: "↗" },
    { id: "doll-eye", label: "Doll Eye", description: "يوسع العين", icon: "◉" },
    { id: "natural-volume", label: "Natural Volume", description: "مظهر طبيعي", icon: "✦" }
  ],
  russian: [
    { id: "dramatic", label: "Dramatic", description: "رسمة خاصة للروسي", icon: "◆" }
  ],
  refill: [
    { id: "cat-eye", label: "Cat Eye", description: "لتطويل العين", icon: "↗" },
    { id: "doll-eye", label: "Doll Eye", description: "يوسع العين", icon: "◉" },
    { id: "natural-volume", label: "Natural Volume", description: "مظهر طبيعي", icon: "✦" }
  ]
};

export const REMOVAL_OPTIONS = [
  { id: "no-removal", label: "لا يتطلب إزالة" },
  { id: "needs-removal", label: `يتطلب إزالة الرموش القديمة (+${REMOVAL_FEE} SAR)` }
];

export const SERVICES = [
  {
    id: "classic",
    nameAr: "كلاسيك",
    nameEn: "Classic Lashes",
    price: 220,
    deposit: 50,
    duration: 120,
    descriptionAr: "رموش ناعمة ومفردة تعطي تحديدًا مرتبًا ومظهرًا أنيقًا وطبيعيًا جدًا.",
    descriptionEn: "Soft single-lash definition with a clean natural finish.",
    styleSummary: "مناسبة للعين الهادئة ولمن تفضّل النتيجة الطبيعية اليومية.",
    image: "/services/classic.svg"
  },
  {
    id: "hybrid",
    nameAr: "هايبرد",
    nameEn: "Hybrid Lashes",
    price: 280,
    deposit: 50,
    duration: 120,
    descriptionAr: "مزيج بين الكلاسيك والفوليوم لنتيجة متوازنة بكثافة أنيقة وملمس أجمل.",
    descriptionEn: "A balanced mix of classic and volume for texture and elegance.",
    styleSummary: "مثالية لمن ترغب بكثافة واضحة بدون مبالغة.",
    image: "/services/hybrid.svg"
  },
  {
    id: "volume",
    nameAr: "فوليوم",
    nameEn: "Volume Lashes",
    price: 260,
    deposit: 50,
    duration: 120,
    descriptionAr: "كثافة ناعمة بفانات خفيفة تمنح العين حضورًا أكثر ولمسة أنثوية واضحة.",
    descriptionEn: "Fluffy fans that create a fuller feminine look.",
    styleSummary: "مناسبة للعين الصغيرة أو لمن تحب امتلاءً أنيقًا.",
    image: "/services/volume.svg"
  },
  {
    id: "mega",
    nameAr: "ميقا فوليوم",
    nameEn: "Mega Volume",
    price: 360,
    deposit: 75,
    duration: 150,
    descriptionAr: "كثافة قوية جدًا ولمسة درامية فاخرة لنتيجة جريئة وواضحة.",
    descriptionEn: "Ultra-full dramatic lashes with a bold luxe effect.",
    styleSummary: "لمن تحب الإطلالة البارزة والمظهر الفخم.",
    image: "/services/mega.svg"
  },
  {
    id: "russian",
    nameAr: "روسي فوليوم",
    nameEn: "Russian Volume",
    price: 320,
    deposit: 75,
    duration: 150,
    descriptionAr: "فانات روسية مرتبة بكثافة فاخرة ورسمة أكثر جرأة وأناقة.",
    descriptionEn: "Dense Russian fans with premium drama and bold styling.",
    styleSummary: "الأفضل لعاشقات الرسمة الفخمة بخيار Dramatic.",
    image: "/services/russian.svg"
  },
  {
    id: "refill",
    nameAr: "ريفل تعبئة",
    nameEn: "Refill",
    price: 180,
    deposit: 50,
    duration: 90,
    descriptionAr: "جلسة صيانة وتعبئة للحفاظ على جمال الرموش واستمرارية نفس الرسمة.",
    descriptionEn: "Refresh and refill session to maintain your lash set.",
    styleSummary: "مناسبة بعد 2 إلى 3 أسابيع حسب الفراغات ونوع العناية.",
    image: "/services/refill.svg"
  }
];

export const DEFAULT_TIME_SLOTS = ["09:00", "11:00", "16:00", "18:00", "20:00"];

export const DISPLAY_TIME_SLOTS = {
  "09:00": "9:00 AM",
  "11:00": "11:00 AM",
  "16:00": "4:00 PM",
  "18:00": "6:00 PM",
  "20:00": "8:00 PM"
};

export function getServiceById(serviceId) {
  return SERVICES.find((item) => item.id === serviceId);
}

export function getServiceLabel(service) {
  if (!service) return "";
  return `${service.nameAr} | ${service.nameEn}`;
}

export function getStyleOptions(serviceId) {
  return SERVICE_STYLES[serviceId] || [];
}

export function getStyleLabel(serviceId, styleId) {
  const style = getStyleOptions(serviceId).find((item) => item.id === styleId);
  return style ? `${style.label} — ${style.description}` : "";
}

export function serviceSupportsRemoval(serviceId) {
  return REMOVAL_ENABLED_SERVICES.includes(serviceId);
}

export function getRemovalLabel(removalId) {
  return REMOVAL_OPTIONS.find((item) => item.id === removalId)?.label || "";
}

export function getRemovalFee(serviceId, removalId) {
  if (!serviceSupportsRemoval(serviceId)) return 0;
  return removalId === "needs-removal" ? REMOVAL_FEE : 0;
}

export function getBookingTotal(service, removalId) {
  return (service?.price || 0) + getRemovalFee(service?.id, removalId);
}

export function getRemainingAmount(service, removalId) {
  return getBookingTotal(service, removalId) - (service?.deposit || 0);
}

export function getDisplayTime(time) {
  return DISPLAY_TIME_SLOTS[time] || time;
}

export function buildWhatsAppUrl(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function isPastDateTime(date, time) {
  const selected = new Date(`${date}T${time}:00`);
  return selected.getTime() < Date.now();
}

export function isArchivedStatus(status) {
  return ["archived", "completed", "cancelled"].includes(String(status || "").toLowerCase());
}
