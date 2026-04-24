import { cookies } from "next/headers";
import crypto from "crypto";

const COOKIE_NAME = "rezo_admin_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

function getSessionSecret() {
  return process.env.ADMIN_SESSION_SECRET || "rezo-lash-dev-secret-change-me";
}

export function getAllowedAdminEmails() {
  return (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function isAllowedAdminEmail(email) {
  const allowedEmails = getAllowedAdminEmails();
  if (allowedEmails.length === 0) return true;
  return allowedEmails.includes(String(email || "").trim().toLowerCase());
}

export function createSessionToken({ email, userId }) {
  const payload = JSON.stringify({
    role: "admin",
    email: String(email || "").toLowerCase(),
    userId,
    iat: Date.now(),
    nonce: crypto.randomBytes(12).toString("hex"),
  });
  const body = Buffer.from(payload).toString("base64url");
  const signature = crypto.createHmac("sha256", getSessionSecret()).update(body).digest("base64url");
  return `${body}.${signature}`;
}

export function getSessionPayload(token) {
  if (!token || !token.includes(".")) return null;

  const [body, signature] = token.split(".");
  const expected = crypto.createHmac("sha256", getSessionSecret()).update(body).digest("base64url");

  const sig = Buffer.from(signature || "");
  const exp = Buffer.from(expected || "");
  if (sig.length !== exp.length || !crypto.timingSafeEqual(sig, exp)) return null;

  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
    const isFresh = Date.now() - Number(payload.iat || 0) < SESSION_MAX_AGE * 1000;
    if (!isFresh || payload.role !== "admin" || !isAllowedAdminEmail(payload.email)) return null;
    return payload;
  } catch {
    return null;
  }
}

export function isValidSession(token) {
  return Boolean(getSessionPayload(token));
}

export function setAdminSession(response, user) {
  response.cookies.set(COOKIE_NAME, createSessionToken({ email: user.email, userId: user.id }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
  return response;
}

export function clearAdminSession(response) {
  response.cookies.set(COOKIE_NAME, "", {
    httpOnly: true,
    expires: new Date(0),
    path: "/",
  });
  return response;
}

export function getAdminSession() {
  return cookies().get(COOKIE_NAME)?.value;
}

export function getCurrentAdmin() {
  return getSessionPayload(getAdminSession());
}
