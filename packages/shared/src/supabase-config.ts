/**
 * Validation of the public Supabase connection settings.
 * Shared so the driver app can reuse it later. Only the project URL and the
 * publishable (public) key are ever accepted; secret keys are rejected.
 */

export interface SupabasePublicConfig {
  url: string;
  publishableKey: string;
}

export type SupabaseConfigResult =
  | { ok: true; config: SupabasePublicConfig }
  | { ok: false; reason: "missing" | "invalid"; errors: string[] };

function decodeJwtRole(token: string): string | undefined {
  const payload = token.split(".")[1];
  if (!payload) return undefined;
  try {
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    const role: unknown = JSON.parse(json).role;
    return typeof role === "string" ? role : undefined;
  } catch {
    return undefined;
  }
}

function validateUrl(raw: string): { url?: string; error?: string } {
  if (/[^\x20-\x7E]/.test(raw)) {
    return { error: "כתובת הפרויקט מכילה תווים לא תקינים. יש להעתיק את ה-Project URL (למשל https://abcd1234.supabase.co) ולא את שם הפרויקט." };
  }
  let parsed: URL;
  try {
    parsed = new URL(raw);
  } catch {
    return { error: "כתובת הפרויקט אינה כתובת אינטרנט תקינה. היא צריכה להיראות כך: https://abcd1234.supabase.co" };
  }
  const isLocal = parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1";
  if (parsed.protocol !== "https:" && !(isLocal && parsed.protocol === "http:")) {
    return { error: "כתובת הפרויקט חייבת להתחיל ב-https://" };
  }
  if (parsed.hostname === "supabase.com" || parsed.hostname.endsWith(".supabase.com")) {
    return { error: "זו כתובת של לוח הבקרה של Supabase ולא של הפרויקט. יש להעתיק את ה-Project URL שמסתיים ב-.supabase.co" };
  }
  if (parsed.pathname !== "/" || parsed.search || parsed.hash) {
    return { error: "כתובת הפרויקט צריכה להכיל רק את הכתובת הבסיסית, בלי נתיב נוסף (למשל https://abcd1234.supabase.co)" };
  }
  return { url: parsed.origin };
}

function validateKey(key: string): string | undefined {
  if (key.startsWith("sb_secret_")) {
    return "הוזן מפתח סודי (Secret key). אסור להשתמש בו באתר! יש להשתמש ב-Publishable key שמתחיל ב-sb_publishable_";
  }
  if (key.startsWith("sb_publishable_")) return undefined;
  const role = decodeJwtRole(key);
  if (role === "service_role") {
    return "הוזן מפתח service_role סודי. אסור להשתמש בו באתר! יש להשתמש ב-Publishable key שמתחיל ב-sb_publishable_";
  }
  if (role === "anon") return undefined; // legacy public key, still safe
  return "המפתח הציבורי אינו תקין. יש להעתיק את ה-Publishable key שמתחיל ב-sb_publishable_";
}

export function parseSupabaseConfig(rawUrl: string | undefined, rawKey: string | undefined): SupabaseConfigResult {
  const urlInput = rawUrl?.trim() ?? "";
  const keyInput = rawKey?.trim() ?? "";
  if (!urlInput && !keyInput) {
    return { ok: false, reason: "missing", errors: ["החיבור ל-Supabase עדיין לא הוגדר."] };
  }

  const errors: string[] = [];
  let url: string | undefined;
  if (!urlInput) {
    errors.push("חסרה כתובת הפרויקט (Project URL).");
  } else {
    const result = validateUrl(urlInput);
    if (result.error) errors.push(result.error);
    url = result.url;
  }

  if (!keyInput) {
    errors.push("חסר המפתח הציבורי (Publishable key).");
  } else {
    const keyError = validateKey(keyInput);
    if (keyError) errors.push(keyError);
  }

  if (errors.length > 0 || !url) return { ok: false, reason: "invalid", errors };
  return { ok: true, config: { url, publishableKey: keyInput } };
}
