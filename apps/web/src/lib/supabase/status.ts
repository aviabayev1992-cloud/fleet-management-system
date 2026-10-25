import "server-only";
import { getSupabaseConfigResult } from "./config";

export type SupabaseStatus =
  | { state: "not_configured" }
  | { state: "invalid"; errors: string[] }
  | { state: "connected"; host: string }
  | { state: "unreachable"; host: string; detail: string };

/**
 * Checks the settings and pings the Supabase Auth health endpoint.
 * Requires no tables, so it works on a brand-new project.
 */
export async function getSupabaseStatus(): Promise<SupabaseStatus> {
  const result = getSupabaseConfigResult();
  if (!result.ok) {
    return result.reason === "missing" ? { state: "not_configured" } : { state: "invalid", errors: result.errors };
  }

  const { url, publishableKey } = result.config;
  const host = new URL(url).host;
  try {
    const res = await fetch(`${url}/auth/v1/health`, {
      headers: { apikey: publishableKey },
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });
    if (res.ok) return { state: "connected", host };
    const detail =
      res.status === 401 || res.status === 403
        ? "המפתח הציבורי נדחה. ודאו שהעתקתם את ה-Publishable key של אותו פרויקט."
        : `השרת החזיר קוד ${res.status}.`;
    return { state: "unreachable", host, detail };
  } catch {
    return { state: "unreachable", host, detail: "לא ניתן להתחבר לכתובת. ודאו שה-Project URL נכון ושהפרויקט פעיל (לא מושהה)." };
  }
}
