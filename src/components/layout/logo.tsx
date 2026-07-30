import * as React from "react";

import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";

/**
 * Brand mark. A faceted azure diamond with an embedded verdict tick — the
 * single canonical logo. Use `iconOnly` for compact placements (favicon,
 * mobile). The gradient references the signature tokens for theme cohesion.
 */
export function Logo({
  className,
  iconOnly = false,
}: {
  className?: string;
  iconOnly?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <svg
        viewBox="0 0 32 32"
        role="img"
        aria-label={`${siteConfig.name} logo`}
        className="size-7 shrink-0"
      >
        <defs>
          <linearGradient id="verdikt-mark" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--signature)" />
            <stop offset="100%" stopColor="var(--signature-2)" />
          </linearGradient>
        </defs>
        <path
          d="M16 2 3 9v14l13 7 13-7V9L16 2Z"
          fill="url(#verdikt-mark)"
          opacity="0.18"
        />
        <path
          d="M16 2 3 9v14l13 7 13-7V9L16 2Z"
          fill="none"
          stroke="url(#verdikt-mark)"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path
          d="m11 16 3.5 3.5L21 12"
          fill="none"
          stroke="url(#verdikt-mark)"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {iconOnly ? (
        <span className="sr-only">{siteConfig.name}</span>
      ) : (
        <span className="text-lg font-semibold tracking-tight">
          {siteConfig.name}
        </span>
      )}
    </span>
  );
}
