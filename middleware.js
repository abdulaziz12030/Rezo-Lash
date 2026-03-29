import { NextResponse } from "next/server";
import crypto from "crypto";

const COOKIE_NAME = "rezo_admin_session";

function signValue(value) {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) return null;
  return crypto.createHmac("sha256", secret).update(value).digest("hex");
}

function isValidSession(token) {
  if (!token) return false;
  const [value, signature] = token.split(".");
  if (!value || !signature) return false;
  const expected = signValue(value);
  return expected && signature === expected && value === "authenticated";
}

export function middleware(request) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const token = request.cookies.get(COOKIE_NAME)?.value;

    if (!isValidSession(token)) {
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"]
};
