"use client";

import { useState } from "react";

export default function AdminLoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "تعذر تسجيل الدخول");
      window.location.href = "/admin";
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="container-luxe py-24" dir="rtl">
      <div className="card-luxe mx-auto max-w-md p-8">
        <p className="text-sm uppercase tracking-[0.25em] text-black/45">Admin Access</p>
        <h1 className="mt-2 text-3xl font-semibold">تسجيل دخول الأدمن</h1>
        <p className="mt-2 text-sm leading-6 text-black/55">
          ادخل بالبريد الإلكتروني وكلمة المرور المسجلة في Supabase Auth.
        </p>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="mb-2 block text-sm font-medium">البريد الإلكتروني</label>
            <input
              type="email"
              className="input-luxe"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="admin@example.com"
              autoComplete="email"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">كلمة المرور</label>
            <input
              type="password"
              className="input-luxe"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="أدخل كلمة المرور"
              autoComplete="current-password"
            />
          </div>

          {error ? <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}

          <button className="btn-primary w-full" disabled={loading}>
            {loading ? "جارٍ الدخول..." : "دخول"}
          </button>

          <a href="/admin/forgot-password" className="block text-center text-sm font-semibold text-black/60">
            نسيت كلمة المرور؟
          </a>
        </form>
      </div>
    </main>
  );
}
