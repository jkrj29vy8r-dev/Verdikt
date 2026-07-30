import type { Metadata } from "next";
import { Star } from "lucide-react";

import { requireUser } from "@/features/auth/server";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = { title: "Watchlist" };

/**
 * Watchlist — vehicles the user is tracking. Scaffolded surface: the
 * `watchlist_items` table, RLS, and DB types already exist, so this grows into
 * a full feature module (`features/watchlist`) following the same pattern as
 * vehicle-intelligence.
 */
export default async function WatchlistPage() {
  await requireUser();

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        title="Watchlist"
        description="Track vehicles and get alerted when the verdict changes."
      />
      <Card>
        <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
          <div className="grid size-12 place-items-center rounded-xl bg-primary/10 text-primary">
            <Star className="size-6" />
          </div>
          <p className="text-muted-foreground">
            Your watchlist is empty. Save a VIN to start tracking it.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
