"use client";

import { useEffect, useMemo, useState } from "react";
import {
  DEFAULT_TIME_SLOTS,
  REMOVAL_OPTIONS,
  SERVICES,
  calculateBookingTotals,
  getServiceById,
  getServiceLabel,
  getStyleOptions,
} from "@/lib/booking";

const POLICY_NOTICE =
  "لا يحق للعميلة المطالبة بالعربون في حال تم إلغاء الموعد أو التأخر أكثر من 20 دقيقة، كما يمكن للعميلة إعادة جدولة الموعد قبل 24 ساعة وبحسب المواعيد المتاحة.";

function getInitialForm() {
  return {
    fullName: "",
    phone: "",
    date: "",
    serviceId: SERVICES[0].id,
    styleId: getStyleOptions(SERVICES[0].id)[0]?.id || "",
    removalOption: REMOVAL_OPTIONS[0].id,
    lowerLashes: false,
    time: "",
  };
}

export default function BookingForm() {
  const [form, setForm] = useState(getInitialForm);
  const [timeSlots, setTimeSlots] = useState(DEFAULT_TIME_SLOTS);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [warning, setWarning] = useState("");
  const [slotMessage, setSlotMessage] = useState("");
  const [selectionNotice, setSelectionNotice] = useState("");

  const selectedService = useMemo(() => getServiceById(form.serviceId), [form.serviceId]);
  const styleOptions = useMemo(() => getStyleOptions(form.serviceId), [form.serviceId]);
  const totals = useMemo(
    () => calculateBookingTotals(selectedService, { removalOption: form.removalOption, lowerLashes: form.lowerLashes }),
    [selectedService, form.removalOption, form.lowerLashes]
  );

  useEffect(() => {
    if (!styleOptions.find((item) => item.id === form.styleId)) {
      setForm((prev) => ({ ...prev, styleId: styleOptions[0]?.id || "" }));
    }
  }, [form.styleId, styleOptions]);

  useEffect(() => {
    if (!selectedService?.supportsRemoval && form.removalOption !== REMOVAL_OPTIONS[0].id) {
      setForm((prev) => ({ ...prev, removalOption: REMOVAL_OPTIONS[0].id }));
    }
    if (!selectedService?.supportsLowerLashes && form.lowerLashes) {
      setForm((prev) => ({ ...prev, lowerLashes: false }));
    }
  }, [selectedService, form.lowerLashes, form.removalOption]);

  useEffect(() => {
    if (!slotMessage && !selectionNotice) return;
    const timeout = setTimeout(() => {
      setSlotMessage("");
      setSelectionNotice("");
    }, 2600);
    return () => clearTimeout(timeout);
  }, [slotMessage, selectionNotice]);

  useEffect(() => {
    function applySelectedService(serviceId) {
      if (!serviceId || !getServiceById(serviceId)) return;
      const nextStyles = getStyleOptions(serviceId);
      setForm((prev) => ({
        ...prev,
        serviceId,
        styleId: nextStyles[0]?.id || "",
        removalOption: REMOVAL_OPTIONS[0].id,
        lowerLashes: false,
      }));
      const service = getServiceById(serviceId);
      setSelectionNotice(`تم اختيار خدمة ${service?.nameAr || ""} بنجاح.`);
    }

    const storedService = typeof window !== "undefined" ? localStorage.getItem("rezo-selected-service") : "";
    if (storedService) applySelectedService(storedService);

    function handleSelected(event) {
      applySelectedService(event.detail?.serviceId);
    }

    window.addEventListener("rezo:service-selected", handleSelected);
    return () => window.removeEventListener("rezo:service-selected", handleSelected);
  }, []);

  useEffect(() => {
    async function loadAvailability() {
      if (!form.date) {
        setBookedSlots([]);
        setTimeSlots(DEFAULT_TIME_SLOTS);
        setWarning("");
        return;
      }

      setLoadingSlots(true);
      setError("");
      setWarning("");

      try {
        const response = await fetch(`/api/availability?date=${form.date}`, { cache: "no-store" });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.details || data.error || "Failed to load availability");
        }

        setBookedSlots(data.bookedSlots || []);
        setTimeSlots(data.slotValues || DEFAULT_TIME_SLOTS);
        setWarning(data.warning || "");
        setForm((prev) => ({
          ...prev,
          time: (data.bookedSlots || []).includes(prev.time) ? "" : prev.time,
        }));
      } catch (err) {
        setTimeSlots(DEFAULT_TIME_SLOTS);
        setBookedSlots([]);
        setWarning("تعذر قراءة المواعيد من قاعدة البيانات مؤقتًا، لذلك تم عرض الأوقات الافتراضية.");
        setError(err.message || "");
      } finally {
        setLoadingSlots(false);
      }
    }

    loadAvailability();
  }, [form.date]);

  function onChange(event) {
    const { name, value, type, checked } = event.target;
    setForm((prev) => {
      if (name === "serviceId") {
        const nextStyles = getStyleOptions(value);
        if (typeof window !== "undefined") {
          localStorage.setItem("rezo-selected-service", value);
        }
        return {
          ...prev,
          serviceId: value,
          styleId: nextStyles[0]?.id || "",
          removalOption: REMOVAL_OPTIONS[0].id,
          lowerLashes: false,
        };
      }
      if (type === "checkbox") {
        return { ...prev, [name]: checked };
      }
      return { ...prev, [name]: value };
    });
  }

  async function submitBooking(event) {
    event.preventDefault();
    setError("");

    if (!form.fullName || !form.phone || !form.date || !form.time || !form.serviceId || !form.styleId) {
      setError("يرجى إكمال جميع الحقول.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Booking failed");
      window.location.href = data.url;
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  const today = new Date().toISOString().split("T")[0];
  const selectedStyle = styleOptions.find((item) => item.id === form.styleId);

  return (
    <section id="booking" className="container-luxe py-14">
      <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="card-luxe fade-in-right p-6 md:p-8">
          <p className="text-sm uppercase tracking-[0.25em] text-black/45">Booking</p>
          <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
            <h2 className="section-title">احجزي موعدك</h2>
            {selectedService ? <span className="selected-service-pill">الخدمة المختارة: {selectedService.nameAr}</span> : null}
          </div>

          <form className="mt-8 grid gap-5" onSubmit={submitBooking}>
            <div>
              <label className="mb-2 block text-sm font-medium">الاسم الكامل</label>
              <input name="fullName" className="input-luxe" value={form.fullName} onChange={onChange} placeholder="مثال: ريم أحمد" />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">رقم الجوال</label>
              <input name="phone" className="input-luxe" value={form.phone} onChange={onChange} placeholder="05xxxxxxxx" />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">الخدمة</label>
              <select name="serviceId" className="input-luxe" value={form.serviceId} onChange={onChange}>
                {SERVICES.map((service) => (
                  <option key={service.id} value={service.id}>
                    {getServiceLabel(service)} — {service.price} SAR
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-3 block text-sm font-medium">اختاري الرسمة المفضلة</label>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {styleOptions.map((style) => {
                  const active = form.styleId === style.id;
                  return (
                    <label key={style.id} className={`style-card ${active ? "style-card-active" : ""}`}>
                      <input type="radio" name="styleId" value={style.id} checked={active} onChange={onChange} className="hidden" />
                      <span className="style-icon" aria-hidden="true" />
                      <span className="block font-medium text-sm">{style.label}</span>
                      <span className="mt-1 block text-xs text-black/55">{style.description}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {selectedService?.supportsRemoval ? (
              <div>
                <label className="mb-3 block text-sm font-medium">الإزالة قبل الخدمة</label>
                <div className="grid gap-3 sm:grid-cols-2">
                  {REMOVAL_OPTIONS.map((option) => {
                    const active = form.removalOption === option.id;
                    return (
                      <label key={option.id} className={`soft-option ${active ? "soft-option-active" : ""}`}>
                        <input type="radio" name="removalOption" value={option.id} checked={active} onChange={onChange} className="hidden" />
                        <span className="soft-option-dot" aria-hidden="true" />
                        <span className="text-sm font-medium">{option.label}</span>
                        {option.id === "needs-removal" ? <span className="block text-xs text-black/55">+ 120 SAR و +30 دقيقة</span> : null}
                      </label>
                    );
                  })}
                </div>
              </div>
            ) : null}

            {selectedService?.supportsLowerLashes ? (
              <label className="soft-check">
                <input type="checkbox" name="lowerLashes" checked={form.lowerLashes} onChange={onChange} />
                <span>
                  <strong className="block text-sm">+ رموش سفلية</strong>
                  <span className="block text-xs text-black/55">يضاف نصف مبلغ العلوية</span>
                </span>
              </label>
            ) : null}

            <div>
              <label className="mb-2 block text-sm font-medium">التاريخ</label>
              <input type="date" name="date" className="input-luxe" value={form.date} onChange={onChange} min={today} />
            </div>

            <div>
              <label className="mb-3 block text-sm font-medium">المواعيد المتاحة</label>
              {loadingSlots ? (
                <p className="text-sm text-black/60">جاري تحميل المواعيد...</p>
              ) : (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                  {timeSlots.map((slot) => {
                    const disabled = bookedSlots.includes(slot);
                    const active = form.time === slot && !disabled;
                    return (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => {
                          if (disabled) {
                            setSlotMessage("هذا الموعد غير متاح");
                            return;
                          }
                          setForm((prev) => ({ ...prev, time: slot }));
                        }}
                        className={`slot-btn ${disabled ? "slot-btn-booked" : active ? "slot-btn-active" : "slot-btn-open"}`}
                      >
                        <span className="block text-sm font-medium">{slot}</span>
                        <span className="mt-1 block text-[11px] text-black/50">{disabled ? "غير متاح" : active ? "تم الاختيار" : "متاح"}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {selectionNotice ? <p className="notice-success">{selectionNotice}</p> : null}
            {slotMessage ? <p className="notice-warning">{slotMessage}</p> : null}
            {warning ? <p className="notice-warning">{warning}</p> : null}
            {error ? <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}

            <button type="submit" className="btn-primary w-full" disabled={submitting}>
              {submitting ? "جاري إرسال الحجز..." : `تأكيد طلب الحجز — عربون ${totals.depositAmount} SAR`}
            </button>
          </form>
        </div>

        <aside className="card-luxe fade-in-left p-6 md:p-8">
          <p className="text-sm uppercase tracking-[0.25em] text-black/45">Summary</p>
          <h3 className="mt-2 text-2xl font-semibold">ملخص الحجز</h3>

          <div className="mt-6 space-y-4 text-sm">
            <SummaryRow label="الخدمة" value={selectedService?.nameAr} />
            <SummaryRow label="الرسمة" value={selectedStyle?.label} />
            <SummaryRow label="السعر الأساسي" value={`${totals.basePrice} SAR`} />
            {selectedService?.supportsRemoval ? <SummaryRow label="الإزالة" value={`${totals.removalPrice} SAR`} /> : null}
            {selectedService?.supportsLowerLashes ? <SummaryRow label="الرموش السفلية" value={`${totals.lowerLashesPrice} SAR`} /> : null}
            <SummaryRow label="المدة المتوقعة" value={`${totals.totalDuration} دقيقة`} />
            <SummaryRow label="الإجمالي" value={`${totals.totalPrice} SAR`} strong />
            <SummaryRow label="العربون" value={`${totals.depositAmount} SAR`} strong />
            <SummaryRow label="المتبقي عند الحضور" value={`${totals.remainingAmount} SAR`} />
          </div>

          <div className="mt-6 rounded-3xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm leading-7 text-amber-950">
            <strong className="mb-2 block">سياسة الحجز</strong>
            <p>{POLICY_NOTICE}</p>
          </div>
        </aside>
      </div>
    </section>
  );
}

function SummaryRow({ label, value, strong = false }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-black/5 bg-black/[0.02] px-4 py-3">
      <span className="text-black/50">{label}</span>
      <span className={strong ? "font-semibold text-lg" : "font-medium"}>{value || "—"}</span>
    </div>
  );
}
