/**
 * Cross-cutting TypeScript utilities used throughout the app. Domain types live
 * with their feature (e.g. `features/vehicle-intelligence/types`); only truly
 * global, feature-agnostic types belong here.
 */

/** A value that may be absent. */
export type Nullable<T> = T | null;

/** Make selected keys optional. */
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/** Make selected keys required. */
export type RequiredBy<T, K extends keyof T> = Omit<T, K> &
  Required<Pick<T, K>>;

/**
 * Discriminated result type for operations that can fail without throwing.
 * Encourages explicit, exhaustive error handling at call sites.
 */
export type Result<T, E = Error> =
  { ok: true; data: T } | { ok: false; error: E };

export const ok = <T>(data: T): Result<T, never> => ({ ok: true, data });
export const err = <E>(error: E): Result<never, E> => ({ ok: false, error });

/** Standard shape for paginated collections. */
export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

/** Loading/async state machine for client data. */
export type AsyncState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; error: string };
