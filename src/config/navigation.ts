import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Search,
  FileText,
  Star,
  Settings,
} from "lucide-react";

/**
 * Navigation is data, not markup. Declaring routes here keeps the shell
 * components (header, sidebar, command menu, footer) purely presentational and
 * lets us reason about the information architecture in one glance.
 */

export interface NavItem {
  title: string;
  href: string;
  icon?: LucideIcon;
  description?: string;
  external?: boolean;
}

/** Top-level marketing navigation. */
export const marketingNav: NavItem[] = [
  { title: "Product", href: "/#product" },
  { title: "Intelligence", href: "/#intelligence" },
  { title: "Pricing", href: "/#pricing" },
  { title: "Company", href: "/#company" },
];

/** Authenticated application sidebar. */
export const appNav: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    description: "Your intelligence overview",
  },
  {
    title: "Decode",
    href: "/decode",
    icon: Search,
    description: "Run a new vehicle verdict",
  },
  {
    title: "Reports",
    href: "/reports",
    icon: FileText,
    description: "Saved verdicts & history",
  },
  {
    title: "Watchlist",
    href: "/watchlist",
    icon: Star,
    description: "Vehicles you are tracking",
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
    description: "Account & preferences",
  },
];

/** Footer link columns. */
export const footerNav: { heading: string; items: NavItem[] }[] = [
  {
    heading: "Product",
    items: [
      { title: "Overview", href: "/#product" },
      { title: "Intelligence Engine", href: "/#intelligence" },
      { title: "Pricing", href: "/#pricing" },
    ],
  },
  {
    heading: "Company",
    items: [
      { title: "About", href: "/about" },
      { title: "Careers", href: "/careers" },
      { title: "Contact", href: "/contact" },
    ],
  },
  {
    heading: "Legal",
    items: [
      { title: "Privacy", href: "/privacy" },
      { title: "Terms", href: "/terms" },
    ],
  },
];
