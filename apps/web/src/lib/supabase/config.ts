import { parseSupabaseConfig, type SupabasePublicConfig } from "@fleet/shared";

/**
 * Public Supabase settings from environment variables.
 * The variables must be read with literal names so Next.js can embed them in
 * the browser bundle. Only public values belong here – never a secret key.
 */
export function getSupabaseConfigResult() {
  return parseSupabaseConfig(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);
}

export function getSupabaseConfig(): SupabasePublicConfig {
  const result = getSupabaseConfigResult();
  if (!result.ok) {
    throw new Error(`Supabase is not configured: ${result.errors.join(" ")}`);
  }
  return result.config;
}
