/**
 * Presentation formatters. Pure, locale-aware, and side-effect free so they are
 * safe to call from both server and client components.
 */

const USD = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const NUMBER = new Intl.NumberFormat("en-US");

/** Format a whole-dollar valuation, e.g. 28450 → "$28,450". */
export function formatCurrency(value: number): string {
  return USD.format(value);
}

/** Format mileage with a unit, e.g. 84200 → "84,200 mi". */
export function formatMileage(miles: number): string {
  return `${NUMBER.format(miles)} mi`;
}

/** Group a raw VIN for legibility, e.g. "1HGCM82633A004352" → "1HGCM8 2633 A004352". */
export function formatVin(vin: string): string {
  const clean = vin.toUpperCase().replace(/[^A-HJ-NPR-Z0-9]/g, "");
  if (clean.length !== 17) return clean;
  return `${clean.slice(0, 6)} ${clean.slice(6, 10)} ${clean.slice(10)}`;
}

/** Human date, e.g. "Jul 30, 2026". */
export function formatDate(input: string | number | Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(input));
}

/** Compact relative time, e.g. "3 days ago". */
export function formatRelativeTime(input: string | number | Date): string {
  const rtf = new Intl.RelativeTimeFormat("en-US", { numeric: "auto" });
  const diffMs = new Date(input).getTime() - Date.now();
  const divisions: [Intl.RelativeTimeFormatUnit, number][] = [
    ["year", 1000 * 60 * 60 * 24 * 365],
    ["month", 1000 * 60 * 60 * 24 * 30],
    ["day", 1000 * 60 * 60 * 24],
    ["hour", 1000 * 60 * 60],
    ["minute", 1000 * 60],
  ];
  for (const [unit, ms] of divisions) {
    if (Math.abs(diffMs) >= ms || unit === "minute") {
      return rtf.format(Math.round(diffMs / ms), unit);
    }
  }
  return "just now";
}

/** Clamp a numeric score to the 0–100 verdict scale. */
export function clampScore(score: number): number {
  return Math.max(0, Math.min(100, Math.round(score)));
}
