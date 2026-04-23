import { NextResponse } from "next/server";
import { setAdminSession, verifyAdminPassword } from "@/lib/auth";

export async function POST(request) {
  try {
    const { password } = await request.json();

    if (!password) {
      return NextResponse.json({ error: "كلمة المرور مطلوبة" }, { status: 400 });
    }

    const isValid = await verifyAdminPassword(password);

    if (!isValid) {
      return NextResponse.json({ error: "كلمة المرور غير صحيحة" }, { status: 401 });
    }

    const response = NextResponse.json({ success: true });
    setAdminSession(response);
    return response;
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "تعذر تسجيل الدخول" },
      { status: 500 }
    );
  }
}
