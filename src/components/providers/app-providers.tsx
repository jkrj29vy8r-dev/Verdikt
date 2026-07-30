"use client";

import * as React from "react";

import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "./theme-provider";

/**
 * AppProviders — the single client boundary that installs app-wide context.
 *
 * Mounted once in the root layout. Keeping every global provider composed here
 * (rather than nesting them in the layout) means the server layout stays a
 * Server Component and there is exactly one place to add cross-cutting context.
 */
export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <TooltipProvider>
        {children}
        <Toaster position="bottom-right" richColors />
      </TooltipProvider>
    </ThemeProvider>
  );
}
