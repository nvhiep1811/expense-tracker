/**
 * Cookie utilities for client-side (non-sensitive) cookies only.
 *
 * SECURITY NOTE: access_token and refresh_token are now handled as httpOnly
 * cookies set by the backend. These functions should only be used for
 * non-sensitive cookies like UI preferences and auth session indicators.
 */

const isProduction =
  typeof window !== "undefined" && window.location.protocol === "https:";

export const setCookie = (name: string, value: string, days: number = 7) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  const secure = isProduction ? ";Secure" : "";
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax${secure}`;
};

export const getCookie = (name: string): string | null => {
  const nameEQ = name + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

export const deleteCookie = (name: string) => {
  const secure = isProduction ? ";Secure" : "";
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;SameSite=Lax${secure}`;
};
