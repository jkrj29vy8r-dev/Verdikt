"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { appNav } from "@/config/navigation";
import { Logo } from "./logo";

/**
 * AppSidebar — primary navigation for the authenticated app. Driven by
 * `appNav`; highlights the active route via `usePathname`. Client-only for the
 * active-state read; contains no data fetching.
 */
export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar md:flex">
      <div className="flex h-16 items-center px-6">
        <Link href="/dashboard" aria-label="Verdikt dashboard">
          <Logo />
        </Link>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
        {appNav.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
              )}
            >
              {Icon ? <Icon className="size-4 shrink-0" /> : null}
              {item.title}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
