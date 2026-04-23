import { cookies } from "next/headers";
import crypto from "crypto";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

const COOKIE_NAME = "rezo_admin_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7;
const HASH_ITERATIONS = 310000;
const HASH_KEY_LENGTH = 32;
const HASH_DIGEST = "sha256";

function getSessionSecret() {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || "rezo-lash-dev-secret";
}

export function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .pbkdf2Sync(password, salt, HASH_ITERATIONS, HASH_KEY_LENGTH, HASH_DIGEST)
    .toString("hex");
  return `pbkdf2:${HASH_ITERATIONS}:${salt}:${hash}`;
}

export function verifyPassword(password, storedHash) {
  if (!password || !storedHash) return false;

  // Backward compatibility: if no hash has been saved yet, allow ADMIN_PASSWORD.
  if (!storedHash.startsWith("pbkdf2:")) {
    const a = Buffer.from(password);
    const b = Buffer.from(storedHash);
    return a.length === b.length && crypto.timingSafeEqual(a, b);
  }

  const [, iterationsRaw, salt, originalHash] = storedHash.split(":");
  const iterations = Number(iterationsRaw || HASH_ITERATIONS);
  const currentHash = crypto
    .pbkdf2Sync(password, salt, iterations, HASH_KEY_LENGTH, HASH_DIGEST)
    .toString("hex");

  return crypto.timingSafeEqual(Buffer.from(currentHash), Buffer.from(originalHash));
}

export async function getStoredAdminPasswordHash() {
  const supabase = getSupabaseAdmin();
  const { data } = await supabase
    .from("settings")
    .select("value")
    .eq("key", "admin_password")
    .maybeSingle();

  return data?.value?.hash || process.env.ADMIN_PASSWORD || "";
}

export async function saveAdminPassword(password) {
  const supabase = getSupabaseAdmin();
  const hash = hashPassword(password);
  const { error } = await supabase
    .from("settings")
    .upsert({ key: "admin_password", value: { hash }, updated_at: new Date().toISOString() });

  if (error) throw error;
  return true;
}

export async function verifyAdminPassword(password) {
  const storedHash = await getStoredAdminPasswordHash();
  return verifyPassword(password, storedHash);
}

export function createSessionToken() {
  const payload = JSON.stringify({ role: "admin", iat: Date.now(), nonce: crypto.randomBytes(12).toString("hex") });
  const body = Buffer.from(payload).toString("base64url");
  const signature = crypto.createHmac("sha256", getSessionSecret()).update(body).digest("base64url");
  return `${body}.${signature}`;
}

export function isValidSession(token) {
  if (!token || !token.includes(".")) return false;

  const [body, signature] = token.split(".");
  const expected = crypto.createHmac("sha256", getSessionSecret()).update(body).digest("base64url");
  const sig = Buffer.from(signature);
  const exp = Buffer.from(expected);
  if (sig.length !== exp.length || !crypto.timingSafeEqual(sig, exp)) return false;

  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
    return payload.role === "admin" && Date.now() - Number(payload.iat || 0) < SESSION_MAX_AGE * 1000;
  } catch {
    return false;
  }
}

export function setAdminSession(response) {
  response.cookies.set(COOKIE_NAME, createSessionToken(), {
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
