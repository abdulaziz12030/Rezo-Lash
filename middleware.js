import { NextResponse } from "next/server";

const COOKIE_NAME = "rezo_admin_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

function base64UrlToText(value) {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
  return atob(padded);
}

function arrayBufferToBase64Url(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

async function sign(body, secret) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(body));
  return arrayBufferToBase64Url(signature);
}

async function isValidSession(token) {
  if (!token || !token.includes(".")) return false;

  const [body, signature] = token.split(".");
  const secret = process.env.ADMIN_SESSION_SECRET || "rezo-lash-dev-secret-change-me";
  const expected = await sign(body, secret);

  if (signature !== expected) return false;

  try {
    const payload = JSON.parse(base64UrlToText(body));
    const isFresh = Date.now() - Number(payload.iat || 0) < SESSION_MAX_AGE * 1000;
    if (!isFresh || payload.role !== "admin") return false;

    const allowedEmails = (process.env.ADMIN_EMAILS || "")
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean);

    if (allowedEmails.length === 0) return true;
    return allowedEmails.includes(String(payload.email || "").toLowerCase());
  } catch {
    return false;
  }
}

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  const publicAdminPaths = [
    "/admin/login",
    "/admin/forgot-password",
    "/admin/reset-password",
  ];

  if (
    pathname.startsWith("/admin") &&
    !publicAdminPaths.some((path) => pathname.startsWith(path))
  ) {
    const token = request.cookies.get(COOKIE_NAME)?.value;
    const valid = await isValidSession(token);

    if (!valid) {
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
