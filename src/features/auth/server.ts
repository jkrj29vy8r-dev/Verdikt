import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

/**
 * Server-side auth helpers.
 *
 * `getUser` is wrapped in React's `cache` so multiple calls within a single
 * request (layout + page + action) hit Supabase once. `requireUser` is the
 * guard for protected server code — pair it with the middleware redirect for
 * defense in depth (middleware for UX, this for correctness).
 */

export const getUser = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
});

/** Return the authenticated user, or redirect to /login if there is none. */
export async function requireUser() {
  const user = await getUser();
  if (!user) redirect("/login");
  return user;
}
