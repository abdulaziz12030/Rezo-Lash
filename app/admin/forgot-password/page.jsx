"use client";

import { useState } from "react";

export default function ForgotPasswordPage() {
  const [form, setForm] = useState({ resetCode: "", newPassword: "", confirmPassword: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/admin-forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "تعذر التعيين");
      setMessage("تم تعيين كلمة المرور الجديدة. يمكنك تسجيل الدخول الآن.");
      setForm({ resetCode: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="container-luxe py-24" dir="rtl">
      <div className="card-luxe mx-auto max-w-md p-8">
        <p className="text-sm uppercase tracking-[0.25em] text-black/45">Recovery</p>
        <h1 className="mt-2 text-3xl font-semibold">نسيت كلمة المرور؟</h1>
        <p className="mt-2 text-sm text-black/55">استخدم رمز الاستعادة المحفوظ في متغير البيئة ADMIN_RESET_CODE.</p>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <input className="input-luxe" type="password" placeholder="رمز الاستعادة" value={form.resetCode} onChange={(e) => setForm({ ...form, resetCode: e.target.value })} />
          <input className="input-luxe" type="password" placeholder="كلمة المرور الجديدة" value={form.newPassword} onChange={(e) => setForm({ ...form, newPassword: e.target.value })} />
          <input className="input-luxe" type="password" placeholder="تأكيد كلمة المرور" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} />

          {error ? <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}
          {message ? <div className="notice-success">{message}</div> : null}

          <button className="btn-primary w-full" disabled={loading}>{loading ? "جارٍ التعيين..." : "تعيين كلمة مرور جديدة"}</button>
        </form>

        <a href="/admin/login" className="mt-4 inline-flex text-sm font-semibold text-black/65">العودة لتسجيل الدخول</a>
      </div>
    </main>
  );
}
