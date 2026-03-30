"use client";

import { useEffect, useMemo, useState } from "react";
import AdminCalendar from "@/components/AdminCalendar";
import {
  SERVICES,
  DEFAULT_TIME_SLOTS,
  REMOVAL_OPTIONS,
  getServiceById,
  getServiceLabel,
  getStyleOptions,
  getStyleLabel,
  calculateBookingTotals,
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

function isRecent(createdAt) {
  if (!createdAt) return false;
  return Date.now() - new Date(createdAt).getTime() < 1000 * 60 * 60 * 18;
}

function formatDateInput(value) {
  return value || "";
}

function formatCurrency(value) {
  return `${Number(value || 0)} SAR`;
}

function getStatusClass(status) {
  switch (status) {
    case "confirmed":
      return "status-badge status-confirmed";
    case "completed":
      return "status-badge status-completed";
    case "cancelled":
      return "status-badge status-cancelled";
    case "archived":
      return "status-badge status-archived";
    default:
      return "status-badge status-pending";
  }
}

function getServiceIdFromBooking(booking) {
  if (booking.service_id) return booking.service_id;
  const found = SERVICES.find((s) => getServiceLabel(s) === booking.service);
  return found?.id || SERVICES[0]?.id || "classic";
}

function getInitialStyleId(serviceId, bookingStyle) {
  const options = getStyleOptions(serviceId);
  if (!options.length) return "";
  const matched = options.find((opt) => bookingStyle?.includes(opt.label));
  return matched?.id || options[0].id;
}

export default function AdminTable({ bookings }) {
  const [items, setItems] = useState(bookings || []);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [serviceFilter, setServiceFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [onlyNew, setOnlyNew] = useState(false);
  const [expandedId, setExpandedId] = useState("");
  const [savingId, setSavingId] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    setItems(bookings || []);
  }, [bookings]);

  const stats = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    return {
      total: items.length,
      pending: items.filter((b) => b.status === "pending").length,
      confirmed: items.filter((b) => b.status === "confirmed").length,
      cancelled: items.filter((b) => b.status === "cancelled").length,
      today: items.filter((b) => b.date === today).length,
      newOnes: items.filter((b) => b.status === "pending" && isRecent(b.created_at)).length,
    };
  }, [items]);

  const filtered = useMemo(() => {
    return items.filter((booking) => {
      const haystack = [
        booking.name,
        booking.phone,
        booking.service,
        booking.date,
        booking.time,
        booking.status,
        booking.style,
        booking.notes,
      ]
        .join(" ")
        .toLowerCase();

      if (query && !haystack.includes(query.toLowerCase())) return false;
      if (statusFilter !== "all" && booking.status !== statusFilter) return false;
      if (paymentFilter !== "all" && (booking.payment_status || "unpaid") !== paymentFilter) return false;

      const bookingServiceId = getServiceIdFromBooking(booking);
      if (serviceFilter !== "all" && bookingServiceId !== serviceFilter) return false;

      if (dateFrom && booking.date && booking.date < dateFrom) return false;
      if (dateTo && booking.date && booking.date > dateTo) return false;

      if (onlyNew && !(booking.status === "pending" && isRecent(booking.created_at))) return false;

      return true;
    });
  }, [items, query, statusFilter, paymentFilter, serviceFilter, dateFrom, dateTo, onlyNew]);

  const historyByPhone = useMemo(() => {
    const map = new Map();
    for (const item of items) {
      const key = item.phone || item.name;
      map.set(key, (map.get(key) || 0) + 1);
    }
    return map;
  }, [items]);

  async function refreshBookings() {
    setRefreshing(true);
    try {
      const res = await fetch("/api/admin-bookings", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "تعذر تحديث البيانات");
      setItems(data.bookings || []);
    } catch (error) {
      alert(error.message);
    } finally {
      setRefreshing(false);
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
      if (!response.ok) throw new Error(data.error || "تعذر حفظ التعديلات");

      setItems((prev) => prev.map((item) => (item.id === id ? data.booking : item)));
    } catch (error) {
      alert(error.message);
    } finally {
      setSavingId("");
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
        <StatCard label="كل الحجوزات" value={stats.total} />
        <StatCard label="تحت الإجراء" value={stats.pending} />
        <StatCard label="المؤكدة" value={stats.confirmed} />
        <StatCard label="الملغاة" value={stats.cancelled} />
        <StatCard label="اليوم" value={stats.today} />
        <StatCard label="الجديدة" value={stats.newOnes} />
      </div>

      <div className="card-luxe p-4 md:p-5">
        <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-xl font-semibold">أدوات الفلترة والتحكم</h2>
            <p className="mt-1 text-sm text-black/55">
              فلترة حسب الحالة، الخدمة، الدفع، الفترة الزمنية، والحجوزات الجديدة.
            </p>
          </div>

          <button
            type="button"
            onClick={refreshBookings}
            className="btn-primary"
            disabled={refreshing}
          >
            {refreshing ? "جارٍ التحديث..." : "تحديث البيانات"}
          </button>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
          <input
            className="input-luxe xl:col-span-2"
            placeholder="بحث بالاسم أو الجوال أو الملاحظات"
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
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
          >
            <option value="all">كل حالات الدفع</option>
            <option value="unpaid">غير مدفوع</option>
            <option value="paid">مدفوع</option>
          </select>

          <label className="soft-check">
            <input
              type="checkbox"
              checked={onlyNew}
              onChange={(e) => setOnlyNew(e.target.checked)}
            />
            <span className="text-sm font-medium">إظهار الجديدة فقط</span>
          </label>
        </div>

        <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <label className="text-sm">
            <span className="mb-2 block text-black/55">من تاريخ</span>
            <input
              type="date"
              className="input-luxe"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
            />
          </label>

          <label className="text-sm">
            <span className="mb-2 block text-black/55">إلى تاريخ</span>
            <input
              type="date"
              className="input-luxe"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
            />
          </label>

          <button
            type="button"
            className="btn-gold self-end"
            onClick={() => {
              setQuery("");
              setStatusFilter("all");
              setServiceFilter("all");
              setPaymentFilter("all");
              setDateFrom("");
              setDateTo("");
              setOnlyNew(false);
            }}
          >
            إعادة ضبط الفلاتر
          </button>

          <div className="self-end rounded-2xl border border-black/5 bg-black/[0.03] px-4 py-3 text-sm text-black/60">
            النتائج الحالية: <strong className="text-black">{filtered.length}</strong>
          </div>
        </div>
      </div>

      {stats.newOnes > 0 ? (
        <div className="card-luxe p-5">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-black/45">Notifications</p>
              <h3 className="mt-1 text-lg font-semibold">تنبيهات الحجوزات الجديدة</h3>
            </div>
            <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-900">
              {stats.newOnes} جديد
            </span>
          </div>

          <div className="space-y-3">
            {items
              .filter((b) => b.status === "pending" && isRecent(b.created_at))
              .slice(0, 5)
              .map((b) => (
                <div
                  key={b.id}
                  className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm"
                >
                  <strong className="text-amber-900">حجز جديد</strong>
                  <p className="mt-1 text-amber-800">
                    {b.name} — {b.service} — {b.date} — {getDisplayTime(b.time)}
                  </p>
                </div>
              ))}
          </div>
        </div>
      ) : null}

      <AdminCalendar
        bookings={filtered}
        onOpenBooking={(bookingId) => {
          setExpandedId(bookingId);
          setTimeout(() => {
            const el = document.getElementById(`booking-card-${bookingId}`);
            if (el) {
              el.scrollIntoView({ behavior: "smooth", block: "start" });
            }
          }, 50);
        }}
      />

      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="card-luxe p-8 text-center text-black/55">
            لا توجد نتائج مطابقة للفلاتر الحالية.
          </div>
        ) : null}

        {filtered.map((booking) => (
          <BookingCard
            key={booking.id}
            booking={booking}
            expanded={expandedId === booking.id}
            onToggle={() =>
              setExpandedId((prev) => (prev === booking.id ? "" : booking.id))
            }
            onUpdate={updateBooking}
            saving={savingId === booking.id}
            historyCount={historyByPhone.get(booking.phone || booking.name) || 1}
          />
        ))}
      </div>
    </div>
  );
}

