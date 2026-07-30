import * as React from "react";

import { cn } from "@/lib/utils";
import { Container } from "./container";

interface SectionProps extends React.ComponentProps<"section"> {
  /** Constrain inner content to a Container width, or `false` for full-bleed. */
  container?: React.ComponentProps<typeof Container>["width"] | false;
}

/**
 * Section — vertical rhythm primitive. Applies the consistent block spacing used
 * between page sections and, by default, wraps children in a Container. Compose
 * with `<SectionHeading>` for a titled block.
 */
export function Section({
  className,
  container = "default",
  children,
  ...props
}: SectionProps) {
  return (
    <section className={cn("py-20 md:py-28", className)} {...props}>
      {container === false ? (
        children
      ) : (
        <Container width={container}>{children}</Container>
      )}
    </section>
  );
}

interface SectionHeadingProps extends Omit<
  React.ComponentProps<"div">,
  "title"
> {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
}

/** A titled section header: eyebrow, heading, and supporting copy. */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
  ...props
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" && "items-center text-center",
        className,
      )}
      {...props}
    >
      {eyebrow ? (
        <span className="text-sm font-medium tracking-wide text-primary uppercase">
          {eyebrow}
        </span>
      ) : null}
      <h2 className="text-3xl font-semibold tracking-tight text-balance md:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="max-w-2xl text-lg text-pretty text-muted-foreground">
          {description}
        </p>
      ) : null}
    </div>
  );
}
