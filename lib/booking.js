export const SERVICES = [
  {
    id: "classic",
    name: "Classic Lashes",
    price: 220,
    deposit: 50,
    duration: 120,
    description: "Natural and elegant everyday lashes"
  },
  {
    id: "volume",
    name: "Volume Lashes",
    price: 260,
    deposit: 50,
    duration: 120,
    description: "Soft fuller texture"
  },
  {
    id: "hybrid",
    name: "Hybrid Lashes",
    price: 280,
    deposit: 50,
    duration: 120,
    description: "A balance between classic and volume"
  },
  {
    id: "russian",
    name: "Russian Volume",
    price: 320,
    deposit: 75,
    duration: 150,
    description: "Dense premium dramatic result"
  },
  {
    id: "mega",
    name: "Mega Volume",
    price: 360,
    deposit: 75,
    duration: 150,
    description: "VIP bold glam style"
  },
  {
    id: "refill",
    name: "Refill",
    price: 180,
    deposit: 50,
    duration: 90,
    description: "Maintenance appointment after 2–3 weeks"
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
