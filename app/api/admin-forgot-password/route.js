import { NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabaseClient";
import { isAllowedAdminEmail } from "@/lib/auth";

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "البريد الإلكتروني مطلوب" }, { status: 400 });
    }

    if (!isAllowedAdminEmail(email)) {
      return NextResponse.json({ error: "هذا البريد غير مصرح له بدخول لوحة التحكم" }, { status: 403 });
    }

    const origin = request.headers.get("origin") || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const supabase = getSupabaseClient();
    const { error } = await supabase.auth.resetPasswordForEmail(String(email).trim().toLowerCase(), {
      redirectTo: `${origin}/admin/reset-password`,
    });

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message || "تعذر إرسال رابط الاستعادة" }, { status: 500 });
  }
}
