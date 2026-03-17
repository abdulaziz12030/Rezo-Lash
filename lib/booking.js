export const WHATSAPP_NUMBER = "966570905999";

export const REMOVAL_PRICE = 120;
export const REMOVAL_DURATION = 30;

export const SERVICE_STYLES = {
  classic: [
    { id: "cat-eye", label: "Cat Eye", description: "لتطويل العين" },
    { id: "doll-eye", label: "Doll Eye", description: "يوسع العين" },
    { id: "natural-volume", label: "Natural Volume", description: "مظهر طبيعي" }
  ],
  hybrid: [
    { id: "cat-eye", label: "Cat Eye", description: "لتطويل العين" },
    { id: "doll-eye", label: "Doll Eye", description: "يوسع العين" },
    { id: "natural-volume", label: "Natural Volume", description: "مظهر طبيعي" }
  ],
  volume: [
    { id: "cat-eye", label: "Cat Eye", description: "لتطويل العين" },
    { id: "doll-eye", label: "Doll Eye", description: "يوسع العين" },
    { id: "natural-volume", label: "Natural Volume", description: "مظهر طبيعي" }
  ],
  mega: [
    { id: "cat-eye", label: "Cat Eye", description: "لتطويل العين" },
    { id: "doll-eye", label: "Doll Eye", description: "يوسع العين" },
    { id: "natural-volume", label: "Natural Volume", description: "مظهر طبيعي" }
  ],
  russian: [
    { id: "dramatic", label: "Dramatic", description: "رسمة خاصة للروسي" }
  ],
  refill: [
    { id: "cat-eye", label: "Cat Eye", description: "لتطويل العين" },
    { id: "doll-eye", label: "Doll Eye", description: "يوسع العين" },
    { id: "natural-volume", label: "Natural Volume", description: "مظهر طبيعي" }
  ],
  removal: [
    { id: "removal-only", label: "Lash Removal", description: "إزالة آمنة للرموش القديمة" }
  ]
};

export const REMOVAL_OPTIONS = [
  { id: "no-removal", label: "لا يتطلب إزالة" },
  { id: "needs-removal", label: "يتطلب إزالة الرموش القديمة" }
];

export const SERVICES = [
  { id: "classic", nameAr: "كلاسيك", nameEn: "Classic Lashes", price: 220, deposit: 110, duration: 120, descriptionAr: "رموش ناعمة ومفردة تعطي تحديدًا مرتبًا ولمسة طبيعية جدًا.", descriptionEn: "Soft single-lash definition with a clean natural finish.", styleSummary: "مثالية للمظهر الطبيعي اليومي ولمحبّات النعومة.", image: "/services/classic.svg", supportsRemoval: true, supportsLowerLashes: true },
  { id: "hybrid", nameAr: "هايبرد", nameEn: "Hybrid Lashes", price: 280, deposit: 140, duration: 120, descriptionAr: "مزيج بين الكلاسيك والفوليوم لنتيجة متوازنة وملمس أجمل للرموش.", descriptionEn: "A balanced mix of classic and volume for texture and elegance.", styleSummary: "كثافة أنيقة ومتوازنة بدون مبالغة.", image: "/services/hybrid.svg", supportsRemoval: true, supportsLowerLashes: true },
  { id: "volume", nameAr: "فوليوم", nameEn: "Volume Lashes", price: 260, deposit: 130, duration: 120, descriptionAr: "كثافة ناعمة بفانات خفيفة تمنح العين حضورًا أكثر وأنوثة واضحة.", descriptionEn: "Fluffy fans that create a fuller feminine look.", styleSummary: "مناسبة لإبراز العين بامتلاء أنيق.", image: "/services/volume.svg", supportsRemoval: true, supportsLowerLashes: true },
  { id: "mega", nameAr: "ميقا فوليوم", nameEn: "Mega Volume", price: 360, deposit: 180, duration: 150, descriptionAr: "كثافة قوية جدًا ولمعة درامية لنتيجة فاخرة وجريئة.", descriptionEn: "Ultra-full dramatic lashes with a bold luxe effect.", styleSummary: "لمن تحب الإطلالة البارزة والفخمة.", image: "/services/mega.svg", supportsRemoval: true, supportsLowerLashes: true },
  { id: "russian", nameAr: "روسي فوليوم", nameEn: "Russian Volume", price: 320, deposit: 160, duration: 150, descriptionAr: "فانات روسية مرتبة بكثافة فاخرة مع رسمة درامية مميزة.", descriptionEn: "Dense Russian fans with premium drama.", styleSummary: "الخيار المثالي لعاشقات الرسمة الفخمة.", image: "/services/russian.svg", supportsRemoval: true, supportsLowerLashes: true },
  { id: "refill", nameAr: "ريفل تعبئة", nameEn: "Refill", price: 180, deposit: 90, duration: 90, descriptionAr: "جلسة صيانة وتعبئة للحفاظ على جمال الرموش واستمرارية الرسمة.", descriptionEn: "Refresh and refill session to maintain your lash set.", styleSummary: "مناسبة بعد 2 إلى 3 أسابيع حسب الفراغات.", image: "/services/refill.svg", supportsRemoval: false, supportsLowerLashes: true },
  { id: "removal", nameAr: "إزالة رموش", nameEn: "Lash Removal", price: 120, deposit: 60, duration: 30, descriptionAr: "إزالة آمنة ولطيفة للرموش القديمة مع الحفاظ على الرموش الطبيعية.", descriptionEn: "Safe professional lash removal.", styleSummary: "خدمة مستقلة عند الحاجة فقط.", image: "/services/removal.svg", supportsRemoval: false, supportsLowerLashes: false }
];

