
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  DEFAULT_TIME_SLOTS,
  DISPLAY_TIME_SLOTS,
  REMOVAL_OPTIONS,
  SERVICES,
  calculateBookingTotals,
  getDisplayTime,
  getServiceById,
  getServiceLabel,
  getStyleOptions
} from "@/lib/booking";

function StyleCards({ options, selectedId, onSelect }) {
  if (!options.length) return null;

  return (
    <div>
      <label className="mb-3 block text-sm font-medium">الرسمة المفضلة</label>
      <div className="grid gap-3 sm:grid-cols-2">
        {options.map((style) => (
          <button
            key={style.id}
            type="button"
            onClick={() => onSelect(style.id)}
            className={`style-card text-right ${selectedId === style.id ? "style-card-active" : ""}`}
          >
            <span className="style-card-icon">{style.title.slice(0, 1)}</span>
            <span className="block">
              <strong className="block text-base">{style.title}</strong>
              <span className="mt-1 block text-sm text-black/55">{style.subtitle}</span>
              <span className="mt-2 block text-sm leading-6 text-black/70">{style.description}</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function BookingForm() {
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    date: "",
    serviceId: SERVICES[0].id,
    styleId: getStyleOptions(SERVICES[0].id)[0]?.id || "",
    removalOption: "no-removal",
    addLowerLashes: false,
    acceptedPolicy: false,
    time: ""
  });

  const [timeSlots, setTimeSlots] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [warning, setWarning] = useState("");

  const selectedService = useMemo(() => getServiceById(form.serviceId), [form.serviceId]);
  const styleOptions = useMemo(() => getStyleOptions(form.serviceId), [form.serviceId]);
  const totals = useMemo(
    () => calculateBookingTotals(form.serviceId, form.removalOption, form.addLowerLashes),
    [form.serviceId, form.removalOption, form.addLowerLashes]
  );

  useEffect(() => {
    if (!styleOptions.find((item) => item.id === form.styleId)) {
      setForm((prev) => ({ ...prev, styleId: styleOptions[0]?.id || "" }));
    }
  }, [form.styleId, styleOptions]);

  useEffect(() => {
    if (!selectedService?.allowsRemovalOption && form.removalOption !== "no-removal") {
      setForm((prev) => ({ ...prev, removalOption: "no-removal" }));
    }
    if (!selectedService?.allowsLowerLashes && form.addLowerLashes) {
      setForm((prev) => ({ ...prev, addLowerLashes: false }));
    }
  }, [selectedService, form.removalOption, form.addLowerLashes]);

  useEffect(() => {
    async function loadAvailability() {
      if (!form.date) {
        setBookedSlots([]);
        setTimeSlots([]);
        setWarning("");
        return;
      }

      setLoadingSlots(true);
      setError("");
      setWarning("");

      try {
        const response = await fetch(`/api/availability?date=${form.date}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to load availability");
        }

        setBookedSlots(data.bookedSlots || []);
        setTimeSlots(data.timeSlots?.length ? data.timeSlots : DEFAULT_TIME_SLOTS);
        setWarning(data.warning || "");
        setForm((prev) => ({
          ...prev,
          time: data.bookedSlots?.includes(prev.time) ? "" : prev.time
        }));
      } catch (err) {
        setTimeSlots(DEFAULT_TIME_SLOTS);
        setBookedSlots([]);
        setWarning("تعذر قراءة المواعيد من قاعدة البيانات مؤقتًا، لذلك تم عرض الأوقات الافتراضية.");
        setError("");
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
        return {
          ...prev,
          serviceId: value,
          styleId: nextStyles[0]?.id || "",
          removalOption: getServiceById(value)?.allowsRemovalOption ? prev.removalOption : "no-removal",
          addLowerLashes: getServiceById(value)?.allowsLowerLashes ? prev.addLowerLashes : false
        };
      }
      return { ...prev, [name]: type === "checkbox" ? checked : value };
    });
  }

  async function submitBooking(event) {
    event.preventDefault();
    setError("");

    if (!form.fullName || !form.phone || !form.date || !form.time || !form.serviceId) {
      setError("يرجى إكمال جميع الحقول.");
      return;
    }

    if (styleOptions.length && !form.styleId) {
      setError("يرجى اختيار الرسمة المناسبة.");
      return;
    }

    if (!form.acceptedPolicy) {
      setError("يرجى الموافقة على سياسة العربون قبل الدفع.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
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

  return (
    <section id="booking" className="container-luxe py-14">
      <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="card-luxe fade-up p-6 md:p-8">
          <p className="text-sm uppercase tracking-[0.25em] text-black/45">Booking</p>
          <h2 className="section-title mt-2">احجزي موعدك</h2>

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

            <StyleCards
              options={styleOptions}
              selectedId={form.styleId}
              onSelect={(styleId) => setForm((prev) => ({ ...prev, styleId }))}
            />

            {selectedService?.allowsRemovalOption ? (
              <div>
                <label className="mb-3 block text-sm font-medium">إزالة الرموش القديمة</label>
                <div className="grid gap-3 sm:grid-cols-2">
                  {REMOVAL_OPTIONS.map((option) => {
                    const selected = form.removalOption === option.id;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => setForm((prev) => ({ ...prev, removalOption: option.id }))}
                        className={`mini-option-card text-right ${selected ? "mini-option-card-active" : ""}`}
                      >
                        <strong className="block text-base">{option.label}</strong>
                        <span className="mt-1 block text-sm text-black/60">
                          {option.id === "needs-removal" ? `+${option.price} SAR و +30 min` : "بدون رسوم إضافية"}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : null}

            {selectedService?.allowsLowerLashes ? (
              <label className="mini-checkbox-card">
                <input
                  type="checkbox"
                  name="addLowerLashes"
                  checked={form.addLowerLashes}
                  onChange={onChange}
                />
                <span>
                  <strong className="block">+ رموش سفلية</strong>
                  <span className="mt-1 block text-sm text-black/60">
                    يضاف نصف مبلغ العلوية ({totals.lowerLashesPrice || Math.round((selectedService?.price || 0) / 2)} SAR)
                  </span>
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
                    return (
                      <label key={slot} className={`cursor-pointer rounded-2xl border px-4 py-3 text-center text-sm transition ${disabled ? "cursor-not-allowed border-black/10 bg-black/5 text-black/30" : form.time === slot ? "border-gold bg-gold/20" : "border-black/10 bg-white hover:border-gold/60 hover:-translate-y-0.5"}`}>
                        <input type="radio" name="time" value={slot} checked={form.time === slot} onChange={onChange} disabled={disabled} className="hidden" />
                        <span className="block font-medium">{getDisplayTime(slot)}</span>
                      </label>
                    );
                  })}
                </div>
              )}
              <p className="mt-3 text-xs text-black/50">Morning: 9:00 AM و 11:00 AM — Evening: 4:00 PM و 6:00 PM و 8:00 PM</p>
            </div>

            <div className="rounded-3xl border border-gold/30 bg-[#fff8ef] px-5 py-4 text-sm leading-7 text-black/75">
              لا يحق للعميلة المطالبة بالعربون في حال تم إلغاء الموعد أو التأخر أكثر من 20 دقيقة،
              كما يمكن للعميلة إعادة جدولة الموعد قبل 24 ساعة وبحسب المواعيد المتاحة.
            </div>

            <label className="flex items-start gap-3 rounded-2xl border border-black/8 bg-white px-4 py-3 text-sm">
              <input
                type="checkbox"
                name="acceptedPolicy"
                checked={form.acceptedPolicy}
                onChange={onChange}
                className="mt-1 h-4 w-4 rounded border-black/20 text-ink"
              />
              <span>أوافق على سياسة العربون وشروط الموعد قبل الانتقال للدفع.</span>
            </label>

            {warning ? <div className="rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-800">{warning}</div> : null}
            {error ? <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}

            <button type="submit" className="btn-primary pulse-soft" disabled={submitting}>
              {submitting ? "جاري التحويل..." : `ادفعي عربون ${totals.deposit} ريال`}
            </button>
          </form>
        </div>

        <div className="card-luxe fade-up p-6 md:p-8" style={{ animationDelay: "120ms" }}>
          <p className="text-sm uppercase tracking-[0.25em] text-black/45">Summary</p>
          <h3 className="mt-2 text-2xl font-semibold">{getServiceLabel(selectedService) || "Selected Service"}</h3>

          <div className="mt-6 space-y-4 text-sm">
            <div className="flex justify-between border-b border-black/5 pb-3">
              <span className="text-black/55">السعر الأساسي</span>
              <span className="font-medium">{totals.basePrice} SAR</span>
            </div>
            {selectedService?.allowsLowerLashes ? (
              <div className="flex justify-between border-b border-black/5 pb-3">
                <span className="text-black/55">رموش سفلية</span>
                <span className="font-medium">{totals.lowerLashesPrice} SAR</span>
              </div>
            ) : null}
            {selectedService?.allowsRemovalOption ? (
              <div className="flex justify-between border-b border-black/5 pb-3">
                <span className="text-black/55">إزالة قديمة</span>
                <span className="font-medium">{totals.removalPrice} SAR</span>
              </div>
            ) : null}
            <div className="flex justify-between border-b border-black/5 pb-3">
              <span className="text-black/55">الإجمالي</span>
              <span className="font-medium">{totals.totalPrice} SAR</span>
            </div>
            <div className="flex justify-between border-b border-black/5 pb-3">
              <span className="text-black/55">العربون (50%)</span>
              <span className="font-medium">{totals.deposit} SAR</span>
            </div>
            <div className="flex justify-between border-b border-black/5 pb-3">
              <span className="text-black/55">المدة المتوقعة</span>
              <span className="font-medium">{totals.totalDuration} min</span>
            </div>
            {styleOptions.length ? (
              <div className="flex justify-between border-b border-black/5 pb-3">
                <span className="text-black/55">نوع الرسمة</span>
                <span className="font-medium">{styleOptions.find((item) => item.id === form.styleId)?.label || "—"}</span>
              </div>
            ) : null}
            <div className="flex justify-between border-b border-black/5 pb-3">
              <span className="text-black/55">الوقت</span>
              <span className="font-medium">{form.time ? DISPLAY_TIME_SLOTS[form.time] || form.time : "—"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-black/55">المتبقي في الاستوديو</span>
              <span className="font-medium">{totals.remaining} SAR</span>
            </div>
          </div>

          <div className="mt-8 rounded-3xl bg-ink px-5 py-5 text-white">
            <p className="text-sm text-white/75">العربون أصبح 50% من إجمالي الخدمة المختارة، ويُضاف نصف مبلغ الخدمة عند اختيار رموش سفلية و 120 ريال عند طلب إزالة قديمة.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
