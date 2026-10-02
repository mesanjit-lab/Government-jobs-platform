export class SupabaseEnvironmentError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SupabaseEnvironmentError";
  }
}

/** Lazy, public-only configuration. Errors deliberately never include values. */
export function parseSupabasePublicEnv(url: string | undefined, key: string | undefined) {
  if (!url || !key) {
    throw new SupabaseEnvironmentError(
      "Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY before using Supabase.",
    );
  }
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    throw new SupabaseEnvironmentError("NEXT_PUBLIC_SUPABASE_URL must be a valid project URL.");
  }
  const local = ["localhost", "127.0.0.1", "[::1]"].includes(parsed.hostname);
  if (
    !/^https?:\/\//.test(url) || /[\s\\]/.test(url) || parsed.username || parsed.password || parsed.search || parsed.hash ||
    parsed.pathname !== "/" || (parsed.protocol !== "https:" && !(local && parsed.protocol === "http:"))
  ) {
    throw new SupabaseEnvironmentError("NEXT_PUBLIC_SUPABASE_URL must be an HTTPS origin (HTTP allowed only on loopback).");
  }
  if (!/^sb_publishable_[A-Za-z0-9_-]+$/.test(key)) {
    throw new SupabaseEnvironmentError("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY must be a modern publishable key, never a secret or legacy JWT.");
  }
  return { url: parsed.origin, publishableKey: key } as const;
}

export function getSupabasePublicEnv() {
  // Explicit references are required for Next.js browser build-time substitution.
  return parseSupabasePublicEnv(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  );
}
