import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

import { clientEnv } from "@/config/env";
import type { Database } from "./database.types";

/**
 * Server Supabase client (Server Components, Route Handlers, Server Actions).
 *
 * Reads/writes the auth session via Next's cookie store. Must be created per
 * request — never hoist to a module-level singleton, or requests would share a
 * session. Cookie writes are wrapped in try/catch because Server Components may
 * run in a context where mutation is disallowed; the middleware refresh path
 * handles persistence in that case.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    clientEnv.NEXT_PUBLIC_SUPABASE_URL,
    clientEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Called from a Server Component render — safe to ignore; the
            // session is refreshed in middleware instead.
          }
        },
      },
    },
  );
}
