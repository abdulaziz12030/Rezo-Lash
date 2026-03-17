"use client";

import { useEffect, useMemo, useState } from "react";
import {
  DEFAULT_TIME_SLOTS,
  DISPLAY_TIME_SLOTS,
  REMOVAL_OPTIONS,
  SERVICES,
  calculateBookingTotals,
  getServiceById,
  getServiceLabel,
  getStyleOptions,
} from "@/lib/booking";

const POLICY_NOTICE =
  "لا يحق للعميلة المطالبة بالعربون في حال تم إلغاء الموعد أو التأخر أكثر من 20 دقيقة، كما يمكن للعميلة إعادة جدولة الموعد قبل 24 ساعة وبحسب المواعيد المتاحة.";

export default function BookingForm() {
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    date: "",
    serviceId: SERVICES[0].id,
    styleId: getStyleOptions(SERVICES[0].id)[0]?.id || "",
    removalOption: REMOVAL_OPTIONS[0].id,
    lowerLashes: false,
    time: "",
  });

  const [timeSlots, setTimeSlots] = useState(DEFAULT_TIME_SLOTS);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [pastSlots, setPastSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [warning, setWarning] = useState("");
  const [slotMessage, setSlotMessage] = useState("");

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
    if (!slotMessage) return;
    const timeout = setTimeout(() => setSlotMessage(""), 2200);
    return () => clearTimeout(timeout);
  }, [slotMessage]);

  useEffect(() => {
    async function loadAvailability() {
      if (!form.date) {
        setBookedSlots([]);
        setPastSlots([]);
        setTimeSlots(DEFAULT_TIME_SLOTS);
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
          throw new Error(data.details || data.error || "Failed to load availability");
        }

        const slotsFromApi = (data.slots || []).map((slot) => slot.value);
        setBookedSlots((data.slots || []).filter((slot) => slot.booked).map((slot) => slot.value));
        setPastSlots((data.slots || []).filter((slot) => slot.inPast).map((slot) => slot.value));
        setTimeSlots(slotsFromApi.length ? slotsFromApi : (data.timeSlots || DEFAULT_TIME_SLOTS));
        setWarning(data.warning || "");
        setForm((prev) => ({
          ...prev,
          time: (data.slots || []).some((slot) => slot.value === prev.time && !slot.available) ? "" : prev.time,
        }));
      } catch (err) {
        setTimeSlots(DEFAULT_TIME_SLOTS);
        setBookedSlots([]);
        setPastSlots([]);
        setWarning("تعذر قراءة المواعيد من قاعدة البيانات مؤقتًا.");
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
        return {
          ...prev,
          serviceId: value,
          styleId: nextStyles[0]?.id || "",
          removalOption: REMOVAL_OPTIONS[0].id,
          lowerLashes: false,
        };
      }
      if (type === "checkbox") return { ...prev, [name]: checked };
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
                    const booked = bookedSlots.includes(slot);
                    const inPast = pastSlots.includes(slot);
                    const disabled = booked || inPast;
                    const active = form.time === slot && !disabled;

                    return (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => {
                          if (booked) return setSlotMessage("هذا الموعد محجوز");
                          if (inPast) return setSlotMessage("هذا الوقت انتهى لليوم");
                          setForm((prev) => ({ ...prev, time: slot }));
                        }}
                        className={`slot-btn ${disabled ? "slot-btn-booked" : active ? "slot-btn-active" : "slot-btn-available"}`}
                      >
                        <span>{DISPLAY_TIME_SLOTS[slot] || slot}</span>
                      </button>
                    );
                  })}
                </div>
              )}
              {slotMessage ? <p className="mt-3 text-sm text-rose-600">{slotMessage}</p> : null}
              {warning ? <p className="mt-3 text-sm text-amber-700">{warning}</p> : null}
            </div>

            <div className="rounded-3xl border border-black/5 bg-black/[0.02] p-4 text-sm text-black/65">
              {POLICY_NOTICE}
            </div>

            {error ? <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p> : null}

            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? "جارٍ إرسال الطلب..." : "إرسال طلب الحجز"}
            </button>
          </form>
        </div>

        <div className="card-luxe p-6 md:p-8">
          <p className="text-sm uppercase tracking-[0.25em] text-black/45">Summary</p>
          <h3 className="section-title mt-2 text-2xl">ملخص الحجز</h3>

          <div className="mt-6 space-y-4 text-sm">
            <div className="flex justify-between border-b border-black/5 pb-3"><span className="text-black/55">الخدمة الأساسية</span><span className="font-medium">{selectedService?.price || 0} SAR</span></div>
            {selectedService?.supportsRemoval ? <div className="flex justify-between border-b border-black/5 pb-3"><span className="text-black/55">الإزالة</span><span className="font-medium">{totals.removalPrice} SAR</span></div> : null}
            {selectedService?.supportsLowerLashes ? <div className="flex justify-between border-b border-black/5 pb-3"><span className="text-black/55">الرموش السفلية</span><span className="font-medium">{totals.lowerLashesPrice} SAR</span></div> : null}
            <div className="flex justify-between border-b border-black/5 pb-3"><span className="text-black/55">إجمالي المبلغ</span><span className="font-medium">{totals.totalPrice} SAR</span></div>
            <div className="flex justify-between border-b border-black/5 pb-3"><span className="text-black/55">العربون المقترح</span><span className="font-medium">{totals.depositAmount} SAR</span></div>
            <div className="flex justify-between border-b border-black/5 pb-3"><span className="text-black/55">المدة الإجمالية</span><span className="font-medium">{totals.totalDuration} min</span></div>
            <div className="flex justify-between border-b border-black/5 pb-3"><span className="text-black/55">نوع الرسمة</span><span className="font-medium">{selectedStyle ? `${selectedStyle.label} — ${selectedStyle.description}` : "—"}</span></div>
            <div className="flex justify-between border-b border-black/5 pb-3"><span className="text-black/55">الوقت</span><span className="font-medium">{form.time ? DISPLAY_TIME_SLOTS[form.time] || form.time : "—"}</span></div>
            <div className="flex justify-between"><span className="text-black/55">المتبقي بعد العربون</span><span className="font-medium">{totals.remainingAmount} SAR</span></div>
          </div>

          <div className="mt-8 rounded-3xl bg-ink px-5 py-5 text-white">
            <p className="text-sm text-white/75">بعد إرسال الطلب سيتم حفظ الحجز في النظام مباشرة، ويمكن للإدارة مراجعته وتأكيده أو تحديثه من لوحة التحكم.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
