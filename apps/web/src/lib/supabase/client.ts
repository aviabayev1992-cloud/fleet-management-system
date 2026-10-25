import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseConfig } from "./config";

/** Supabase client for use inside client components (runs in the browser). */
export function createClient() {
  const { url, publishableKey } = getSupabaseConfig();
  return createBrowserClient(url, publishableKey);
}
