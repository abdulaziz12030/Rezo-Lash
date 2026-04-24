"use client";

import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
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
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "تعذر إرسال الرابط");
      setMessage("تم إرسال رابط إعادة تعيين كلمة المرور إلى بريد الأدمن.");
      setEmail("");
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
        <p className="mt-2 text-sm leading-6 text-black/55">
          اكتب بريد الأدمن، وسيتم إرسال رابط آمن لإعادة تعيين كلمة المرور عبر Supabase.
        </p>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <input
            className="input-luxe"
            type="email"
            placeholder="بريد الأدمن"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />

          {error ? <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}
          {message ? <div className="notice-success">{message}</div> : null}

          <button className="btn-primary w-full" disabled={loading}>{loading ? "جارٍ الإرسال..." : "إرسال رابط الاستعادة"}</button>
        </form>

        <a href="/admin/login" className="mt-4 inline-flex text-sm font-semibold text-black/65">العودة لتسجيل الدخول</a>
      </div>
    </main>
  );
}
