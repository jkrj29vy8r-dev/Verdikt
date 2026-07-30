import { createBrowserClient } from "@supabase/ssr";

import { clientEnv } from "@/config/env";
import type { Database } from "./database.types";

/**
 * Browser Supabase client (Client Components only).
 *
 * Uses the publishable anon key and relies on Row Level Security for
 * authorization. Create fresh per call — the SSR helper handles cookie sync.
 */
export function createClient() {
  return createBrowserClient<Database>(
    clientEnv.NEXT_PUBLIC_SUPABASE_URL,
    clientEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}
