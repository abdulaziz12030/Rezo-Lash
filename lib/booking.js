
export const WHATSAPP_NUMBER = "966570905999";
export const REMOVAL_PRICE = 120;

export const STYLE_CARD_DETAILS = {
  "cat-eye": {
    title: "Cat Eye",
    subtitle: "لتطويل العين",
    description: "تدرج أطول عند الزاوية الخارجية ليمنح العين شكلًا مسحوبًا وأنيقًا."
  },
  "doll-eye": {
    title: "Doll Eye",
    subtitle: "يوسع العين",
    description: "تركيز الطول في منتصف العين ليمنحك نظرة أوسع وأكثر إشراقًا."
  },
  "natural-volume": {
    title: "Natural Volume",
    subtitle: "مظهر طبيعي",
    description: "كثافة ناعمة ومتزنة تناسب الإطلالة اليومية الراقية."
  },
  dramatic: {
    title: "Dramatic",
    subtitle: "للروسي فقط",
    description: "رسمة كثيفة وجريئة بتأثير فخم وواضح لعاشقات اللوك البارز."
  }
};

export const SERVICE_STYLES = {
  classic: ["cat-eye", "doll-eye", "natural-volume"],
  hybrid: ["cat-eye", "doll-eye", "natural-volume"],
  volume: ["cat-eye", "doll-eye", "natural-volume"],
  mega: ["cat-eye", "doll-eye", "natural-volume"],
  russian: ["dramatic"],
  refill: ["cat-eye", "doll-eye", "natural-volume"],
  removal: []
};

export const REMOVAL_OPTIONS = [
  { id: "no-removal", label: "لا يتطلب إزالة" },
  { id: "needs-removal", label: "يتطلب إزالة الرموش القديمة", price: REMOVAL_PRICE, extraDuration: 30 }
];

export const SERVICES = [
  {
    id: "classic",
    nameAr: "كلاسيك",
    nameEn: "Classic Lashes",
    price: 220,
    duration: 120,
    descriptionAr: "رموش مفردة ناعمة تعطي تحديدًا مرتبًا ولمسة طبيعية راقية.",
    descriptionEn: "Soft single-lash definition with a clean natural finish.",
    styleSummary: "مثالية للمظهر الطبيعي اليومي.",
    image: "/services/classic.svg",
    allowsRemovalOption: true,
    allowsLowerLashes: true
  },
  {
    id: "hybrid",
    nameAr: "هايبرد",
    nameEn: "Hybrid Lashes",
    price: 280,
    duration: 120,
    descriptionAr: "مزيج متوازن بين الكلاسيك والفوليوم لنتيجة أنيقة وملمس أجمل.",
    descriptionEn: "A balanced mix of classic and volume for texture and elegance.",
    styleSummary: "توازن جميل بين الطبيعي والكثافة.",
    image: "/services/hybrid.svg",
    allowsRemovalOption: true,
    allowsLowerLashes: true
  },
  {
    id: "volume",
    nameAr: "فوليوم",
    nameEn: "Volume Lashes",
    price: 260,
    duration: 120,
    descriptionAr: "فانات خفيفة تمنح العين كثافة ناعمة وحضورًا أكثر أنوثة.",
    descriptionEn: "Fluffy fans that create a fuller feminine look.",
    styleSummary: "كثافة أنيقة ولمسة ناعمة.",
    image: "/services/volume.svg",
    allowsRemovalOption: true,
    allowsLowerLashes: true
  },
  {
    id: "mega",
    nameAr: "ميقا فوليوم",
    nameEn: "Mega Volume",
    price: 360,
    duration: 150,
    descriptionAr: "كثافة درامية فاخرة لنتيجة جريئة وواضحة.",
    descriptionEn: "Ultra-full dramatic lashes with a bold luxe effect.",
    styleSummary: "للإطلالة البارزة والفخمة.",
    image: "/services/mega.svg",
    allowsRemovalOption: true,
    allowsLowerLashes: true
  },
  {
    id: "russian",
    nameAr: "روسي فوليوم",
    nameEn: "Russian Volume",
    price: 320,
    duration: 150,
    descriptionAr: "فانات روسية مرتبة بكثافة فاخرة ورسمة درامية راقية.",
    descriptionEn: "Dense Russian fans with premium drama and versatile styling.",
    styleSummary: "الأفضل لعاشقات اللوك الفخم.",
    image: "/services/russian.svg",
    allowsRemovalOption: true,
    allowsLowerLashes: true
  },
  {
    id: "refill",
    nameAr: "ريفل تعبئة",
    nameEn: "Refill",
    price: 180,
    duration: 90,
    descriptionAr: "جلسة صيانة وتعبئة للحفاظ على جمال الرموش واستمرارية الرسمة.",
    descriptionEn: "Refresh and refill session to maintain your lash set.",
    styleSummary: "للمحافظة على الشكل بعد أسابيع من التركيب.",
    image: "/services/refill.svg",
    allowsRemovalOption: false,
    allowsLowerLashes: true
  },
  {
    id: "removal",
    nameAr: "إزالة رموش",
    nameEn: "Lash Removal",
    price: 120,
    duration: 30,
    descriptionAr: "إزالة آمنة للرموش القديمة مع الحفاظ على الرموش الطبيعية.",
    descriptionEn: "Safe lash removal to protect your natural lashes.",
    styleSummary: "خدمة منفصلة لإزالة الرموش فقط.",
    image: "/services/removal.svg",
    allowsRemovalOption: false,
    allowsLowerLashes: false
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
  return (SERVICE_STYLES[serviceId] || []).map((id) => ({
    id,
    label: `${STYLE_CARD_DETAILS[id].title} — ${STYLE_CARD_DETAILS[id].subtitle}`,
    ...STYLE_CARD_DETAILS[id]
  }));
}

export function getStyleLabel(serviceId, styleId) {
  const style = getStyleOptions(serviceId).find((item) => item.id === styleId);
  return style?.label || "";
}

export function getRemovalLabel(removalId) {
  return REMOVAL_OPTIONS.find((item) => item.id === removalId)?.label || "";
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

export function calculateBookingTotals(serviceId, removalOption = "no-removal", addLowerLashes = false) {
  const service = getServiceById(serviceId);
  if (!service) {
    return {
      basePrice: 0,
      removalPrice: 0,
      lowerLashesPrice: 0,
      totalPrice: 0,
      deposit: 0,
      remaining: 0,
      totalDuration: 0
    };
  }

  const removalPrice =
    service.allowsRemovalOption && removalOption === "needs-removal" ? REMOVAL_PRICE : 0;
  const lowerLashesPrice =
    service.allowsLowerLashes && addLowerLashes ? Math.round(service.price / 2) : 0;
  const totalPrice = service.price + removalPrice + lowerLashesPrice;
  const deposit = Math.round(totalPrice * 0.5);
  const totalDuration =
    service.duration + (service.allowsRemovalOption && removalOption === "needs-removal" ? 30 : 0);

  return {
    basePrice: service.price,
    removalPrice,
    lowerLashesPrice,
    totalPrice,
    deposit,
    remaining: totalPrice - deposit,
    totalDuration
  };
}
