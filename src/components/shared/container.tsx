import * as React from "react";
import { Slot } from "@radix-ui/react-slot";

import { cn } from "@/lib/utils";

const widths = {
  narrow: "max-w-3xl",
  default: "max-w-6xl",
  wide: "max-w-7xl",
  full: "max-w-none",
} as const;

interface ContainerProps extends React.ComponentProps<"div"> {
  width?: keyof typeof widths;
  asChild?: boolean;
}

/**
 * Container — horizontal rhythm primitive. Centralizes max-width and gutter so
 * every surface aligns to the same measure. Never hardcode `max-w-*` + `mx-auto`
 * in a page; reach for this.
 */
export function Container({
  className,
  width = "default",
  asChild = false,
  ...props
}: ContainerProps) {
  const Comp = asChild ? Slot : "div";
  return (
    <Comp
      className={cn("mx-auto w-full px-6 md:px-8", widths[width], className)}
      {...props}
    />
  );
}
