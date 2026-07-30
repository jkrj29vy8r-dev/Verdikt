import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Compose Tailwind class names with conditional logic, resolving conflicts so
 * the last-wins rule works predictably (e.g. `cn("p-2", cond && "p-4")`).
 *
 * This is the single className helper for the entire codebase — every
 * component's `className` prop should be funnelled through it.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
