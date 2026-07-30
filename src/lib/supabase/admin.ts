import "server-only";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";

import { clientEnv, getServerEnv } from "@/config/env";
import type { Database } from "./database.types";

/**
 * Privileged service-role client. Bypasses Row Level Security — use ONLY in
 * trusted server contexts (webhooks, background jobs, admin tooling) for
 * operations a user cannot perform as themselves.
 *
 * The `server-only` import guarantees a build error if this ever gets pulled
 * into a client bundle, so the service-role key can never leak.
 */
export function createAdminClient() {
  const { SUPABASE_SERVICE_ROLE_KEY } = getServerEnv();

  return createSupabaseClient<Database>(
    clientEnv.NEXT_PUBLIC_SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}
