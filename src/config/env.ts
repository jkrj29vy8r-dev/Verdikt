import { z } from "zod";

/**
 * Type-safe environment configuration.
 *
 * Every variable the app depends on is declared and validated here at module
 * load. Misconfiguration fails fast with a readable error at boot rather than
 * as a mysterious `undefined` deep in a request handler.
 *
 * Two schemas enforce the client/server boundary:
 *   • `clientEnv`  — only `NEXT_PUBLIC_*`; safe to ship to the browser.
 *   • `serverEnv`  — secrets; guarded so it can never be imported client-side.
 *
 * NOTE: `NEXT_PUBLIC_*` vars are inlined by the Next.js compiler, so they must
 * be referenced statically (never `process.env[key]`). Hence the explicit maps.
 */

const clientSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
});

const serverSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  ANTHROPIC_API_KEY: z.string().min(1),
  VIN_DATA_PROVIDER_API_KEY: z.string().min(1),
});

function formatIssues(error: z.ZodError): string {
  return error.issues
    .map((i) => `  • ${i.path.join(".")}: ${i.message}`)
    .join("\n");
}

const parsedClient = clientSchema.safeParse({
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
});

if (!parsedClient.success) {
  throw new Error(
    `❌ Invalid public environment variables:\n${formatIssues(parsedClient.error)}`,
  );
}

/** Validated variables that are safe to reference on the client. */
export const clientEnv = parsedClient.data;

/** Parsed once on first server-side access; see `getServerEnv`. */
let cachedServerEnv: z.infer<typeof serverSchema> | null = null;

/**
 * Validated server-only variables. Accessed lazily through a getter so that
 * merely importing this module in a client bundle never touches secrets.
 * Any client-side access throws immediately.
 */
export function getServerEnv(): z.infer<typeof serverSchema> {
  if (typeof window !== "undefined") {
    throw new Error(
      "getServerEnv() was called in the browser. Server secrets must never reach client code.",
    );
  }
  if (cachedServerEnv) return cachedServerEnv;

  const parsed = serverSchema.safeParse(process.env);
  if (!parsed.success) {
    throw new Error(
      `❌ Invalid server environment variables:\n${formatIssues(parsed.error)}`,
    );
  }
  cachedServerEnv = parsed.data;
  return cachedServerEnv;
}
