import { NextResponse } from "next/server";
import { setAdminSession, isAllowedAdminEmail } from "@/lib/auth";
import { getSupabaseClient } from "@/lib/supabaseClient";

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "البريد الإلكتروني وكلمة المرور مطلوبة" }, { status: 400 });
    }

    if (!isAllowedAdminEmail(email)) {
      return NextResponse.json({ error: "هذا البريد غير مصرح له بدخول لوحة التحكم" }, { status: 403 });
    }

    const supabase = getSupabaseClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: String(email).trim().toLowerCase(),
      password,
    });

    if (error || !data?.user) {
      return NextResponse.json({ error: "بيانات الدخول غير صحيحة" }, { status: 401 });
    }

    const response = NextResponse.json({ success: true });
    setAdminSession(response, data.user);
    return response;
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "تعذر تسجيل الدخول" },
      { status: 500 }
    );
  }
}
