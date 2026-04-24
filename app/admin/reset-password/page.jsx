"use client";

import { useEffect, useState } from "react";
import { getSupabaseClient } from "@/lib/supabaseClient";

export default function ResetPasswordPage() {
  const [ready, setReady] = useState(false);
  const [form, setForm] = useState({ password: "", confirmPassword: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const supabase = getSupabaseClient();
    supabase.auth.getSession().then(({ data }) => {
      setReady(Boolean(data?.session));
    });
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      if (form.password.length < 8) throw new Error("كلمة المرور يجب ألا تقل عن 8 أحرف");
      if (form.password !== form.confirmPassword) throw new Error("كلمة المرور غير متطابقة");

      const supabase = getSupabaseClient();
      const { error: updateError } = await supabase.auth.updateUser({ password: form.password });
      if (updateError) throw updateError;

      setMessage("تم تحديث كلمة المرور. يمكنك الآن تسجيل الدخول من جديد.");
      setForm({ password: "", confirmPassword: "" });
      await supabase.auth.signOut();
    } catch (err) {
      setError(err.message || "تعذر تحديث كلمة المرور");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="container-luxe py-24" dir="rtl">
      <div className="card-luxe mx-auto max-w-md p-8">
        <p className="text-sm uppercase tracking-[0.25em] text-black/45">Reset</p>
        <h1 className="mt-2 text-3xl font-semibold">تعيين كلمة مرور جديدة</h1>
        <p className="mt-2 text-sm leading-6 text-black/55">
          اختر كلمة مرور قوية لا تقل عن 8 أحرف.
        </p>

        {!ready && !message ? (
          <div className="mt-8 rounded-2xl bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-800">
            افتح هذه الصفحة من رابط الاستعادة المرسل على البريد. إذا انتهت صلاحية الرابط، اطلب رابطًا جديدًا.
          </div>
        ) : null}

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <input className="input-luxe" type="password" placeholder="كلمة المرور الجديدة" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <input className="input-luxe" type="password" placeholder="تأكيد كلمة المرور" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} />

          {error ? <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}
          {message ? <div className="notice-success">{message}</div> : null}

          <button className="btn-primary w-full" disabled={loading || (!ready && !message)}>{loading ? "جارٍ التحديث..." : "تحديث كلمة المرور"}</button>
        </form>

        <a href="/admin/login" className="mt-4 inline-flex text-sm font-semibold text-black/65">تسجيل الدخول</a>
      </div>
    </main>
  );
}
