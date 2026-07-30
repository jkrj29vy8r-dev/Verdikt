import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * GlassPanel — the command center's structural unit.
 *
 * A frosted, hairline-bordered surface that floats above the obsidian canvas: a
 * faint top sheen sells the "pane of glass," and `interactive` adds a subtle
 * lift on hover so the panel feels physical. Deliberately not a `Card` — the
 * dashboard is a command center, not a stack of boxes. Server-safe (pure
 * styling); interactive content mounts as its own client island inside.
 */
export function GlassPanel({
  className,
  interactive = false,
  children,
  ...props
}: React.ComponentProps<"div"> & { interactive?: boolean }) {
  return (
    <div
      className={cn(
        "surface-glass border-hairline relative overflow-hidden rounded-2xl border p-5",
        interactive &&
          "transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_0_40px_-14px_var(--signature)]",
        className,
      )}
      {...props}
    >
      {/* Top edge sheen — the glass highlight. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-foreground/15 to-transparent"
      />
      {children}
    </div>
  );
}

/**
 * PanelHeading — the consistent header inside a GlassPanel: an eyebrow label,
 * an optional trailing slot (a live pulse, a control), and optional supporting
 * text. Keeps every widget's chrome identical.
 */
export function PanelHeading({
  eyebrow,
  title,
  trailing,
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  trailing?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn("mb-4 flex items-start justify-between gap-3", className)}
    >
      <div className="flex flex-col gap-0.5">
        {eyebrow ? (
          <span className="text-[0.7rem] font-medium tracking-[0.14em] text-muted-foreground uppercase">
            {eyebrow}
          </span>
        ) : null}
        <span className="text-sm font-semibold tracking-tight">{title}</span>
      </div>
      {trailing}
    </div>
  );
}

/**
 * LivePulse — a small "online / live" indicator: a dot with a soft expanding
 * ring. The ring animation is CSS `animate-ping`, so reduced-motion users get a
 * steady dot with no pulsing.
 */
export function LivePulse({
  label = "Live",
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-[0.7rem] font-medium tracking-wide text-verdict-clear uppercase",
        className,
      )}
    >
      <span className="relative flex size-2">
        <span className="absolute inline-flex size-full rounded-full bg-verdict-clear opacity-60 motion-safe:animate-ping" />
        <span className="relative inline-flex size-2 rounded-full bg-verdict-clear" />
      </span>
      {label}
    </span>
  );
}
