import * as React from "react";
import Link from "next/link";

import { marketingNav } from "@/config/navigation";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/container";
import { Logo } from "./logo";
import { ThemeToggle } from "./theme-toggle";

/**
 * SiteHeader — marketing shell chrome. Sticky, frosted, and driven entirely by
 * the `marketingNav` config so information architecture lives as data. Purely
 * presentational: no data fetching, safe as a Server Component.
 */
export function SiteHeader() {
  return (
    <header className="border-hairline surface-glass sticky top-0 z-50 border-b">
      <Container asChild>
        <div className="flex h-16 items-center justify-between">
          <Link href="/" aria-label="Verdikt home">
            <Logo />
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {marketingNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.title}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="hidden sm:inline-flex"
            >
              <Link href="/login">Sign in</Link>
            </Button>
            <Button variant="signature" size="sm" asChild>
              <Link href="/decode">Run a verdict</Link>
            </Button>
          </div>
        </div>
      </Container>
    </header>
  );
}
