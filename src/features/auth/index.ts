/**
 * Public surface of the auth feature. Client-safe exports only; `server.ts`
 * (session helpers) is server-only and imported by path from server code.
 */
export * from "./schema";
export * from "./actions";
export * from "./components";
