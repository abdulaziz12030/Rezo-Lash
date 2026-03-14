"use client";

import { useMemo, useState } from "react";
import { SERVICES, DEFAULT_TIME_SLOTS, getServiceById, getServiceLabel, isArchivedStatus } from "@/lib/booking";

function normalizeDate(value) {
  return value || "";
}

export default function AdminTable({ bookings }) {
  const [items, setItems] = useState(bookings || []);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("active");
  const [savingId, setSavingId] = useState("");

  const historyByPhone = useMemo(() => {
    const map = new Map();
    for (const item of items) {
      const key = item.phone || item.full_name;
      map.set(key, (map.get(key) || 0) + 1);
    }
    return map;
  }, [items]);

  const filtered = useMemo(() => {
    return items.filter((booking) => {
      const archived = isArchivedStatus(booking.status);
      if (filter === "active" && archived) return false;
      if (filter === "archive" && !archived) return false;

      const haystack = [
        booking.full_name,
        booking.phone,
        booking.service_name,
        booking.booking_date,
        booking.booking_time,
        booking.status
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(query.toLowerCase());
    });
  }, [items, query, filter]);

  async function updateBooking(id, patch) {
    setSavingId(id);
    try {
      const response = await fetch(`/api/admin-bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Update failed");
      setItems((prev) => prev.map((item) => (item.id === id ? data.booking : item)));
    } catch (error) {
      alert(error.message);
    } finally {
      setSavingId("");
    }
  }

  return (
    <div className="space-y-6">
      <div className="card-luxe p-4 md:p-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <input
            className="input-luxe md:max-w-sm"
            placeholder="بحث بالاسم أو الجوال"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          <div className="flex gap-2">
            <button
              className={filter === "active" ? "btn-primary" : "btn-gold"}
              onClick={() => setFilter("active")}
              type="button"
            >
              الحجوزات الحالية
            </button>
            <button
              className={filter === "archive" ? "btn-primary" : "btn-gold"}
              onClick={() => setFilter("archive")}
              type="button"
            >
              الأرشيف
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {filtered.map((booking) => (
          <div key={booking.id} className="card-luxe p-5">
            <div className="grid gap-4 lg:grid-cols-[1fr_1.15fr]">
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-semibold">{booking.full_name}</h3>
                    <p className="text-sm text-black/55">{booking.phone}</p>
                    <p className="mt-1 text-xs text-black/45">
                      سجل العميل: {historyByPhone.get(booking.phone || booking.full_name) || 1} حجز
                    </p>
                  </div>
                  <span className="badge">{booking.status}</span>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2 text-sm">
                  <Info label="الخدمة" value={booking.service_name} />
                  <Info label="الموعد" value={`${booking.booking_date} — ${booking.booking_time}`} />
                  <Info label="السعر" value={`${booking.service_price || 0} SAR`} />
                  <Info label="العربون" value={`${booking.deposit_amount || 0} SAR`} />
                </div>
              </div>

              <form
                className="grid gap-3 sm:grid-cols-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  updateBooking(booking.id, {
                    serviceId: formData.get("serviceId"),
                    booking_date: formData.get("booking_date"),
                    booking_time: formData.get("booking_time"),
                    service_price: Number(formData.get("service_price")),
                    deposit_amount: Number(formData.get("deposit_amount")),
                    status: formData.get("status")
                  });
                }}
              >
                <label className="text-sm">
                  <span className="mb-2 block">الخدمة</span>
                  <select name="serviceId" defaultValue={booking.service_id} className="input-luxe">
                    {SERVICES.map((service) => (
                      <option key={service.id} value={service.id}>
                        {getServiceLabel(service)}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="text-sm">
                  <span className="mb-2 block">التاريخ</span>
                  <input
                    type="date"
                    name="booking_date"
                    defaultValue={normalizeDate(booking.booking_date)}
                    className="input-luxe"
                  />
                </label>

                <label className="text-sm">
                  <span className="mb-2 block">الوقت</span>
                  <select name="booking_time" defaultValue={booking.booking_time} className="input-luxe">
                    {DEFAULT_TIME_SLOTS.map((slot) => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                </label>

                <label className="text-sm">
                  <span className="mb-2 block">الحالة</span>
                  <select name="status" defaultValue={booking.status} className="input-luxe">
                    <option value="pending">pending</option>
                    <option value="confirmed">confirmed</option>
                    <option value="completed">completed</option>
                    <option value="cancelled">cancelled</option>
                    <option value="archived">archived</option>
                  </select>
                </label>

                <label className="text-sm">
                  <span className="mb-2 block">السعر</span>
                  <input type="number" name="service_price" defaultValue={booking.service_price || 0} className="input-luxe" />
                </label>

                <label className="text-sm">
                  <span className="mb-2 block">العربون</span>
                  <input type="number" name="deposit_amount" defaultValue={booking.deposit_amount || 0} className="input-luxe" />
                </label>

                <div className="sm:col-span-2 flex flex-wrap gap-2">
                  <button type="submit" className="btn-primary" disabled={savingId === booking.id}>
                    {savingId === booking.id ? "جارٍ الحفظ..." : "حفظ التعديل"}
                  </button>
                  {!isArchivedStatus(booking.status) ? (
                    <button
                      type="button"
                      className="btn-gold"
                      onClick={() => updateBooking(booking.id, { status: "archived" })}
                    >
                      نقل إلى الأرشيف
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="btn-gold"
                      onClick={() => updateBooking(booking.id, { status: "confirmed" })}
                    >
                      استعادة الحجز
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        ))}

        {filtered.length === 0 ? (
          <div className="card-luxe p-8 text-center text-black/55">لا توجد نتائج مطابقة.</div>
        ) : null}
      </div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="rounded-2xl border border-black/5 bg-black/[0.02] px-4 py-3">
      <p className="text-xs text-black/45">{label}</p>
      <p className="mt-1 font-medium">{value}</p>
    </div>
  );
}
