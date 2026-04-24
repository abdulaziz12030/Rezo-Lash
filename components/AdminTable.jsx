"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  SERVICES,
  buildCustomerWhatsAppUrl,
  getDisplayTime,
} from "@/lib/booking";

const STATUS_LABELS = {
  pending: "تحت الإجراء",
  confirmed: "مؤكد",
  completed: "مكتمل",
  cancelled: "ملغي",
  archived: "مؤرشف",
};

const STATUS_STYLES = {
  pending: "bg-amber-100 text-amber-900 border-amber-200",
  confirmed: "bg-emerald-100 text-emerald-800 border-emerald-200",
  completed: "bg-blue-100 text-blue-800 border-blue-200",
  cancelled: "bg-red-100 text-red-800 border-red-200",
  archived: "bg-zinc-100 text-zinc-700 border-zinc-200",
};

const PAYMENT_LABELS = {
  unpaid: "غير مدفوع",
  paid: "مدفوع",
  deposit_paid: "عربون مدفوع",
  refunded: "مسترد",
};

function isRecent(createdAt) {
  if (!createdAt) return false;
  return Date.now() - new Date(createdAt).getTime() < 1000 * 60 * 60 * 18;
}

function formatCurrency(value) {
  return `${Number(value || 0).toLocaleString("ar-SA")} ر.س`;
}

function getServiceIdFromBooking(booking) {
  if (booking.service_id) return booking.service_id;
  const found = SERVICES.find((service) => service.nameAr === booking.service || service.name === booking.service);
  return found?.id || "";
}

function StatusBadge({ status }) {
  const className = STATUS_STYLES[status] || STATUS_STYLES.pending;
  return (
    <span className={`inline-flex min-w-[92px] items-center justify-center rounded-full border px-3 py-1 text-xs font-extrabold ${className}`}>
      {STATUS_LABELS[status] || status || "تحت الإجراء"}
    </span>
  );
}

function PaymentBadge({ paymentStatus }) {
  const paid = ["paid", "deposit_paid"].includes(paymentStatus);
  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${paid ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>
      {PAYMENT_LABELS[paymentStatus] || PAYMENT_LABELS.unpaid}
    </span>
  );
}

