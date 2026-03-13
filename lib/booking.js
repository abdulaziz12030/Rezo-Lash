export const SERVICES = [
  {
    id: "classic",
    name: "Classic Lashes",
    arabicName: "الرموش الكلاسيك",
    price: 220,
    deposit: 50,
    duration: 120,
    description: "Natural and elegant everyday lashes",
    arabicDescription: "تركيب رمش واحد على كل رمش طبيعي لإطلالة ناعمة وأنيقة.",
    image: "/services/classic.svg",
    suggestedPhoto: "لقطة قريبة لعين برموش طبيعية مرتبة وخفيفة مع كثافة بسيطة ولمسة ناعمة.",
  },
  {
    id: "volume",
    name: "Volume Lashes",
    arabicName: "رموش الفوليوم",
    price: 260,
    deposit: 50,
    duration: 120,
    description: "Soft fuller texture",
    arabicDescription: "عدة رموش خفيفة على كل رمش طبيعي لكثافة أوضح وملمس fluffy.",
    image: "/services/volume.svg",
    suggestedPhoto: "لقطة عين قريبة برموش أكثر امتلاءً ووضوحًا مع تدرج كثيف ومرتب.",
  },
  {
    id: "hybrid",
    name: "Hybrid Lashes",
    arabicName: "رموش الهايبرد",
    price: 280,
    deposit: 50,
    duration: 120,
    description: "A balance between classic and volume",
    arabicDescription: "مزيج بين الكلاسيك والفوليوم لنتيجة متوازنة وطبيعية أكثر.",
    image: "/services/hybrid.svg",
    suggestedPhoto: "لقطة لعين تجمع بين خصل ناعمة وكثافة متوسطة مع Texture واضح.",
  },
  {
    id: "russian",
    name: "Russian Volume",
    arabicName: "رموش الروسي",
    price: 320,
    deposit: 75,
    duration: 150,
    description: "Dense premium dramatic result",
    arabicDescription: "كثافة أعلى ولمسة فاخرة بارزة لمحبات الإطلالة الواضحة.",
    image: "/services/russian.svg",
    suggestedPhoto: "صورة عين برموش كثيفة ومرفوعة بتوزيع مروحي واضح ولمسة درامية أنيقة.",
  },
  {
    id: "mega",
    name: "Mega Volume",
    arabicName: "الميقا فوليوم",
    price: 360,
    deposit: 75,
    duration: 150,
    description: "VIP bold glam style",
    arabicDescription: "أقصى كثافة ولمسة جلام فاخرة لإطلالة قوية ومميزة.",
    image: "/services/mega.svg",
    suggestedPhoto: "صورة عين قريبة جدًا بكثافة عالية جدًا وخصل سوداء فاخرة ومظهر glam واضح.",
  },
  {
    id: "refill",
    name: "Refill",
    arabicName: "تعبئة الرموش",
    price: 180,
    deposit: 50,
    duration: 90,
    description: "Maintenance appointment after 2–3 weeks",
    arabicDescription: "جلسة صيانة وتعبئة بعد أسبوعين إلى ثلاثة للحفاظ على جمال النتيجة.",
    image: "/services/refill.svg",
    suggestedPhoto: "صورة توضح لمسة تجديد للرموش مع فراغات بسيطة قبل التعبئة ونتيجة مرتبة بعدها.",
  }
];

export const DEFAULT_TIME_SLOTS = ["11:00", "13:30", "16:00", "18:30"];

export function getServiceById(serviceId) {
  return SERVICES.find((item) => item.id === serviceId);
}

export function isPastDateTime(date, time) {
  const selected = new Date(`${date}T${time}:00`);
  return selected.getTime() < Date.now();
}
