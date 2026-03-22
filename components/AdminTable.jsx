"use client";

import { useMemo, useState } from "react";
import {
  SERVICES,
  DEFAULT_TIME_SLOTS,
  getServiceLabel,
  isArchivedStatus,
  buildCustomerWhatsAppUrl,
  getDisplayTime,
} from "@/lib/booking";

function normalizeDate(value) { return value || ""; }
function isRecent(createdAt) {
  if (!createdAt) return false;
  return Date.now() - new Date(createdAt).getTime() < 1000 * 60 * 60 * 18;
}
function getStatusLabel(status) {
  const labels = {
    pending: "تحت الإجراء",
    confirmed: "مؤكد",
    completed: "مكتمل",
    cancelled: "ملغي",
    archived: "أرشيف",
  };
  return labels[status] || status || "-";
}
function getStatusTone(status) {
  if (status === "confirmed") return "status-confirmed";
  if (status === "pending") return "status-pending";
  if (status === "completed") return "status-completed";
  if (status === "cancelled") return "status-cancelled";
  return "status-archived";
}

export default function AdminTable({ bookings }) {
  const [items, setItems] = useState(bookings || []);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("active");
  const [savingId, setSavingId] = useState("");

  const historyByPhone = useMemo(() => {
    const map = new Map();
    for (const item of items) {
      const key = item.phone || item.name;
      map.set(key, (map.get(key) || 0) + 1);
    }
    return map;
  }, [items]);

  const stats = useMemo(() => ({
    total: items.length,
    pending: items.filter((b) => b.status === "pending").length,
    confirmed: items.filter((b) => b.status === "confirmed").length,
    today: items.filter((b) => b.date === new Date().toISOString().split("T")[0]).length,
  }), [items]);

  const filtered = useMemo(() => {
    return items.filter((booking) => {
      const archived = isArchivedStatus(booking.status);
      if (filter === "active" && archived) return false;
      if (filter === "archive" && !archived) return false;

      const haystack = [booking.name, booking.phone, booking.service, booking.date, booking.time, booking.status]
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
        body: JSON.stringify(patch),
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
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="كل الحجوزات" value={stats.total} />
        <StatCard label="تحت الإجراء" value={stats.pending} className="border-amber-200 bg-amber-50" valueClassName="text-amber-700" labelClassName="text-amber-700" />
        <StatCard label="المؤكدة" value={stats.confirmed} className="border-emerald-200 bg-emerald-50" valueClassName="text-emerald-700" labelClassName="text-emerald-700" />
        <StatCard label="حجوزات اليوم" value={stats.today} className="border-sky-200 bg-sky-50" valueClassName="text-sky-700" labelClassName="text-sky-700" />
      </div>

      <div className="card-luxe p-4 md:p-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <input className="input-luxe md:max-w-sm" placeholder="بحث بالاسم أو الجوال" value={query} onChange={(e) => setQuery(e.target.value)} />
          <div className="flex flex-wrap gap-2">
            <button className={filter === "active" ? "btn-primary" : "btn-gold"} onClick={() => setFilter("active")} type="button">الحجوزات الحالية</button>
            <button className={filter === "archive" ? "btn-primary" : "btn-gold"} onClick={() => setFilter("archive")} type="button">الأرشيف</button>
          </div>
        </div>
      </div>

      {items.some((b) => b.status === "pending" && isRecent(b.created_at)) ? (
        <div className="card-luxe border border-amber-200 bg-amber-50 p-5">
          <p className="text-sm uppercase tracking-[0.25em] text-amber-700">تنبيهات</p>
          <div className="mt-4 space-y-3">
            {items.filter((b) => b.status === "pending" && isRecent(b.created_at)).slice(0, 5).map((b) => (
              <div key={b.id} className="rounded-2xl border border-amber-200 bg-white px-4 py-3 text-sm shadow-sm">
                <strong className="text-amber-900">طلب جديد يحتاج متابعة</strong>
                <p className="mt-1 text-amber-800">{b.name} — {b.service} — {b.date} — {getDisplayTime(b.time)}</p>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <div className="space-y-4">
        {filtered.map((booking) => (
          <div key={booking.id} className={`card-luxe border p-5 ${getStatusTone(booking.status)}`}>
            <div className="grid gap-4 lg:grid-cols-[1fr_1.15fr]">
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-xl font-semibold">{booking.name}</h3>
                      {booking.status === "pending" && isRecent(booking.created_at) ? <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-900">جديد</span> : null}
                    </div>
                    <p className="text-sm text-black/55">{booking.phone}</p>
                    <p className="mt-1 text-xs text-black/45">سجل العميل: {historyByPhone.get(booking.phone || booking.name) || 1} حجز</p>
                  </div>
                  <span className={`status-badge ${getStatusTone(booking.status)}`}>{getStatusLabel(booking.status)}</span>
                </div>

                <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                  <Info label="الخدمة" value={booking.service} />
                  <Info label="الموعد" value={`${booking.date} — ${getDisplayTime(booking.time)}`} />
                  <Info label="السعر" value={`${booking.price || 0} SAR`} />
                  <Info label="العربون" value={`${booking.deposit || 0} SAR`} />
                  <Info label="الرسمة" value={booking.style || "—"} />
                  <Info label="الإزالة / السفلي" value={`${booking.lash_removal ? "إزالة قديمة" : "لا"} / ${booking.lower_lashes ? "نعم" : "لا"}`} />
                </div>
              </div>

              <form className="grid gap-3 sm:grid-cols-2" onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                updateBooking(booking.id, {
                  serviceId: formData.get("serviceId"),
                  date: formData.get("date"),
                  time: formData.get("time"),
                  price: Number(formData.get("price")),
                  deposit: Number(formData.get("deposit")),
                  status: formData.get("status"),
                });
              }}>
                <label className="text-sm"><span className="mb-2 block">الخدمة</span><select name="serviceId" defaultValue={SERVICES.find((s) => getServiceLabel(s) === booking.service)?.id || SERVICES[0].id} className="input-luxe">{SERVICES.map((service) => <option key={service.id} value={service.id}>{getServiceLabel(service)}</option>)}</select></label>
                <label className="text-sm"><span className="mb-2 block">التاريخ</span><input type="date" name="date" defaultValue={normalizeDate(booking.date)} className="input-luxe" /></label>
                <label className="text-sm"><span className="mb-2 block">الوقت</span><select name="time" defaultValue={booking.time} className="input-luxe">{DEFAULT_TIME_SLOTS.map((slot) => <option key={slot} value={slot}>{getDisplayTime(slot)}</option>)}</select></label>
                <label className="text-sm"><span className="mb-2 block">الحالة</span><select name="status" defaultValue={booking.status} className="input-luxe"><option value="pending">تحت الإجراء</option><option value="confirmed">مؤكد</option><option value="completed">مكتمل</option><option value="cancelled">ملغي</option><option value="archived">أرشيف</option></select></label>
                <label className="text-sm"><span className="mb-2 block">السعر</span><input type="number" name="price" defaultValue={booking.price || 0} className="input-luxe" /></label>
                <label className="text-sm"><span className="mb-2 block">العربون</span><input type="number" name="deposit" defaultValue={booking.deposit || 0} className="input-luxe" /></label>
                <div className="flex flex-wrap gap-2 sm:col-span-2">
                  <button type="submit" className="btn-primary" disabled={savingId === booking.id}>{savingId === booking.id ? "جارٍ الحفظ..." : "حفظ التعديل"}</button>
                  {!isArchivedStatus(booking.status)
                    ? <button type="button" className="btn-gold" onClick={() => updateBooking(booking.id, { status: "archived" })}>نقل إلى الأرشيف</button>
                    : <button type="button" className="btn-gold" onClick={() => updateBooking(booking.id, { status: "confirmed" })}>استعادة الحجز</button>}
                  <a href={buildCustomerWhatsAppUrl(booking.phone, { name: booking.name, serviceLabel: booking.service, date: booking.date, time: getDisplayTime(booking.time), depositAmount: booking.deposit })} target="_blank" rel="noreferrer" className="btn-gold">واتساب العميلة</a>
                </div>
              </form>
            </div>
          </div>
        ))}

        {filtered.length === 0 ? <div className="card-luxe p-8 text-center text-black/55">لا توجد نتائج مطابقة.</div> : null}
      </div>
    </div>
  );
}

function Info({ label, value }) {
  return <div className="rounded-2xl border border-black/5 bg-black/[0.02] px-4 py-3"><p className="text-xs text-black/45">{label}</p><p className="mt-1 font-medium">{value}</p></div>;
}

function StatCard({ label, value, className = "", labelClassName = "", valueClassName = "" }) {
  return (
    <div className={`card-luxe border p-5 ${className}`}>
      <p className={`text-sm text-black/45 ${labelClassName}`}>{label}</p>
      <strong className={`mt-2 block text-3xl ${valueClassName}`}>{value}</strong>
    </div>
  );
}
