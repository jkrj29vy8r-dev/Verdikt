/**
 * Public surface of the vehicle-intelligence feature.
 *
 * Exposes only the CLIENT-SAFE API: components, server actions (safe to import
 * from client code), schema, types, and hooks. Server-only modules
 * (`services/*`, `synthesis`) are intentionally NOT re-exported here — server
 * code imports them by path, which keeps them out of client bundles by
 * construction.
 */
export * from "./types";
export * from "./schema";
export * from "./constants";
export * from "./actions";
export * from "./components";
export { useVinInput } from "./hooks/use-vin-input";
export { useVerdictLoading } from "./hooks/use-verdict-loading";