export default function AdminTable({ bookings }) {
  const [items, setItems] = useState(bookings || []);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [serviceFilter, setServiceFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [savingId, setSavingId] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const isFetchingRef = useRef(false);

  useEffect(() => {
    setItems(bookings || []);
  }, [bookings]);

  const stats = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    return {
      total: items.length,
      pending: items.filter((b) => (b.status || "pending") === "pending").length,
      confirmed: items.filter((b) => b.status === "confirmed").length,
      cancelled: items.filter((b) => b.status === "cancelled").length,
      today: items.filter((b) => b.date === today).length,
    };
  }, [items]);

  const filtered = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split("T")[0];

    const result = items.filter((booking) => {
      const text = [booking.name, booking.phone, booking.service, booking.style, booking.notes, booking.date, booking.time]
        .join(" ")
        .toLowerCase();

      if (query && !text.includes(query.trim().toLowerCase())) return false;
      if (statusFilter !== "all" && (booking.status || "pending") !== statusFilter) return false;
      if (serviceFilter !== "all" && getServiceIdFromBooking(booking) !== serviceFilter) return false;
      if (dateFilter === "today" && booking.date !== today) return false;
      if (dateFilter === "tomorrow" && booking.date !== tomorrow) return false;
      if (dateFilter === "new" && !isRecent(booking.created_at)) return false;
      return true;
    });

    return [...result].sort((a, b) => {
      if (sortBy === "oldest") return new Date(a.created_at || a.date || 0) - new Date(b.created_at || b.date || 0);
      if (sortBy === "date") return String(a.date || "").localeCompare(String(b.date || "")) || String(a.time || "").localeCompare(String(b.time || ""));
      if (sortBy === "status") return String(a.status || "pending").localeCompare(String(b.status || "pending"));
      return new Date(b.created_at || b.date || 0) - new Date(a.created_at || a.date || 0);
    });
  }, [items, query, statusFilter, serviceFilter, dateFilter, sortBy]);

  async function refreshBookings(silent = false) {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    if (!silent) setRefreshing(true);

    try {
      const res = await fetch("/api/admin-bookings", {
        cache: "no-store",
        headers: { "Cache-Control": "no-store" },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "تعذر تحديث البيانات");
      setItems(data.bookings || []);
    } catch (error) {
      if (!silent) alert(error.message);
    } finally {
      isFetchingRef.current = false;
      if (!silent) setRefreshing(false);
    }
  }

  async function updateBooking(id, patch) {
    setSavingId(id);
    try {
      const response = await fetch(`/api/admin-bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "تعذر حفظ التعديل");
      setItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...data.booking } : item)));
      refreshBookings(true);
    } catch (error) {
      alert(error.message);
    } finally {
      setSavingId("");
    }
  }

  useEffect(() => {
    refreshBookings(true);
    const interval = setInterval(() => refreshBookings(true), 15000);
    return () => clearInterval(interval);
  }, []);

  function resetFilters() {
    setQuery("");
    setStatusFilter("all");
    setServiceFilter("all");
    setDateFilter("all");
    setSortBy("newest");
  }

  return (
    <div className="admin-dashboard-layout">
      <aside className="admin-filter-panel">
        <div className="rounded-3xl bg-white p-4 shadow-luxe">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-black/40">Filters</p>
          <h3 className="mt-2 text-xl font-extrabold text-black">الفرز والاختيارات</h3>
          <p className="mt-1 text-sm leading-6 text-black/55">تحكم سريع بالحجوزات من يمين لوحة التحكم.</p>

          <div className="mt-5 space-y-3">
            <input className="input-luxe" placeholder="بحث باسم العميلة أو الجوال" value={query} onChange={(e) => setQuery(e.target.value)} />

            <select className="input-luxe" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="all">كل الحالات</option>
              <option value="pending">تحت الإجراء</option>
              <option value="confirmed">مؤكد</option>
              <option value="completed">مكتمل</option>
              <option value="cancelled">ملغي</option>
              <option value="archived">مؤرشف</option>
            </select>

            <select className="input-luxe" value={serviceFilter} onChange={(e) => setServiceFilter(e.target.value)}>
              <option value="all">كل الخدمات</option>
              {SERVICES.map((service) => (
                <option key={service.id} value={service.id}>{service.nameAr}</option>
              ))}
            </select>

            <select className="input-luxe" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)}>
              <option value="all">كل المواعيد</option>
              <option value="today">مواعيد اليوم</option>
              <option value="tomorrow">مواعيد الغد</option>
              <option value="new">الحجوزات الجديدة</option>
            </select>

            <select className="input-luxe" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="newest">الأحدث أولاً</option>
              <option value="oldest">الأقدم أولاً</option>
              <option value="date">حسب تاريخ الموعد</option>
              <option value="status">حسب الحالة</option>
            </select>

            <button className="btn-primary w-full" type="button" onClick={() => refreshBookings()} disabled={refreshing}>
              {refreshing ? "جارٍ التحديث..." : "تحديث البيانات"}
            </button>
            <button className="btn-gold w-full" type="button" onClick={resetFilters}>إعادة الضبط</button>
          </div>
        </div>
      </aside>

      <section className="min-w-0 space-y-5">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          <StatCard label="كل الطلبات" value={stats.total} />
          <StatCard label="تحت الإجراء" value={stats.pending} tone="amber" />
          <StatCard label="مؤكد" value={stats.confirmed} tone="green" />
          <StatCard label="ملغي" value={stats.cancelled} tone="red" />
          <StatCard label="اليوم" value={stats.today} />
        </div>

        <div className="rounded-3xl border border-black/5 bg-white shadow-luxe">
          <div className="flex items-center justify-between gap-3 border-b border-black/5 px-5 py-4">
            <div>
              <h3 className="text-xl font-extrabold">صفوف الطلبات</h3>
              <p className="mt-1 text-sm text-black/50">{filtered.length} طلب مطابق للفرز الحالي</p>
            </div>
            <div className="hidden rounded-2xl bg-black/[0.03] px-4 py-2 text-sm font-bold text-black/60 lg:block">مخصص للابتوب</div>
          </div>

          <div className="overflow-x-auto">
            <table className="admin-orders-table">
              <thead>
                <tr>
                  <th>العميلة</th>
                  <th>الخدمة</th>
                  <th>الموعد</th>
                  <th>السعر</th>
                  <th>الدفع</th>
                  <th>الحالة</th>
                  <th className="text-center">الإجراء</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((booking) => (
                  <DesktopRow key={booking.id} booking={booking} saving={savingId === booking.id} onUpdate={updateBooking} />
                ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-3 p-4 xl:hidden">
            {filtered.map((booking) => (
              <MobileCard key={booking.id} booking={booking} saving={savingId === booking.id} onUpdate={updateBooking} />
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="p-10 text-center text-black/50">لا توجد طلبات مطابقة للفرز الحالي.</div>
          ) : null}
        </div>
      </section>
    </div>
  );
}

function DesktopRow({ booking, saving, onUpdate }) {
  const phone = booking.phone || "";
  const whatsappUrl = buildCustomerWhatsAppUrl(phone, {
    name: booking.name,
    serviceLabel: booking.service,
    date: booking.date,
    time: getDisplayTime(booking.time),
    depositAmount: booking.deposit,
  });

  return (
    <tr className="transition hover:bg-[#fffaf3]">
      <td>
        <div className="font-extrabold text-black">{booking.name || "-"}</div>
        <div className="mt-1 text-xs text-black/45" dir="ltr">{phone || "-"}</div>
        {booking.status === "pending" && isRecent(booking.created_at) ? <div className="mt-2 inline-flex rounded-full bg-amber-100 px-2 py-1 text-[11px] font-bold text-amber-900">جديد</div> : null}
      </td>
      <td>
        <div className="font-bold text-black/80">{booking.service || "-"}</div>
        <div className="mt-1 text-xs text-black/45">{booking.style || "بدون تحديد"}</div>
      </td>
      <td>
        <div className="font-bold text-black/75">{booking.date || "-"}</div>
        <div className="mt-1 text-xs text-black/45">{getDisplayTime(booking.time)}</div>
      </td>
      <td>
        <div className="font-bold text-black/75">{formatCurrency(booking.price)}</div>
        <div className="mt-1 text-xs text-black/45">عربون {formatCurrency(booking.deposit)}</div>
      </td>
      <td><PaymentBadge paymentStatus={booking.payment_status || "unpaid"} /></td>
      <td><StatusBadge status={booking.status || "pending"} /></td>
      <td>
        <div className="flex flex-wrap justify-center gap-2">
          <button className="action-pill bg-emerald-100 text-emerald-800" disabled={saving} onClick={() => onUpdate(booking.id, { status: "confirmed" })}>مؤكد</button>
          <button className="action-pill bg-amber-100 text-amber-900" disabled={saving} onClick={() => onUpdate(booking.id, { status: "pending" })}>تحت الإجراء</button>
          <button className="action-pill bg-red-100 text-red-800" disabled={saving} onClick={() => onUpdate(booking.id, { status: "cancelled" })}>ملغي</button>
          <a className="action-pill bg-[#25D366]/15 text-[#128C3A]" href={whatsappUrl} target="_blank" rel="noreferrer">واتساب</a>
        </div>
      </td>
    </tr>
  );
}

function MobileCard({ booking, saving, onUpdate }) {
  return (
    <div className="rounded-3xl border border-black/5 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h4 className="text-lg font-extrabold">{booking.name || "-"}</h4>
          <p className="mt-1 text-sm text-black/50" dir="ltr">{booking.phone || "-"}</p>
        </div>
        <StatusBadge status={booking.status || "pending"} />
      </div>
      <div className="mt-4 grid gap-2 text-sm text-black/65">
        <div>الخدمة: <strong>{booking.service || "-"}</strong></div>
        <div>الموعد: <strong>{booking.date || "-"} — {getDisplayTime(booking.time)}</strong></div>
        <div>السعر: <strong>{formatCurrency(booking.price)}</strong></div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <button className="action-pill bg-emerald-100 text-emerald-800" disabled={saving} onClick={() => onUpdate(booking.id, { status: "confirmed" })}>مؤكد</button>
        <button className="action-pill bg-amber-100 text-amber-900" disabled={saving} onClick={() => onUpdate(booking.id, { status: "pending" })}>تحت الإجراء</button>
        <button className="action-pill bg-red-100 text-red-800" disabled={saving} onClick={() => onUpdate(booking.id, { status: "cancelled" })}>ملغي</button>
      </div>
    </div>
  );
}

function StatCard({ label, value, tone = "neutral" }) {
  const toneClass = {
    neutral: "bg-white text-black",
    amber: "bg-amber-50 text-amber-900",
    green: "bg-emerald-50 text-emerald-900",
    red: "bg-red-50 text-red-900",
  }[tone];

  return (
    <div className={`rounded-3xl border border-black/5 p-4 shadow-sm ${toneClass}`}>
      <p className="text-sm font-bold opacity-60">{label}</p>
      <p className="mt-2 text-3xl font-extrabold">{value}</p>
    </div>
  );
}
