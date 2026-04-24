"use client";

import { useState } from "react";

export default function AdminPasswordPage() {
  const [form, setForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/admin-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "تعذر الحفظ");
      setMessage("تم تغيير كلمة المرور بنجاح.");
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="container-luxe py-14" dir="rtl">
      <a href="/admin" className="btn-gold mb-6">العودة للوحة التحكم</a>
      <div className="card-luxe mx-auto max-w-xl p-8">
        <p className="text-sm uppercase tracking-[0.25em] text-black/45">Security</p>
        <h1 className="mt-2 text-3xl font-semibold">إنشاء / تغيير كلمة المرور</h1>
        <p className="mt-2 text-sm text-black/55">اختر كلمة مرور قوية لا تقل عن 8 أحرف.</p>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <input className="input-luxe" type="password" placeholder="كلمة المرور الحالية" value={form.currentPassword} onChange={(e) => setForm({ ...form, currentPassword: e.target.value })} />
          <input className="input-luxe" type="password" placeholder="كلمة المرور الجديدة" value={form.newPassword} onChange={(e) => setForm({ ...form, newPassword: e.target.value })} />
          <input className="input-luxe" type="password" placeholder="تأكيد كلمة المرور الجديدة" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} />

          {error ? <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}
          {message ? <div className="notice-success">{message}</div> : null}

          <button className="btn-primary w-full" disabled={loading}>{loading ? "جارٍ الحفظ..." : "حفظ كلمة المرور"}</button>
        </form>
      </div>
    </main>
  );
}
