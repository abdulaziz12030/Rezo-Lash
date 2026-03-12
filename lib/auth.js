import { cookies } from "next/headers";
import crypto from "crypto";

const COOKIE_NAME = "rezo_admin_session";

function signValue(value) {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    throw new Error("Missing ADMIN_SESSION_SECRET");
  }

  return crypto.createHmac("sha256", secret).update(value).digest("hex");
}

export function createSessionToken() {
  const value = "authenticated";
  const signature = signValue(value);
  return `${value}.${signature}`;
}

export function isValidSession(token) {
  if (!token) return false;

  const [value, signature] = token.split(".");
  if (!value || !signature) return false;

  const expected = signValue(value);
  return signature === expected && value === "authenticated";
}

export function setAdminSession() {
  const token = createSessionToken();
  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/"
  });
}

export function clearAdminSession() {
  cookies().set(COOKIE_NAME, "", {
    httpOnly: true,
    expires: new Date(0),
    path: "/"
  });
}

export function getAdminSession() {
  return cookies().get(COOKIE_NAME)?.value;
}
