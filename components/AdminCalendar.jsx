"use client";

import { useMemo, useState } from "react";
import { getDisplayTime } from "@/lib/booking";

const STATUS_STYLES = {
  pending: {
    label: "تحت الإجراء",
    className: "calendar-event calendar-event-pending",
  },
  confirmed: {
    label: "مؤكد",
    className: "calendar-event calendar-event-confirmed",
  },
  completed: {
    label: "مكتمل",
    className: "calendar-event calendar-event-completed",
  },
  cancelled: {
    label: "ملغي",
    className: "calendar-event calendar-event-cancelled",
  },
  archived: {
    label: "مؤرشف",
    className: "calendar-event calendar-event-archived",
  },
};

const DAY_NAMES = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
const DAY_NAMES_SHORT = ["أحد", "اثن", "ثلا", "أرب", "خمي", "جمع", "سبت"];

function pad(num) {
  return String(num).padStart(2, "0");
}

function toDateKey(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function parseDateKey(dateKey) {
  const [y, m, d] = dateKey.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function isSameMonth(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

function isTodayKey(dateKey) {
  return toDateKey(new Date()) === dateKey;
}

function monthLabel(date) {
  return date.toLocaleDateString("ar-SA", {
    month: "long",
    year: "numeric",
  });
}

function getWeekStart(date) {
  const d = new Date(date);
  const day = d.getDay();
  d.setDate(d.getDate() - day);
  d.setHours(0, 0, 0, 0);
  return d;
}

function getMonthDays(viewDate) {
  const firstDay = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1);
  const start = new Date(firstDay);
  start.setDate(firstDay.getDate() - firstDay.getDay());

  const days = [];
  for (let i = 0; i < 42; i += 1) {
    const current = new Date(start);
    current.setDate(start.getDate() + i);
    days.push({
      date: current,
      key: toDateKey(current),
      inMonth: isSameMonth(current, viewDate),
      isToday: isTodayKey(toDateKey(current)),
    });
  }
  return days;
}

function getWeekDays(viewDate) {
  const start = getWeekStart(viewDate);
  const days = [];
  for (let i = 0; i < 7; i += 1) {
    const current = new Date(start);
    current.setDate(start.getDate() + i);
    days.push({
      date: current,
      key: toDateKey(current),
      inMonth: true,
      isToday: isTodayKey(toDateKey(current)),
    });
  }
  return days;
}

function sortBookings(bookings) {
  return [...bookings].sort((a, b) => {
    const at = a.time || "";
    const bt = b.time || "";
    return at.localeCompare(bt);
  });
}

function formatDayNumber(date) {
  return date.getDate();
}

function formatWeekRange(date) {
  const start = getWeekStart(date);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);

  const sameMonth = start.getMonth() === end.getMonth();
  const startText = start.toLocaleDateString("ar-SA", {
    day: "numeric",
    month: "long",
  });

  const endText = end.toLocaleDateString("ar-SA", {
    day: "numeric",
    month: sameMonth ? undefined : "long",
    year: "numeric",
  });

  return `${startText} - ${endText}`;
}

export default function AdminCalendar({
  bookings = [],
  onOpenBooking,
  initialView = "month",
}) {
  const [viewMode, setViewMode] = useState(initialView);
  const [viewDate, setViewDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(toDateKey(new Date()));

  const grouped = useMemo(() => {
    const map = {};
    for (const booking of bookings) {
      if (!booking?.date) continue;
      if (!map[booking.date]) map[booking.date] = [];
      map[booking.date].push(booking);
    }

    Object.keys(map).forEach((key) => {
      map[key] = sortBookings(map[key]);
    });

    return map;
  }, [bookings]);

  const days = useMemo(() => {
    return viewMode === "month" ? getMonthDays(viewDate) : getWeekDays(viewDate);
  }, [viewDate, viewMode]);

  const selectedItems = grouped[selectedDate] || [];

  function goPrev() {
    const next = new Date(viewDate);
    if (viewMode === "month") {
      next.setMonth(next.getMonth() - 1);
    } else {
      next.setDate(next.getDate() - 7);
    }
    setViewDate(next);
  }

  function goNext() {
    const next = new Date(viewDate);
    if (viewMode === "month") {
      next.setMonth(next.getMonth() + 1);
    } else {
      next.setDate(next.getDate() + 7);
    }
    setViewDate(next);
  }

  function goToday() {
    const today = new Date();
    setViewDate(today);
    setSelectedDate(toDateKey(today));
  }

  return (
    <div className="card-luxe overflow-hidden">
      <div className="border-b border-black/5 p-4 md:p-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-black/45">Calendar</p>
            <h3 className="mt-1 text-xl font-semibold">تقويم مواعيد ريم</h3>
            <p className="mt-1 text-sm text-black/55">
              عرض شهري وأسبوعي واضح ومتوافق مع الجوال.
            </p>
          </div>

          <div className="admin-calendar-toolbar">
            <div className="admin-calendar-switch">
              <button
                type="button"
                onClick={() => setViewMode("month")}
                className={viewMode === "month" ? "active" : ""}
              >
                شهري
              </button>
              <button
                type="button"
                onClick={() => setViewMode("week")}
                className={viewMode === "week" ? "active" : ""}
              >
                أسبوعي
              </button>
            </div>

            <div className="admin-calendar-nav">
              <button type="button" onClick={goNext}>التالي</button>
              <button type="button" onClick={goToday}>اليوم</button>
              <button type="button" onClick={goPrev}>السابق</button>
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="rounded-2xl border border-black/5 bg-black/[0.03] px-4 py-3 text-sm font-medium">
            {viewMode === "month" ? monthLabel(viewDate) : `أسبوع: ${formatWeekRange(viewDate)}`}
          </div>

          <div className="calendar-legend">
            <LegendItem label="مؤكد" className="calendar-dot-confirmed" />
            <LegendItem label="تحت الإجراء" className="calendar-dot-pending" />
            <LegendItem label="مكتمل" className="calendar-dot-completed" />
            <LegendItem label="ملغي" className="calendar-dot-cancelled" />
          </div>
        </div>
      </div>

      <div className="grid gap-0 xl:grid-cols-[1.25fr_0.75fr]">
        <div className="p-3 md:p-5">
          <div className="admin-calendar-grid-wrap">
            <div className="admin-calendar-grid-header">
              {(viewMode === "month" ? DAY_NAMES : DAY_NAMES_SHORT).map((day) => (
                <div key={day} className="admin-calendar-head-cell">
                  {day}
                </div>
              ))}
            </div>

            <div className={`admin-calendar-grid ${viewMode === "week" ? "is-week" : ""}`}>
              {days.map((day) => {
                const dayBookings = grouped[day.key] || [];
                const isSelected = selectedDate === day.key;

                return (
                  <button
                    key={day.key}
                    type="button"
                    onClick={() => setSelectedDate(day.key)}
                    className={[
                      "admin-calendar-cell",
                      !day.inMonth ? "is-muted" : "",
                      day.isToday ? "is-today" : "",
                      isSelected ? "is-selected" : "",
                    ].join(" ")}
                  >
                    <div className="admin-calendar-cell-top">
                      <span className="admin-calendar-cell-date">
                        {formatDayNumber(day.date)}
                      </span>
                      {dayBookings.length > 0 ? (
                        <span className="admin-calendar-cell-count">
                          {dayBookings.length}
                        </span>
                      ) : null}
                    </div>

                    <div className="admin-calendar-events">
                      {dayBookings.slice(0, viewMode === "month" ? 3 : 5).map((booking) => {
                        const statusMeta =
                          STATUS_STYLES[booking.status] || STATUS_STYLES.pending;

                        return (
                          <div key={booking.id} className={statusMeta.className}>
                            <span className="truncate">
                              {getDisplayTime(booking.time)} - {booking.name}
                            </span>
                          </div>
                        );
                      })}

                      {dayBookings.length > (viewMode === "month" ? 3 : 5) ? (
                        <div className="admin-calendar-more">
                          +{dayBookings.length - (viewMode === "month" ? 3 : 5)} أكثر
                        </div>
                      ) : null}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="border-t border-black/5 p-4 md:p-5 xl:border-r xl:border-t-0">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm text-black/45">تفاصيل اليوم المحدد</p>
              <h4 className="mt-1 text-lg font-semibold">
                {parseDateKey(selectedDate).toLocaleDateString("ar-SA", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </h4>
            </div>

            <span className="rounded-full bg-black/[0.05] px-3 py-1 text-sm font-medium">
              {selectedItems.length} موعد
            </span>
          </div>

          {selectedItems.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-black/10 bg-black/[0.02] p-6 text-center text-sm text-black/50">
              لا توجد مواعيد في هذا اليوم.
            </div>
          ) : (
            <div className="space-y-3">
              {selectedItems.map((booking) => {
                const statusMeta =
                  STATUS_STYLES[booking.status] || STATUS_STYLES.pending;

                return (
                  <button
                    key={booking.id}
                    type="button"
                    onClick={() => onOpenBooking?.(booking.id)}
                    className="admin-day-booking"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 text-right">
                        <h5 className="truncate text-sm font-semibold text-black">
                          {booking.name}
                        </h5>
                        <p className="mt-1 text-xs text-black/55">{booking.phone}</p>
                      </div>

                      <span className={statusMeta.className}>
                        {STATUS_STYLES[booking.status]?.label || "تحت الإجراء"}
                      </span>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-black/70">
                      <div className="rounded-xl bg-black/[0.03] px-3 py-2">
                        <strong className="block text-black">الوقت</strong>
                        {getDisplayTime(booking.time)}
                      </div>
                      <div className="rounded-xl bg-black/[0.03] px-3 py-2">
                        <strong className="block text-black">الخدمة</strong>
                        {booking.service}
                      </div>
                    </div>

                    <div className="mt-3 text-xs text-black/45">
                      اضغط لفتح بطاقة الموعد وتعديله
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function LegendItem({ label, className }) {
  return (
    <div className="calendar-legend-item">
      <span className={`calendar-dot ${className}`} />
      <span>{label}</span>
    </div>
  );
}
