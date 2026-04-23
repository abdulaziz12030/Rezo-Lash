import { NextResponse } from "next/server";
import { getAdminSession, isValidSession, saveAdminPassword, verifyAdminPassword } from "@/lib/auth";

export async function POST(request) {
  try {
    if (!isValidSession(getAdminSession())) {
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

    const validCurrent = await verifyAdminPassword(currentPassword);
    if (!validCurrent) {
      return NextResponse.json({ error: "كلمة المرور الحالية غير صحيحة" }, { status: 401 });
    }

    await saveAdminPassword(newPassword);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message || "تعذر تحديث كلمة المرور" }, { status: 500 });
  }
}