function BookingCard({ booking, expanded, onToggle, onUpdate, saving, historyCount }) {
  const initialServiceId = getServiceIdFromBooking(booking);

  const [serviceId, setServiceId] = useState(initialServiceId);
  const [date, setDate] = useState(formatDateInput(booking.date));
  const [time, setTime] = useState(booking.time || DEFAULT_TIME_SLOTS[0]);
  const [status, setStatus] = useState(booking.status || "pending");
  const [paymentStatus, setPaymentStatus] = useState(booking.payment_status || "unpaid");
  const [notes, setNotes] = useState(booking.notes || "");
  const [lowerLashes, setLowerLashes] = useState(Boolean(booking.lower_lashes));
  const [removalOption, setRemovalOption] = useState(
    booking.removal_option || (booking.lash_removal ? "needs-removal" : "no-removal")
  );
  const [styleId, setStyleId] = useState(
    getInitialStyleId(initialServiceId, booking.style)
  );

  useEffect(() => {
    const options = getStyleOptions(serviceId);
    if (!options.length) {
      setStyleId("");
      return;
    }
    if (!options.find((item) => item.id === styleId)) {
      setStyleId(options[0].id);
    }
  }, [serviceId, styleId]);

  const service = getServiceById(serviceId);
  const styleOptions = getStyleOptions(serviceId);

  const totals = useMemo(() => {
    return calculateBookingTotals(service, {
      lowerLashes,
      removalOption,
    });
  }, [service, lowerLashes, removalOption]);

  const statusLabel = STATUS_LABELS[booking.status] || booking.status;
  const serviceLabel = service ? getServiceLabel(service) : booking.service;
  const styleLabel = styleId ? getStyleLabel(serviceId, styleId) : booking.style;

  async function handleSubmit(e) {
    e.preventDefault();

    await onUpdate(booking.id, {
      serviceId,
      date,
      time,
      status,
      paymentStatus,
      notes,
      lowerLashes,
      removalOption,
      styleId,
    });
  }

  async function quickStatus(nextStatus) {
    await onUpdate(booking.id, { status: nextStatus });
  }

  return (
    <div id={`booking-card-${booking.id}`} className="card-luxe overflow-hidden">
      <div className="border-b border-black/5 p-4 md:p-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="min-w-0 flex-1">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <h3 className="text-xl font-semibold">{booking.name}</h3>

              <span className={getStatusClass(booking.status)}>
                {statusLabel}
              </span>

              {(booking.payment_status || "unpaid") === "paid" ? (
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
                  مدفوع
                </span>
              ) : (
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                  غير مدفوع
                </span>
              )}

              {booking.status === "pending" && isRecent(booking.created_at) ? (
                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-900">
                  جديد
                </span>
              ) : null}
            </div>

            <p className="text-sm text-black/55">{booking.phone}</p>
            <p className="mt-1 text-xs text-black/45">
              سجل العميلة: {historyCount} حجز
            </p>

            <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <Info label="الخدمة" value={booking.service} />
              <Info label="الرسمة" value={booking.style || "-"} />
              <Info label="الموعد" value={`${booking.date} — ${getDisplayTime(booking.time)}`} />
              <Info
                label="السعر / العربون"
                value={`${formatCurrency(booking.price)} / ${formatCurrency(booking.deposit)}`}
              />
            </div>

            {(booking.notes || "").trim() ? (
              <div className="mt-3 rounded-2xl border border-black/5 bg-black/[0.03] px-4 py-3 text-sm text-black/70">
                <strong className="mb-1 block text-black">ملاحظات:</strong>
                {booking.notes}
              </div>
            ) : null}
          </div>

          <div className="flex flex-wrap gap-2 xl:max-w-[340px] xl:justify-end">
            {booking.status !== "confirmed" ? (
              <button
                type="button"
                className="btn-primary"
                onClick={() => quickStatus("confirmed")}
                disabled={saving}
              >
                تأكيد
              </button>
            ) : null}

            {booking.status !== "cancelled" ? (
              <button
                type="button"
                className="btn-gold"
                onClick={() => quickStatus("cancelled")}
                disabled={saving}
              >
                إلغاء
              </button>
            ) : null}

            {booking.status !== "archived" ? (
              <button
                type="button"
                className="btn-gold"
                onClick={() => quickStatus("archived")}
                disabled={saving}
              >
                أرشفة
              </button>
            ) : (
              <button
                type="button"
                className="btn-gold"
                onClick={() => quickStatus("confirmed")}
                disabled={saving}
              >
                استعادة
              </button>
            )}

            <a
              href={buildCustomerWhatsAppUrl(booking.phone, {
                name: booking.name,
                serviceLabel: booking.service,
                date: booking.date,
                time: getDisplayTime(booking.time),
                depositAmount: booking.deposit,
              })}
              target="_blank"
              rel="noreferrer"
              className="btn-gold"
            >
              واتساب
            </a>

            <button type="button" className="btn-primary" onClick={onToggle}>
              {expanded ? "إغلاق التحرير" : "تحرير الموعد"}
            </button>
          </div>
        </div>
      </div>

      {expanded ? (
        <form onSubmit={handleSubmit} className="p-4 md:p-5">
          <div className="mb-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <label className="text-sm">
              <span className="mb-2 block text-black/55">الخدمة</span>
              <select
                className="input-luxe"
                value={serviceId}
                onChange={(e) => setServiceId(e.target.value)}
              >
                {SERVICES.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.nameAr}
                  </option>
                ))}
              </select>
            </label>

            <label className="text-sm">
              <span className="mb-2 block text-black/55">الرسمة</span>
              <select
                className="input-luxe"
                value={styleId}
                onChange={(e) => setStyleId(e.target.value)}
              >
                {styleOptions.map((style) => (
                  <option key={style.id} value={style.id}>
                    {style.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="text-sm">
              <span className="mb-2 block text-black/55">التاريخ</span>
              <input
                type="date"
                className="input-luxe"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </label>

            <label className="text-sm">
              <span className="mb-2 block text-black/55">الوقت</span>
              <select
                className="input-luxe"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              >
                {DEFAULT_TIME_SLOTS.map((slot) => (
                  <option key={slot} value={slot}>
                    {getDisplayTime(slot)}
                  </option>
                ))}
              </select>
            </label>

            <label className="text-sm">
              <span className="mb-2 block text-black/55">الحالة</span>
              <select
                className="input-luxe"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="pending">تحت الإجراء</option>
                <option value="confirmed">مؤكد</option>
                <option value="completed">مكتمل</option>
                <option value="cancelled">ملغي</option>
                <option value="archived">مؤرشف</option>
              </select>
            </label>

            <label className="text-sm">
              <span className="mb-2 block text-black/55">الدفع</span>
              <select
                className="input-luxe"
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value)}
              >
                <option value="unpaid">غير مدفوع</option>
                <option value="paid">مدفوع</option>
              </select>
            </label>

            <label className="text-sm">
              <span className="mb-2 block text-black/55">إزالة الرموش القديمة</span>
              <select
                className="input-luxe"
                value={removalOption}
                onChange={(e) => setRemovalOption(e.target.value)}
                disabled={!service?.supportsRemoval}
              >
                {REMOVAL_OPTIONS.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="soft-check self-end">
              <input
                type="checkbox"
                checked={lowerLashes}
                onChange={(e) => setLowerLashes(e.target.checked)}
                disabled={!service?.supportsLowerLashes}
              />
              <span className="text-sm font-medium">إضافة رموش سفلية</span>
            </label>
          </div>

          <div className="mb-5 grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
            <label className="text-sm">
              <span className="mb-2 block text-black/55">ملاحظات الموعد</span>
              <textarea
                className="input-luxe min-h-[120px]"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="أي ملاحظات خاصة بالحجز أو العميلة"
              />
            </label>

            <div className="rounded-3xl border border-gold/20 bg-[#fffaf3] p-4">
              <h4 className="mb-3 text-lg font-semibold">ملخص التسعير المباشر</h4>

              <div className="space-y-2 text-sm">
                <PriceRow label="الخدمة الأساسية" value={totals.basePrice} />
                <PriceRow label="إزالة الرموش" value={totals.removalPrice} />
                <PriceRow label="الرموش السفلية" value={totals.lowerLashesPrice} />
                <div className="my-3 border-t border-gold/20" />
                <PriceRow label="الإجمالي" value={totals.totalPrice} strong />
                <PriceRow label="العربون" value={totals.depositAmount} strong />
                <PriceRow label="المتبقي" value={totals.remainingAmount} />
                <PriceRow label="المدة" value={`${totals.totalDuration} دقيقة`} />
              </div>

              <div className="mt-4 rounded-2xl border border-black/5 bg-white px-4 py-3 text-sm text-black/70">
                <strong className="mb-1 block text-black">الخدمة المختارة:</strong>
                {serviceLabel}
                <br />
                <span className="text-black/55">{styleLabel || "-"}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? "جارٍ الحفظ..." : "حفظ جميع التعديلات"}
            </button>

            <button
              type="button"
              className="btn-gold"
              onClick={() => onUpdate(booking.id, { status: "confirmed", paymentStatus })}
              disabled={saving}
            >
              حفظ وتأكيد
            </button>
          </div>
        </form>
      ) : null}
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="rounded-2xl border border-black/5 bg-black/[0.02] px-4 py-3">
      <p className="text-xs text-black/45">{label}</p>
      <p className="mt-1 font-medium">{value || "-"}</p>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="card-luxe p-5">
      <p className="text-sm text-black/45">{label}</p>
      <strong className="mt-2 block text-3xl">{value}</strong>
    </div>
  );
}

function PriceRow({ label, value, strong = false }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className={strong ? "font-semibold text-black" : "text-black/60"}>{label}</span>
      <span className={strong ? "font-semibold text-black" : "text-black"}>
        {typeof value === "number" ? `${value} SAR` : value}
      </span>
    </div>
  );
}
