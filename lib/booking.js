export const SERVICES = [
  {
    id: "consultation",
    nameAr: "استشارة مجانية",
    nameEn: "Free Consultation",
    price: 0,
    deposit: 0,
    duration: 15,
    descriptionAr: "احجزي استشارة مجانية مع الأخصائية لمعرفة الخدمة المناسبة لرسمة العين وطبيعة الرموش.",
    descriptionEn: "Book a free consultation with our specialist to determine the best lash style for your eye shape.",
    image: "/services/consultation.svg"
  },
  {
    id: "classic",
    nameAr: "كلاسيك",
    nameEn: "Classic Lashes",
    price: 149,
    deposit: 30,
    duration: 60,
    descriptionAr: "إطلالة طبيعية ناعمة بتطبيق رمش واحد على كل رمش طبيعي.",
    descriptionEn: "A natural look created by applying one extension to each natural lash.",
    image: "/services/classic.svg"
  },
  {
    id: "hybrid",
    nameAr: "هايبرد",
    nameEn: "Hybrid Lashes",
    price: 179,
    deposit: 50,
    duration: 75,
    descriptionAr: "مزيج بين الكلاسيك والفوليوم لإطلالة أنيقة ومتوازنة.",
    descriptionEn: "A mix between classic and volume lashes for a textured elegant look.",
    image: "/services/hybrid.svg"
  },
  {
    id: "volume",
    nameAr: "فوليوم",
    nameEn: "Volume Lashes",
    price: 199,
    deposit: 50,
    duration: 90,
    descriptionAr: "كثافة جميلة تعطي العين مظهرًا أكثر امتلاءً وجاذبية.",
    descriptionEn: "Fuller fluffy lash look using multiple lightweight extensions.",
    image: "/services/volume.svg"
  },
  {
    id: "russian",
    nameAr: "روسي",
    nameEn: "Russian Volume",
    price: 229,
    deposit: 60,
    duration: 100,
    descriptionAr: "كثافة أعلى ومظهر فاخر لعاشقات الإطلالة الجريئة.",
    descriptionEn: "Luxury dramatic lash style with dense volume fans.",
    image: "/services/russian.svg"
  },
  {
    id: "mega",
    nameAr: "ميغا فوليوم",
    nameEn: "Mega Volume",
    price: 249,
    deposit: 70,
    duration: 110,
    descriptionAr: "إطلالة كثيفة جدًا لعشاق المظهر الجريء والفخم.",
    descriptionEn: "Ultra dramatic dense lash extensions.",
    image: "/services/mega.svg"
  },
  {
    id: "refill",
    nameAr: "تعبئة",
    nameEn: "Refill",
    price: 120,
    deposit: 30,
    duration: 60,
    descriptionAr: "جلسة تعبئة للحفاظ على جمال الرموش واستمرار الإطلالة.",
    descriptionEn: "Maintenance session to refill existing extensions.",
    image: "/services/refill.svg"
  },
  {
    id: "removal",
    nameAr: "إزالة",
    nameEn: "Removal",
    price: 50,
    deposit: 20,
    duration: 30,
    descriptionAr: "إزالة آمنة للرموش الصناعية للحفاظ على صحة الرموش الطبيعية.",
    descriptionEn: "Safe removal of eyelash extensions.",
    image: "/services/removal.svg"
  }
];

export const DEFAULT_TIME_SLOTS = ["09:00", "11:00", "16:00", "18:00", "20:00"];

export function getServiceById(serviceId) {
  return SERVICES.find((item) => item.id === serviceId);
}

export function getServiceLabel(service) {
  if (!service) return "";
  return `${service.nameAr} | ${service.nameEn}`;
}

export function formatTimeLabel(slot) {
  const map = {
    "09:00": { en: "9:00 AM", ar: "9:00 AM صباحًا" },
    "11:00": { en: "11:00 AM", ar: "11:00 AM صباحًا" },
    "16:00": { en: "4:00 PM", ar: "4:00 PM مساءً" },
    "18:00": { en: "6:00 PM", ar: "6:00 PM مساءً" },
    "20:00": { en: "8:00 PM", ar: "8:00 PM مساءً" }
  };

  return map[slot] || { en: slot, ar: slot };
}

export function isPastDateTime(date, time) {
  const selected = new Date(`${date}T${time}:00`);
  return selected.getTime() < Date.now();
}

export function isArchivedStatus(status) {
  return ["archived", "completed", "cancelled"].includes(String(status || "").toLowerCase());
}

export function createWhatsAppMessage({ booking, service }) {
  const label = getServiceLabel(service || getServiceById(booking?.service_id));
  return [
    "مرحبًا Rezo Lash ✨",
    "تم حجز موعد جديد.",
    `الاسم: ${booking?.full_name || ""}`,
    `الجوال: ${booking?.phone || ""}`,
    `الخدمة: ${label || booking?.service_name || ""}`,
    `التاريخ: ${booking?.booking_date || ""}`,
    `الوقت: ${formatTimeLabel(booking?.booking_time).ar}`
  ].join("\n");
}
