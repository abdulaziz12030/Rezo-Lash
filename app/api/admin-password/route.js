import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/auth";
import { getSupabaseClient } from "@/lib/supabaseClient";

export async function POST(request) {
  try {
    const admin = getCurrentAdmin();
    if (!admin?.email) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const { currentPassword, newPassword, confirmPassword } = await request.json();

    if (!currentPassword || !newPassword || !confirmPassword) {
      return NextResponse.json({ error: "جميع الحقول مطلوبة" }, { status: 400 });
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json({ error: "كلمة المرور الجديدة غير متطابقة" }, { status: 400 });
    }

    if (newPassword.length < 8) {
      return NextResponse.json({ error: "كلمة المرور يجب ألا تقل عن 8 أحرف" }, { status: 400 });
    }

    const supabase = getSupabaseClient();
    const { data, error: loginError } = await supabase.auth.signInWithPassword({
      email: admin.email,
      password: currentPassword,
    });

    if (loginError || !data?.session) {
      return NextResponse.json({ error: "كلمة المرور الحالية غير صحيحة" }, { status: 401 });
    }

    const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });
    if (updateError) throw updateError;

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message || "تعذر تحديث كلمة المرور" }, { status: 500 });
  }
}
