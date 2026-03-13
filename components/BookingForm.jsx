"use client";

import { useEffect, useMemo, useState } from "react";
import { SERVICES, getServiceById } from "@/lib/booking";

export default function BookingForm() {
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    date: "",
    serviceId: SERVICES[0].id,
    time: ""
  });

  const [timeSlots, setTimeSlots] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const selectedService = useMemo(
    () => getServiceById(form.serviceId),
    [form.serviceId]
  );

  useEffect(() => {
    async function loadAvailability() {
      if (!form.date) {
        setBookedSlots([]);
        setTimeSlots([]);
        return;
      }

      setLoadingSlots(true);
      setError("");

      try {
        const response = await fetch(`/api/availability?date=${form.date}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to load availability");
        }

        setBookedSlots(data.bookedSlots || []);
        setTimeSlots(data.timeSlots || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingSlots(false);
      }
    }

    loadAvailability();
  }, [form.date]);

  function onChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function submitBooking(event) {
    event.preventDefault();
    setError("");

    if (!form.fullName || !form.phone || !form.date || !form.time || !form.serviceId) {
      setError("Please complete all fields.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Booking failed");
      }

      window.location.href = data.url;
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section id="booking" className="container-luxe py-14">
      <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="card-luxe p-6 md:p-8">
          <p className="text-sm uppercase tracking-[0.25em] text-black/45">
            Booking
          </p>
          <h2 className="section-title mt-2">احجزي موعدك</h2>

          <form className="mt-8 grid gap-5" onSubmit={submitBooking}>
            <div>
              <label className="mb-2 block text-sm font-medium">الاسم الكامل</label>
              <input
                name="fullName"
                className="input-luxe"
                value={form.fullName}
                onChange={onChange}
                placeholder="مثال: Reem Ahmed"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">رقم الجوال</label>
              <input
                name="phone"
                className="input-luxe"
                value={form.phone}
                onChange={onChange}
                placeholder="05xxxxxxxx"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">الخدمة</label>
              <select
                name="serviceId"
                className="input-luxe"
                value={form.serviceId}
                onChange={onChange}
              >
                {SERVICES.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.arabicName} | {service.name} — {service.price} SAR
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">التاريخ</label>
              <input
                type="date"
                name="date"
                className="input-luxe"
                value={form.date}
                onChange={onChange}
              />
            </div>

            <div>
              <label className="mb-3 block text-sm font-medium">الوقت المتاح</label>

              {loadingSlots ? (
                <p className="text-sm text-black/60">Loading slots...</p>
              ) : (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {timeSlots.map((slot) => {
                    const disabled = bookedSlots.includes(slot);

                    return (
                      <label
                        key={slot}
                        className={`cursor-pointer rounded-2xl border px-4 py-3 text-center transition ${
                          disabled
                            ? "cursor-not-allowed border-black/10 bg-black/5 text-black/30"
                            : form.time === slot
                            ? "border-gold bg-gold/20"
                            : "border-black/10 bg-white hover:border-gold/60"
                        }`}
                      >
                        <input
                          type="radio"
                          name="time"
                          value={slot}
                          checked={form.time === slot}
                          onChange={onChange}
                          disabled={disabled}
                          className="hidden"
                        />
                        {slot}
                      </label>
                    );
                  })}
                </div>
              )}
            </div>

            {error ? (
              <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            ) : null}

            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting
                ? "Redirecting..."
                : `ادفعي عربون ${selectedService?.deposit || 0} ريال`}
            </button>
          </form>
        </div>

        <div className="card-luxe p-6 md:p-8">
          <p className="text-sm uppercase tracking-[0.25em] text-black/45">
            Summary
          </p>
          <h3 className="mt-2 text-2xl font-semibold">
            {selectedService?.arabicName || "الخدمة المختارة"}
          </h3>

          <div className="mt-6 space-y-4 text-sm">
            <div className="flex justify-between border-b border-black/5 pb-3">
              <span className="text-black/55">السعر الكامل</span>
              <span className="font-medium">{selectedService?.price || 0} SAR</span>
            </div>
            <div className="flex justify-between border-b border-black/5 pb-3">
              <span className="text-black/55">العربون</span>
              <span className="font-medium">{selectedService?.deposit || 0} SAR</span>
            </div>
            <div className="flex justify-between border-b border-black/5 pb-3">
              <span className="text-black/55">المدة</span>
              <span className="font-medium">{selectedService?.duration || 0} دقيقة</span>
            </div>
            <div className="flex justify-between">
              <span className="text-black/55">المتبقي في الاستوديو</span>
              <span className="font-medium">
                {(selectedService?.price || 0) - (selectedService?.deposit || 0)} SAR
              </span>
            </div>
          </div>

          <div className="mt-8 rounded-3xl bg-ink px-5 py-5 text-white">
            <p className="text-sm text-white/75">
              بعد نجاح الدفع سيتم تأكيد الموعد تلقائيًا في لوحة الإدارة.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
