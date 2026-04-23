import { NextResponse } from "next/server";
import { saveAdminPassword } from "@/lib/auth";

export async function POST(request) {
  try {
    const { resetCode, newPassword, confirmPassword } = await request.json();
    const expectedCode = process.env.ADMIN_RESET_CODE;

    if (!expectedCode) {
      return NextResponse.json({ error: "لم يتم ضبط ADMIN_RESET_CODE في متغيرات البيئة" }, { status: 500 });
    }

    if (!resetCode || resetCode !== expectedCode) {
      return NextResponse.json({ error: "رمز الاستعادة غير صحيح" }, { status: 401 });
    }

    if (!newPassword || newPassword.length < 8) {
      return NextResponse.json({ error: "كلمة المرور يجب ألا تقل عن 8 أحرف" }, { status: 400 });
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json({ error: "كلمة المرور الجديدة غير متطابقة" }, { status: 400 });
    }

    await saveAdminPassword(newPassword);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message || "تعذر تعيين كلمة المرور" }, { status: 500 });
  }
}
