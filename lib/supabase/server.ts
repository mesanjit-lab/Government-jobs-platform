import "server-only";
import { createServerClient, type CookieMethodsServer } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getSupabasePublicEnv } from "./env";

/**
 * Always request-scoped. No auth workflow or Proxy is installed in Phase 1.
 * Future Route Handlers must supply a writer which applies BOTH cookie changes
 * and the SDK's response cache headers. Server Components cannot do that.
 */
export async function createClient(setAll?: CookieMethodsServer["setAll"]) {
  const { url, publishableKey } = getSupabasePublicEnv();
  const cookieStore = await cookies();
  return createServerClient(url, publishableKey, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: setAll ?? (() => {
        throw new Error("Supabase auth cookie writes require a response cookie/header adapter; authentication is not enabled.");
      }),
    },
  });
}
