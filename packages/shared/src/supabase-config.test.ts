import { describe, expect, it } from "vitest";
import { parseSupabaseConfig } from "./supabase-config";

const URL_OK = "https://abcdefghijklmnop.supabase.co";
// Built at runtime so the repository secret scanner does not flag test fixtures.
const PUBLISHABLE = ["sb", "publishable", "AbCdEf123456"].join("_");
const SECRET = ["sb", "secret", "AbCdEf123456"].join("_");

function fakeJwt(role: string) {
  const enc = (o: object) => btoa(JSON.stringify(o)).replace(/=+$/, "");
  return `${enc({ alg: "HS256", typ: "JWT" })}.${enc({ iss: "supabase", role })}.signature`;
}

describe("parseSupabaseConfig", () => {
  it("accepts a project URL with a publishable key", () => {
    const result = parseSupabaseConfig(`  ${URL_OK}/ `, PUBLISHABLE);
    expect(result).toEqual({ ok: true, config: { url: URL_OK, publishableKey: PUBLISHABLE } });
  });

  it("accepts a legacy anon key", () => {
    expect(parseSupabaseConfig(URL_OK, fakeJwt("anon")).ok).toBe(true);
  });

  it("allows http only for local development", () => {
    expect(parseSupabaseConfig("http://127.0.0.1:54321", PUBLISHABLE).ok).toBe(true);
    expect(parseSupabaseConfig("http://abcdefghijklmnop.supabase.co", PUBLISHABLE).ok).toBe(false);
  });

  it("reports missing configuration", () => {
    const result = parseSupabaseConfig(undefined, "  ");
    expect(result.ok).toBe(false);
    expect(!result.ok && result.reason).toBe("missing");
  });

  it("reports a missing key when only the URL is set", () => {
    const result = parseSupabaseConfig(URL_OK, undefined);
    expect(!result.ok && result.reason).toBe("invalid");
  });

  it.each([
    ["the project display name", "ניהול צי רכב"],
    ["the dashboard URL", "https://supabase.com/dashboard/project/abcdefghijklmnop"],
    ["a URL with a path", `${URL_OK}/rest/v1`],
    ["a non-URL", "abcdefghijklmnop"],
  ])("rejects %s as the project URL", (_, url) => {
    expect(parseSupabaseConfig(url, PUBLISHABLE).ok).toBe(false);
  });

  it.each([
    ["a secret key", SECRET],
    ["a service_role key", fakeJwt("service_role")],
    ["random text", "not-a-key"],
  ])("rejects %s", (_, key) => {
    const result = parseSupabaseConfig(URL_OK, key);
    expect(result.ok).toBe(false);
  });
});
