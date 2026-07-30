import * as React from "react";
import Link from "next/link";

import { siteConfig } from "@/config/site";
import { footerNav } from "@/config/navigation";
import { Container } from "@/components/shared/container";
import { Logo } from "./logo";

/**
 * SiteFooter — marketing footer. Link columns come from `footerNav`, keeping
 * this component structural only.
 */
export function SiteFooter() {
  return (
    <footer className="border-hairline border-t py-16">
      <Container>
        <div className="grid grid-cols-2 gap-10 md:grid-cols-5">
          <div className="col-span-2 flex flex-col gap-4">
            <Logo />
            <p className="max-w-xs text-sm text-pretty text-muted-foreground">
              {siteConfig.description}
            </p>
          </div>

          {footerNav.map((column) => (
            <div key={column.heading} className="flex flex-col gap-3">
              <h3 className="text-sm font-semibold">{column.heading}</h3>
              <ul className="flex flex-col gap-2">
                {column.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-hairline mt-12 flex flex-col items-center justify-between gap-4 border-t pt-8 text-sm text-muted-foreground sm:flex-row">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <p>{siteConfig.tagline}</p>
        </div>
      </Container>
    </footer>
  );
}
