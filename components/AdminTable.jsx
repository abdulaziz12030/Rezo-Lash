"use client";

import { useEffect, useMemo, useState } from "react";
import { DEFAULT_TIME_SLOTS, SERVICES, buildCustomerWhatsAppUrl, getDisplayTime, getServiceLabel, isArchivedStatus } from "@/lib/booking";

const STATUS_META = {
  pending: { label: "تحت الإجراء", badge: "status-pending", dot: "bg-amber-500" },
  confirmed: { label: "مؤكد", badge: "status-confirmed", dot: "bg-emerald-500" },
  completed: { label: "مكتمل", badge: "status-completed", dot: "bg-sky-500" },
  cancelled: { label: "ملغي", badge: "status-cancelled", dot: "bg-rose-500" },
  archived: { label: "مؤرشف", badge: "status-archived", dot: "bg-slate-500" },
};

function normalizeDate(date) {
  return String(date || "").split("T")[0];
}

function isRecent(createdAt) {
  if (!createdAt) return false;
  const diff = Date.now() - new Date(createdAt).getTime();
  return diff < 1000 * 60 * 60 * 24;
}

function getStatusMeta(status) {
  return STATUS_META[String(status || "").toLowerCase()] || STATUS_META.pending;
}

function formatDateHeading(dateString) {
  if (!dateString) return "بدون تاريخ";
  return new Intl.DateTimeFormat("ar-SA", { dateStyle: "full" }).format(new Date(`${dateString}T00:00:00`));
}

function getMonthKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function sameMonth(dateString, focusDate) {
  if (!dateString) return false;
  return getMonthKey(new Date(`${dateString}T00:00:00`)) === getMonthKey(focusDate);
}

function sameWeek(dateString, focusDate) {
  if (!dateString) return false;
  const date = new Date(`${dateString}T00:00:00`);
  const start = new Date(focusDate);
  const day = (start.getDay() + 6) % 7;
  start.setDate(start.getDate() - day);
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 7);
  return date >= start && date < end;
}

function buildCalendarCells(focusDate) {
  const monthStart = new Date(focusDate.getFullYear(), focusDate.getMonth(), 1);
  const gridStart = new Date(monthStart);
  const offset = (monthStart.getDay() + 6) % 7;
  gridStart.setDate(monthStart.getDate() - offset);
  return Array.from({ length: 42 }, (_, index) => {
    const day = new Date(gridStart);
    day.setDate(gridStart.getDate() + index);
    return day;
  });
}

function dayKey(date) {
  return date.toISOString().split("T")[0];
}

