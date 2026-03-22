"use client";

import { useEffect, useMemo, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

function LegendItem({ className, label }) {
  return (
    <div className="flex items-center gap-2 text-sm text-black/70">
      <span className={`inline-block h-3 w-3 rounded-full ${className}`} />
      <span>{label}</span>
    </div>
  );
}

export default function AdminCalendarPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeEvent, setActiveEvent] = useState(null);

  useEffect(() => {
    async function loadEvents() {
      try {
        const response = await fetch("/api/admin-calendar");
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Failed to load calendar");
        setEvents(data.events || []);
      } catch (error) {
        console.error(error);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    }

    loadEvents();
  }, []);

  const summary = useMemo(() => ({
    total: events.length,
    confirmed: events.filter((item) => item.extendedProps?.status === "confirmed").length,
    pending: events.filter((item) => item.extendedProps?.status === "pending").length,
    completed: events.filter((item) => item.extendedProps?.status === "completed").length,
  }), [events]);

  return (
    <main className="container-luxe py-14" dir="rtl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-black/45">Admin Calendar</p>
          <h1 className="section-title mt-2">تقويم المواعيد</h1>
          <p className="mt-2 text-black/60">عرض شهري أوضح للمواعيد المتاحة والمحجوزة مع تمييز بصري للحالات.</p>
        </div>
        <div className="flex gap-3">
          <a href="/admin" className="btn-gold">العودة للوحة الإدارة</a>
          <a href="/" className="btn-gold">العودة للموقع</a>
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-4">
        <div className="card-luxe p-5"><p className="text-sm text-black/45">كل المواعيد</p><strong className="mt-2 block text-3xl">{summary.total}</strong></div>
        <div className="card-luxe border border-emerald-200 bg-emerald-50 p-5"><p className="text-sm text-emerald-700">المؤكدة</p><strong className="mt-2 block text-3xl text-emerald-700">{summary.confirmed}</strong></div>
        <div className="card-luxe border border-amber-200 bg-amber-50 p-5"><p className="text-sm text-amber-700">تحت الإجراء</p><strong className="mt-2 block text-3xl text-amber-700">{summary.pending}</strong></div>
        <div className="card-luxe border border-slate-200 bg-slate-50 p-5"><p className="text-sm text-slate-600">المكتملة</p><strong className="mt-2 block text-3xl text-slate-600">{summary.completed}</strong></div>
      </div>

      <div className="card-luxe mt-8 p-4 md:p-6">
        <div className="mb-5 flex flex-wrap items-center gap-4">
          <LegendItem className="bg-emerald-500" label="مؤكد" />
          <LegendItem className="bg-amber-500" label="تحت الإجراء" />
          <LegendItem className="bg-slate-500" label="مكتمل" />
          <LegendItem className="bg-rose-500" label="ملغي" />
        </div>

        {loading ? <p className="text-sm text-black/60">جاري تحميل التقويم...</p> : null}

        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          locale="ar"
          direction="rtl"
          events={events}
          height="auto"
          headerToolbar={{
            start: "title",
            center: "",
            end: "prev,next today"
          }}
          buttonText={{ today: "اليوم" }}
          eventClick={(info) => {
            const event = info.event;
            setActiveEvent({
              title: event.title,
              start: event.start,
              phone: event.extendedProps.phone,
              status: event.extendedProps.status,
              style: event.extendedProps.style,
              price: event.extendedProps.price,
              deposit: event.extendedProps.deposit,
            });
          }}
        />
      </div>

      {activeEvent ? (
        <div className="card-luxe mt-6 p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-black/45">تفاصيل الموعد</p>
              <h2 className="mt-2 text-xl font-semibold">{activeEvent.title}</h2>
            </div>
            <button type="button" onClick={() => setActiveEvent(null)} className="btn-gold">إغلاق</button>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 text-sm">
            <div className="rounded-2xl bg-black/[0.03] px-4 py-3"><p className="text-black/45">الحالة</p><p className="mt-1 font-medium">{activeEvent.status}</p></div>
            <div className="rounded-2xl bg-black/[0.03] px-4 py-3"><p className="text-black/45">الجوال</p><p className="mt-1 font-medium">{activeEvent.phone || "-"}</p></div>
            <div className="rounded-2xl bg-black/[0.03] px-4 py-3"><p className="text-black/45">السعر</p><p className="mt-1 font-medium">{activeEvent.price || 0} SAR</p></div>
            <div className="rounded-2xl bg-black/[0.03] px-4 py-3"><p className="text-black/45">العربون</p><p className="mt-1 font-medium">{activeEvent.deposit || 0} SAR</p></div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
