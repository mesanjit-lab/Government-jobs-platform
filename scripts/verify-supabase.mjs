// Node-only operator utility. Never import into app code; no write operations.
import { pathToFileURL } from "node:url";
import { createClient } from "@supabase/supabase-js";
import { getSupabasePublicEnv, SupabaseEnvironmentError } from "../lib/supabase/env.ts";

export async function verifySupabase({ allowNetwork = false, fetchImpl = fetch } = {}) {
  let config;
  try {
    config = getSupabasePublicEnv();
  } catch (error) {
    return { ok: false, message: error instanceof SupabaseEnvironmentError ? error.message : "Invalid Supabase configuration." };
  }
  if (!allowNetwork) {
    return { ok: false, message: "No request sent. After project/setup approval, pass --allow-network for a read-only connectivity check." };
  }
  try {
    const client = createClient(config.url, config.publishableKey, {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
      global: { fetch: fetchImpl },
    });
    const { error, status } = await client.from("recruitments")
      .select("id", { head: true }).limit(1).abortSignal(AbortSignal.timeout(10_000));
    if (error) return { ok: false, message: `Read check failed (HTTP ${status}). Check setup, migration and SELECT permissions; response details withheld.` };
    return { ok: true, message: "Read endpoint reachable with publishable credentials. No rows printed or changed. This does not verify RLS correctness or record existence." };
  } catch {
    return { ok: false, message: "Read check failed or timed out; network/error details withheld." };
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const result = await verifySupabase({ allowNetwork: process.argv.includes("--allow-network") });
  console.log(result.message);
  process.exitCode = result.ok ? 0 : 1;
}