export const DEFAULT_TIME_SLOTS = ["09:00", "11:00", "16:00", "18:00", "20:00"];

export const DISPLAY_TIME_SLOTS = {
  "09:00": "9:00 AM",
  "11:00": "11:00 AM",
  "16:00": "4:00 PM",
  "18:00": "6:00 PM",
  "20:00": "8:00 PM"
};

export function getServiceById(serviceId) { return SERVICES.find((item) => item.id === serviceId); }
export function getServiceLabel(service) { if (!service) return ""; return `${service.nameAr} | ${service.nameEn}`; }
export function getStyleOptions(serviceId) { return SERVICE_STYLES[serviceId] || []; }
export function getStyleLabel(serviceId, styleId) { const style = getStyleOptions(serviceId).find((item) => item.id === styleId); if (!style) return ""; return `${style.label} — ${style.description}`; }
export function getRemovalLabel(removalId) { return REMOVAL_OPTIONS.find((item) => item.id === removalId)?.label || ""; }
export function getDisplayTime(time) { return DISPLAY_TIME_SLOTS[time] || time; }
export function buildWhatsAppUrl(number, message) { return `https://wa.me/${number}?text=${encodeURIComponent(message)}`; }
export function normalizePhoneNumber(phone = "") {
  const cleaned = String(phone).replace(/\D/g, "");
  if (!cleaned) return "";
  if (cleaned.startsWith("966")) return cleaned;
  if (cleaned.startsWith("05")) return `966${cleaned.slice(1)}`;
  if (cleaned.startsWith("5")) return `966${cleaned}`;
  return cleaned;
}
export function isValidSaudiPhone(phone = "") {
  const normalized = normalizePhoneNumber(phone);
  return /^9665\d{8}$/.test(normalized);
}
export function getTodayRiyadhDate() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Riyadh",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}
export function isPastDateTime(date, time) {
  if (!date || !time) return false;
  const selected = new Date(`${date}T${time}:00+03:00`);
  return selected.getTime() < Date.now();
}
export function isArchivedStatus(status) { return ["archived", "completed", "cancelled"].includes(String(status || "").toLowerCase()); }
export function calculateLowerLashesPrice(service) { if (!service?.supportsLowerLashes) return 0; return Math.round((service.price || 0) / 2); }
export function calculateBookingTotals(service, options = {}) {
  const basePrice = service?.price || 0;
  const baseDuration = service?.duration || 0;
  const removalPrice = service?.supportsRemoval && options.removalOption === "needs-removal" ? REMOVAL_PRICE : 0;
  const lowerLashesPrice = service?.supportsLowerLashes && options.lowerLashes ? calculateLowerLashesPrice(service) : 0;
  const totalPrice = basePrice + removalPrice + lowerLashesPrice;
  const totalDuration = baseDuration + (removalPrice ? REMOVAL_DURATION : 0);
  const depositAmount = Math.round(totalPrice * 0.5);
  const remainingAmount = totalPrice - depositAmount;
  return { basePrice, baseDuration, removalPrice, lowerLashesPrice, totalPrice, totalDuration, depositAmount, remainingAmount };
}
export function buildAdminWhatsAppUrl({ name, phone, serviceLabel, styleLabel, date, time, totalPrice, depositAmount }) {
  const message = `حجز جديد في Rezo Lash\n\nالاسم: ${name || "-"}\nالجوال: ${phone || "-"}\nالخدمة: ${serviceLabel || "-"}\nالرسمة: ${styleLabel || "-"}\nالتاريخ: ${date || "-"}\nالوقت: ${time || "-"}\nالإجمالي: ${totalPrice || 0} SAR\nالعربون: ${depositAmount || 0} SAR`;
  return buildWhatsAppUrl(WHATSAPP_NUMBER, message);
}
export function buildCustomerReplyTemplate({ name, serviceLabel, date, time, depositAmount }) {
  return `مرحبًا ${name || ""} ✨
تم تسجيل طلب حجزك في Rezo Lash

الخدمة: ${serviceLabel || "-"}
التاريخ: ${date || "-"}
الوقت: ${time || "-"}
العربون: ${depositAmount || 0} SAR

بانتظار تأكيدك عبر الواتساب 💫`;
}
export function buildCustomerWhatsAppUrl(phone, payload) {
  return buildWhatsAppUrl(normalizePhoneNumber(phone), buildCustomerReplyTemplate(payload));
}
