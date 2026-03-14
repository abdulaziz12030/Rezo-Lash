export const SERVICES = [
  {
    id: "classic",
    nameAr: "كلاسيك",
    nameEn: "Classic Lashes",
    price: 220,
    deposit: 50,
    duration: 120,
    descriptionAr: "إطلالة طبيعية مرتبة.",
    descriptionEn: "Soft natural definition.",
    image: "/services/classic.svg",
    imageBrief: "صورة مودل بعيون قريبة، رموش كلاسيك ناعمة مفردة وطبيعية من زاوية أمامية نظيفة."
  },
  {
    id: "volume",
    nameAr: "فوليوم",
    nameEn: "Volume Lashes",
    price: 260,
    deposit: 50,
    duration: 120,
    descriptionAr: "كثافة أنثوية أوضح.",
    descriptionEn: "Fuller fluffy finish.",
    image: "/services/volume.svg",
    imageBrief: "صورة مودل جميلة برموش فوليوم كثيفة ومرتبة مع إبراز الامتلاء بدون مبالغة."
  },
  {
    id: "hybrid",
    nameAr: "هايبرد",
    nameEn: "Hybrid Lashes",
    price: 280,
    deposit: 50,
    duration: 120,
    descriptionAr: "توازن بين الطبيعي والكثيف.",
    descriptionEn: "Balanced textured mix.",
    image: "/services/hybrid.svg",
    imageBrief: "صورة مودل لرموش هايبرد بتكسشر واضح، مزيج بين الكلاسيك والفوليوم."
  },
  {
    id: "russian",
    nameAr: "روسي",
    nameEn: "Russian Volume",
    price: 320,
    deposit: 75,
    duration: 150,
    descriptionAr: "كثافة فاخرة ومرتبة.",
    descriptionEn: "Dense premium drama.",
    image: "/services/russian.svg",
    imageBrief: "صورة مودل لرموش روسي كثيفة جدًا وأنيقة مع إبراز الفانات بوضوح."
  },
  {
    id: "mega",
    nameAr: "ميغا فوليوم",
    nameEn: "Mega Volume",
    price: 360,
    deposit: 75,
    duration: 150,
    descriptionAr: "إطلالة جريئة ومكثفة.",
    descriptionEn: "Bold glamorous volume.",
    image: "/services/mega.svg",
    imageBrief: "صورة مودل بإطلالة قوية جدًا مع رموش ميغا فوليوم واضحة وفاخرة."
  },
  {
    id: "refill",
    nameAr: "تعبئة",
    nameEn: "Refill",
    price: 180,
    deposit: 50,
    duration: 90,
    descriptionAr: "صيانة بعد 2 إلى 3 أسابيع.",
    descriptionEn: "Maintenance refresh session.",
    image: "/services/refill.svg",
    imageBrief: "صورة قبل/بعد أو مودل يظهر فيها تجديد الرموش وتعبئتها بشكل مرتب."
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

export function isPastDateTime(date, time) {
  const selected = new Date(`${date}T${time}:00`);
  return selected.getTime() < Date.now();
}

export function isArchivedStatus(status) {
  return ["archived", "completed", "cancelled"].includes(String(status || "").toLowerCase());
}
