import { cookies } from "next/headers";

const COOKIE_NAME = "rezo_admin_session";
const COOKIE_VALUE = "authenticated";

export function createSessionToken() {
  return COOKIE_VALUE;
}

export function isValidSession(token) {
  return token === COOKIE_VALUE;
}

export function setAdminSession(response) {
  response.cookies.set(COOKIE_NAME, createSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
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
