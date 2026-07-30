"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "motion/react";

import { cn } from "@/lib/utils";
import { formatRelativeTime } from "@/lib/utils";
import { duration, easing } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/hooks";
import { GlassPanel, PanelHeading } from "@/components/shared";

import type { FleetActivity } from "../../dashboard";
import { STATUS_DOT, STATUS_TEXT } from "./status-visuals";

/**
 * FleetTimeline — the most recent verdicts as a live activity spine.
 *
 * A vertical timeline with status-colored nodes on a connecting line; entries
 * cascade in on view. Real entries link to their report; sample entries render
 * inert (`linkable={false}`) so a preview never leads to a dead page.
 */
export function FleetTimeline({
  timeline,
  linkable = true,
}: {
  timeline: FleetActivity[];
  linkable?: boolean;
}) {
  const reduced = usePrefersReducedMotion();

  return (
    <GlassPanel className="flex h-full flex-col">
      <PanelHeading eyebrow="Activity" title="Fleet timeline" />

      <ol className="relative flex-1 space-y-4">
        {/* Connecting spine */}
        <span
          aria-hidden
          className="absolute top-1.5 bottom-1.5 left-[5px] w-px bg-border"
        />

        {timeline.map((item, i) => {
          const inner = (
            <>
              <span className="min-w-0">
                <span className="block truncate text-sm font-medium">
                  {item.title}
                </span>
                <span className="text-xs text-muted-foreground">
                  {formatRelativeTime(item.createdAt)}
                </span>
              </span>
              {item.score !== null && item.status !== null ? (
                <span
                  className={cn(
                    "tabular text-sm font-semibold",
                    STATUS_TEXT[item.status],
                  )}
                >
                  {item.score}
                </span>
              ) : (
                <span className="text-xs text-muted-foreground">·</span>
              )}
            </>
          );

          return (
            <motion.li
              key={item.id + item.createdAt}
              className="relative pl-6"
              initial={reduced ? false : { opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{
                duration: duration.base,
                ease: easing.outExpo,
                delay: reduced ? 0 : i * 0.06,
              }}
            >
              <span
                className={cn(
                  "absolute top-1 left-0 size-[11px] rounded-full ring-4 ring-background",
                  item.status ? STATUS_DOT[item.status] : "bg-muted-foreground",
                )}
                aria-hidden
              />
              {linkable ? (
                <Link
                  href={`/reports/${item.id}`}
                  className="-m-1 flex items-start justify-between gap-3 rounded-md p-1 transition-colors outline-none hover:bg-foreground/[0.04] focus-visible:ring-[3px] focus-visible:ring-ring/50"
                >
                  {inner}
                </Link>
              ) : (
                <div className="flex items-start justify-between gap-3">
                  {inner}
                </div>
              )}
            </motion.li>
          );
        })}
      </ol>
    </GlassPanel>
  );
}
