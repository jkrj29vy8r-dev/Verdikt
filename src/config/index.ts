/**
 * Application configuration surface. Import app-wide constants from `@/config`.
 * (Environment access is intentionally exported both here and directly from
 * `@/config/env` for call sites that only need env.)
 */
export * from "./site";
export * from "./navigation";
export { clientEnv } from "./env";
