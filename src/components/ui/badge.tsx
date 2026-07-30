import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * Badge — compact status label. Includes the three verdict-semantic variants
 * (`clear`, `caution`, `flag`) that encode Verdikt's core product signal, so
 * status is always rendered consistently across the app.
 */
const badgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap transition-colors [&>svg]:size-3",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        outline: "text-foreground",
        clear:
          "border-transparent bg-verdict-clear/15 text-verdict-clear [a&]:hover:bg-verdict-clear/25",
        caution:
          "border-transparent bg-verdict-caution/15 text-verdict-caution [a&]:hover:bg-verdict-caution/25",
        flagged:
          "border-transparent bg-verdict-flag/15 text-verdict-flag [a&]:hover:bg-verdict-flag/25",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span";
  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
