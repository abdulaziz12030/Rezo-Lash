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

function isRecent(createdAt) {
  if (!createdAt) return false;
  return Date.now() - new Date(createdAt).getTime() < 1000 * 60 * 60 * 18;
}

function formatCurrency(value) {
  return `${Number(value || 0).toLocaleString("ar-SA")} ر.س`;
}

function getServiceIdFromBooking(booking) {
  if (booking.service_id) return booking.service_id;
  const found = SERVICES.find(
    (service) =>
      service.nameAr === booking.service || service.name === booking.service
  );
  return found?.id || "";
}

function StatusBadge({ status }) {
  const safeStatus = status || "pending";
  return (
    <span
      className={`inline-flex min-w-[95px] items-center justify-center rounded-full border px-3 py-1 text-xs font-extrabold ${
        STATUS_STYLES[safeStatus] || STATUS_STYLES.pending
      }`}
    >
      {STATUS_LABELS[safeStatus] || "تحت الإجراء"}
    </span>
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
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];

    const result = items.filter((booking) => {
      const text = [
        booking.name,
        booking.phone,
        booking.service,
        booking.style,
        booking.notes,
        booking.date,
        booking.time,
      ]
        .join(" ")
        .toLowerCase();

      if (query && !text.includes(query.trim().toLowerCase())) return false;
      if (statusFilter !== "all" && (booking.status || "pending") !== statusFilter)
        return false;
      if (serviceFilter !== "all" && getServiceIdFromBooking(booking) !== serviceFilter)
        return false;
      if (dateFilter === "today" && booking.date !== today) return false;
      if (dateFilter === "tomorrow" && booking.date !== tomorrow) return false;
      if (dateFilter === "new" && !isRecent(booking.created_at)) return false;

      return true;
    });

    return [...result].sort((a, b) => {
      if (sortBy === "oldest") {
        return new Date(a.created_at || a.date || 0) - new Date(b.created_at || b.date || 0);
      }

      if (sortBy === "date") {
        return (
          String(a.date || "").localeCompare(String(b.date || "")) ||
          String(a.time || "").localeCompare(String(b.time || ""))
        );
      }

      if (sortBy === "status") {
        return String(a.status || "pending").localeCompare(String(b.status || "pending"));
      }

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

      if (!res.ok) {
        throw new Error(data.error || "تعذر تحديث البيانات");
      }

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

      if (!response.ok) {
        throw new Error(data.error || "تعذر حفظ التعديل");
      }

      setItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, ...data.booking } : item))
      );

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
      <div className="rounded-3xl bg-white p-4 shadow-luxe">
        <div className="grid gap-3 xl:grid-cols-[1.4fr_1fr_1fr_1fr_1fr_auto_auto]">
          <input
            className="input-luxe"
            placeholder="بحث باسم العميلة أو الجوال"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          <select
            className="input-luxe"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">كل الحالات</option>
            <option value="pending">تحت الإجراء</option>
            <option value="confirmed">مؤكد</option>
            <option value="completed">مكتمل</option>
            <option value="cancelled">ملغي</option>
            <option value="archived">مؤرشف</option>
          </select>

          <select
            className="input-luxe"
            value={serviceFilter}
            onChange={(e) => setServiceFilter(e.target.value)}
          >
            <option value="all">كل الخدمات</option>
            {SERVICES.map((service) => (
              <option key={service.id} value={service.id}>
                {service.nameAr}
              </option>
            ))}
          </select>

          <select
            className="input-luxe"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          >
            <option value="all">كل المواعيد</option>
            <option value="today">اليوم</option>
            <option value="tomorrow">غدًا</option>
            <option value="new">الجديدة</option>
          </select>

          <select
            className="input-luxe"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">الأحدث</option>
            <option value="oldest">الأقدم</option>
            <option value="date">تاريخ الموعد</option>
            <option value="status">الحالة</option>
          </select>

          <button
            className="btn-primary whitespace-nowrap"
            type="button"
            onClick={() => refreshBookings()}
            disabled={refreshing}
          >
            {refreshing ? "تحديث..." : "تحديث"}
          </button>

          <button className="btn-gold whitespace-nowrap" type="button" onClick={resetFilters}>
            إعادة ضبط
          </button>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard label="كل الطلبات" value={stats.total} />
        <StatCard label="تحت الإجراء" value={stats.pending} tone="amber" />
        <StatCard label="مؤكد" value={stats.confirmed} tone="green" />
        <StatCard label="ملغي" value={stats.cancelled} tone="red" />
        <StatCard label="اليوم" value={stats.today} />
      </div>

      <div className="mt-5 rounded-3xl border border-black/5 bg-white shadow-luxe">
        <div className="flex items-center justify-between gap-3 border-b border-black/5 px-5 py-4">
          <div>
            <h3 className="text-xl font-extrabold">جميع الحجوزات</h3>
            <p className="mt-1 text-sm text-black/50">
              {filtered.length} طلب مطابق للفرز الحالي
            </p>
          </div>

          <div className="rounded-2xl bg-black/[0.03] px-4 py-2 text-sm font-bold text-black/60">
            Dashboard
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="admin-orders-table">
            <thead>
              <tr>
                <th>#</th>
                <th>العميلة</th>
                <th>الخدمة</th>
                <th>التاريخ</th>
                <th>الوقت</th>
                <th>المبلغ</th>
                <th>العربون</th>
                <th>الدفع</th>
                <th>الحالة</th>
                <th className="text-center">الإجراء</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((booking, index) => {
                const whatsappUrl = buildCustomerWhatsAppUrl(booking.phone || "", {
                  name: booking.name,
                  serviceLabel: booking.service,
                  date: booking.date,
                  time: getDisplayTime(booking.time),
                  depositAmount: booking.deposit,
                });

                return (
                  <tr key={booking.id} className="transition hover:bg-[#fffaf3]">
                    <td className="font-bold text-black/60">{index + 1}</td>

                    <td>
                      <div className="font-extrabold text-black">{booking.name || "-"}</div>
                      <div className="mt-1 text-xs text-black/45" dir="ltr">
                        {booking.phone || "-"}
                      </div>
                      {booking.status === "pending" && isRecent(booking.created_at) ? (
                        <div className="mt-2 inline-flex rounded-full bg-amber-100 px-2 py-1 text-[11px] font-bold text-amber-900">
                          جديد
                        </div>
                      ) : null}
                    </td>

                    <td>
                      <div className="font-bold text-black/80">{booking.service || "-"}</div>
                      <div className="mt-1 text-xs text-black/45">
                        {booking.style || "بدون تحديد"}
                      </div>
                    </td>

                    <td className="font-bold text-black/75">{booking.date || "-"}</td>

                    <td className="font-bold text-black/75">
                      {getDisplayTime(booking.time)}
                    </td>

                    <td className="font-bold text-black/75">
                      {formatCurrency(booking.price)}
                    </td>

                    <td className="text-black/65">{formatCurrency(booking.deposit)}</td>

                    <td>
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                          ["paid", "deposit_paid"].includes(booking.payment_status)
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {booking.payment_status === "paid"
                          ? "مدفوع"
                          : booking.payment_status === "deposit_paid"
                            ? "عربون"
                            : "غير مدفوع"}
                      </span>
                    </td>

                    <td>
                      <StatusBadge status={booking.status || "pending"} />
                    </td>

                    <td>
                      <div className="flex flex-wrap justify-center gap-2">
                        <button
                          className="action-pill bg-emerald-100 text-emerald-800"
                          disabled={savingId === booking.id}
                          onClick={() => updateBooking(booking.id, { status: "confirmed" })}
                          title="تأكيد"
                        >
                          مؤكد
                        </button>

                        <button
                          className="action-pill bg-amber-100 text-amber-900"
                          disabled={savingId === booking.id}
                          onClick={() => updateBooking(booking.id, { status: "pending" })}
                          title="تحت الإجراء"
                        >
                          إجراء
                        </button>

                        <button
                          className="action-pill bg-red-100 text-red-800"
                          disabled={savingId === booking.id}
                          onClick={() => updateBooking(booking.id, { status: "cancelled" })}
                          title="إلغاء"
                        >
                          ملغي
                        </button>

                        <a
                          className="action-pill bg-[#25D366]/15 text-[#128C3A]"
                          href={whatsappUrl}
                          target="_blank"
                          rel="noreferrer"
                        >
                          واتساب
                        </a>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filtered.length === 0 ? (
            <div className="p-10 text-center text-black/50">
              لا توجد طلبات مطابقة للفرز الحالي.
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