export default function AdminTable({ bookings }) {
  const [items, setItems] = useState(bookings);
  const [savingId, setSavingId] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("active");
  const [calendarMode, setCalendarMode] = useState("month");
  const [focusDate, setFocusDate] = useState(new Date());

  async function refreshBookings(showSpinner = true) {
    if (showSpinner) setRefreshing(true);
    try {
      const response = await fetch("/api/admin-bookings", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "تعذر تحديث البيانات");
      setItems(data.bookings || []);
    } catch (error) {
      console.error(error);
    } finally {
      if (showSpinner) setRefreshing(false);
    }
  }

  useEffect(() => {
    const interval = setInterval(() => refreshBookings(false), 15000);
    return () => clearInterval(interval);
  }, []);

  const stats = useMemo(() => ({
    total: items.length,
    pending: items.filter((b) => b.status === "pending").length,
    confirmed: items.filter((b) => b.status === "confirmed").length,
    today: items.filter((b) => normalizeDate(b.date) === new Date().toISOString().split("T")[0]).length,
    cancelled: items.filter((b) => b.status === "cancelled").length,
  }), [items]);

  const filtered = useMemo(() => {
    return items.filter((booking) => {
      const archived = isArchivedStatus(booking.status);
      if (filter === "active" && archived) return false;
      if (filter === "archive" && !archived) return false;
      if (filter !== "all") {
        if (filter === "new" && !(booking.status === "pending" && isRecent(booking.created_at))) return false;
        if (["pending", "confirmed", "cancelled", "completed"].includes(filter) && booking.status !== filter) return false;
      }

      const haystack = [booking.name, booking.phone, booking.service, booking.date, booking.time, booking.status].join(" ").toLowerCase();
      return haystack.includes(query.toLowerCase());
    });
  }, [items, query, filter]);

  const grouped = useMemo(() => {
    const map = new Map();
    filtered.forEach((booking) => {
      const key = normalizeDate(booking.date);
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(booking);
    });
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [filtered]);

  const calendarBookings = useMemo(() => {
    return items.filter((booking) => {
      if (calendarMode === "week") return sameWeek(normalizeDate(booking.date), focusDate);
      return sameMonth(normalizeDate(booking.date), focusDate);
    });
  }, [items, calendarMode, focusDate]);

  const calendarByDay = useMemo(() => {
    const map = new Map();
    calendarBookings.forEach((booking) => {
      const key = normalizeDate(booking.date);
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(booking);
    });
    return map;
  }, [calendarBookings]);

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

  function shiftCalendar(direction) {
    const next = new Date(focusDate);
    if (calendarMode === "week") next.setDate(next.getDate() + (direction * 7));
    else next.setMonth(next.getMonth() + direction);
    setFocusDate(next);
  }

  const calendarCells = buildCalendarCells(focusDate);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-5">
        <StatCard label="كل الحجوزات" value={stats.total} />
        <StatCard label="تحت الإجراء" value={stats.pending} />
        <StatCard label="المؤكدة" value={stats.confirmed} />
        <StatCard label="الملغية" value={stats.cancelled} />
        <StatCard label="حجوزات اليوم" value={stats.today} />
      </div>

      <div className="card-luxe p-4 md:p-5">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-1 flex-col gap-3 md:flex-row md:items-center">
            <input className="input-luxe md:max-w-sm" placeholder="بحث بالاسم أو الجوال أو الخدمة" value={query} onChange={(e) => setQuery(e.target.value)} />
            <div className="flex flex-wrap gap-2">
              <FilterButton active={filter === "active"} onClick={() => setFilter("active")}>الحجوزات الحالية</FilterButton>
              <FilterButton active={filter === "new"} onClick={() => setFilter("new")}>الجديدة</FilterButton>
              <FilterButton active={filter === "confirmed"} onClick={() => setFilter("confirmed")}>المؤكدة</FilterButton>
              <FilterButton active={filter === "pending"} onClick={() => setFilter("pending")}>تحت الإجراء</FilterButton>
              <FilterButton active={filter === "archive"} onClick={() => setFilter("archive")}>الأرشيف</FilterButton>
            </div>
          </div>
          <button type="button" className="btn-primary min-w-[170px]" onClick={() => refreshBookings(true)}>
            {refreshing ? "جارٍ التحديث..." : "تحديث لوحة الحجوزات"}
          </button>
        </div>
      </div>

      {items.some((b) => b.status === "pending" && isRecent(b.created_at)) ? (
        <div className="card-luxe p-5">
          <p className="text-sm uppercase tracking-[0.25em] text-black/45">Notifications</p>
          <div className="mt-4 space-y-3">
            {items.filter((b) => b.status === "pending" && isRecent(b.created_at)).slice(0, 5).map((b) => (
              <div key={b.id} className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm">
                <strong className="text-amber-900">حجز جديد يحتاج متابعة</strong>
                <p className="mt-1 text-amber-800">{b.name} — {b.service} — {b.date} — {getDisplayTime(b.time)}</p>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <div className="card-luxe p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-black/45">ريم - التقويم</p>
            <h3 className="mt-2 text-2xl font-semibold">كالندر المواعيد</h3>
            <p className="mt-2 text-sm text-black/60">عرض مرئي لجميع مواعيد الأخصائية ريم مع تلوين واضح حسب الحالة.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <FilterButton active={calendarMode === "month"} onClick={() => setCalendarMode("month")}>عرض الشهر</FilterButton>
            <FilterButton active={calendarMode === "week"} onClick={() => setCalendarMode("week")}>عرض الأسبوع</FilterButton>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button type="button" className="btn-gold px-4 py-2" onClick={() => shiftCalendar(-1)}>السابق</button>
            <button type="button" className="btn-gold px-4 py-2" onClick={() => setFocusDate(new Date())}>اليوم</button>
            <button type="button" className="btn-gold px-4 py-2" onClick={() => shiftCalendar(1)}>التالي</button>
          </div>
          <p className="text-lg font-semibold">{new Intl.DateTimeFormat("ar-SA", { month: "long", year: "numeric" }).format(focusDate)}</p>
        </div>

        <div className="mt-5 grid gap-2 rounded-3xl bg-[#f7f2eb] p-3 md:grid-cols-7">
          {["الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت", "الأحد"].map((day) => (
            <div key={day} className="rounded-2xl bg-white/70 px-3 py-2 text-center text-sm font-semibold text-black/55">{day}</div>
          ))}

          {calendarCells.map((day) => {
            const key = dayKey(day);
            const dailyBookings = calendarByDay.get(key) || [];
            const isCurrentMonth = day.getMonth() === focusDate.getMonth();
            const isToday = key === new Date().toISOString().split("T")[0];
            return (
              <div key={key} className={`calendar-day ${!isCurrentMonth ? "calendar-day-muted" : ""} ${isToday ? "calendar-day-today" : ""}`}>
                <div className="mb-2 flex items-center justify-between">
                  <strong>{day.getDate()}</strong>
                  <span className="text-[11px] text-black/40">{dailyBookings.length} موعد</span>
                </div>

                <div className="space-y-2">
                  {dailyBookings.slice(0, calendarMode === "week" ? 10 : 4).map((booking) => {
                    const meta = getStatusMeta(booking.status);
                    return (
                      <div key={booking.id} className={`calendar-pill ${meta.badge}`}>
                        <span className={`inline-block h-2.5 w-2.5 rounded-full ${meta.dot}`} />
                        <span className="truncate">{getDisplayTime(booking.time)} — {booking.name}</span>
                      </div>
                    );
                  })}
                  {dailyBookings.length > (calendarMode === "week" ? 10 : 4) ? (
                    <p className="text-xs text-black/45">+ {dailyBookings.length - (calendarMode === "week" ? 10 : 4)} مواعيد أخرى</p>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 flex flex-wrap gap-3 text-sm">
          {Object.entries(STATUS_META).map(([key, meta]) => (
            <div key={key} className="flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-2">
              <span className={`inline-block h-2.5 w-2.5 rounded-full ${meta.dot}`} />
              <span>{meta.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {grouped.map(([date, bookingsForDate]) => (
          <section key={date} className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-lg font-semibold">{formatDateHeading(date)}</h3>
              <span className="text-sm text-black/45">{bookingsForDate.length} موعد</span>
            </div>

            {bookingsForDate.map((booking) => {
              const meta = getStatusMeta(booking.status);
              return (
                <div key={booking.id} className="card-luxe p-5">
                  <div className="grid gap-4 lg:grid-cols-[1fr_1.15fr]">
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-xl font-semibold">{booking.name}</h3>
                            {booking.status === "pending" && isRecent(booking.created_at) ? <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-900">جديد</span> : null}
                          </div>
                          <p className="text-sm text-black/55">{booking.phone}</p>
                        </div>
                        <span className={`status-badge ${meta.badge}`}>{meta.label}</span>
                      </div>

                      <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                        <Info label="الخدمة" value={booking.service} />
                        <Info label="الموعد" value={`${booking.date} — ${getDisplayTime(booking.time)}`} />
                        <Info label="السعر" value={`${booking.price || 0} SAR`} />
                        <Info label="العربون" value={`${booking.deposit || 0} SAR`} />
                        <Info label="الرسمة" value={booking.style} />
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
                        status: formData.get("status")
                      });
                    }}>
                      <label className="text-sm"><span className="mb-2 block">الخدمة</span><select name="serviceId" defaultValue={SERVICES.find((s) => getServiceLabel(s) === booking.service)?.id || SERVICES[0].id} className="input-luxe">{SERVICES.map((service) => <option key={service.id} value={service.id}>{getServiceLabel(service)}</option>)}</select></label>
                      <label className="text-sm"><span className="mb-2 block">التاريخ</span><input type="date" name="date" defaultValue={normalizeDate(booking.date)} className="input-luxe" /></label>
                      <label className="text-sm"><span className="mb-2 block">الوقت</span><select name="time" defaultValue={booking.time} className="input-luxe">{DEFAULT_TIME_SLOTS.map((slot) => <option key={slot} value={slot}>{getDisplayTime(slot)}</option>)}</select></label>
                      <label className="text-sm"><span className="mb-2 block">الحالة</span><select name="status" defaultValue={booking.status} className="input-luxe"><option value="pending">تحت الإجراء</option><option value="confirmed">مؤكد</option><option value="completed">مكتمل</option><option value="cancelled">ملغي</option><option value="archived">مؤرشف</option></select></label>
                      <label className="text-sm"><span className="mb-2 block">السعر</span><input type="number" name="price" defaultValue={booking.price || 0} className="input-luxe" /></label>
                      <label className="text-sm"><span className="mb-2 block">العربون</span><input type="number" name="deposit" defaultValue={booking.deposit || 0} className="input-luxe" /></label>
                      <div className="sm:col-span-2 flex flex-wrap gap-2">
                        <button type="submit" className="btn-primary" disabled={savingId === booking.id}>{savingId === booking.id ? "جارٍ الحفظ..." : "حفظ التعديل"}</button>
                        {!isArchivedStatus(booking.status) ? <button type="button" className="btn-gold" onClick={() => updateBooking(booking.id, { status: "archived" })}>نقل إلى الأرشيف</button> : <button type="button" className="btn-gold" onClick={() => updateBooking(booking.id, { status: "confirmed" })}>استعادة الحجز</button>}
                        <a href={buildCustomerWhatsAppUrl(booking.phone, { name: booking.name, serviceLabel: booking.service, date: booking.date, time: getDisplayTime(booking.time), depositAmount: booking.deposit })} target="_blank" rel="noreferrer" className="btn-gold">واتساب العميلة</a>
                      </div>
                    </form>
                  </div>
                </div>
              );
            })}
          </section>
        ))}

        {grouped.length === 0 ? <div className="card-luxe p-8 text-center text-black/55">لا توجد نتائج مطابقة.</div> : null}
      </div>
    </div>
  );
}

function Info({ label, value }) {
  return <div className="rounded-2xl border border-black/5 bg-black/[0.02] px-4 py-3"><p className="text-xs text-black/45">{label}</p><p className="mt-1 font-medium">{value}</p></div>;
}
function StatCard({ label, value }) {
  return <div className="card-luxe p-5"><p className="text-sm text-black/45">{label}</p><strong className="mt-2 block text-3xl">{value}</strong></div>;
}
function FilterButton({ active, onClick, children }) {
  return <button type="button" className={active ? "btn-primary px-4 py-2 text-sm" : "btn-gold px-4 py-2 text-sm"} onClick={onClick}>{children}</button>;
}
