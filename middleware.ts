import type { NextRequest } from "next/server";

import { updateSession } from "@/lib/supabase/middleware";

/** Route prefixes that require an authenticated session. */
const PROTECTED_PREFIXES = [
  "/dashboard",
  "/decode",
  "/reports",
  "/watchlist",
  "/settings",
];

export async function middleware(request: NextRequest) {
  return updateSession(request, PROTECTED_PREFIXES);
}

export const config = {
  /**
   * Run on every path except static assets and image optimization, so the auth
   * session is always fresh without paying the cost on immutable files.
   */
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif)$).*)",
  ],
};
