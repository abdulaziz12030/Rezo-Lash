import { NextResponse } from "next/server";
import { isValidSession } from "@/lib/auth";

const COOKIE_NAME = "rezo_admin_session";

export function middleware(request) {
  const { pathname } = request.nextUrl;

  const publicAdminPaths = ["/admin/login", "/admin/forgot-password", "/admin/reset-password"];

  if (pathname.startsWith("/admin") && !publicAdminPaths.some((path) => pathname.startsWith(path))) {
    const token = request.cookies.get(COOKIE_NAME)?.value;

    if (!isValidSession(token)) {
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
