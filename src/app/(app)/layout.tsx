import { requireUser } from "@/features/auth/server";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { UserMenu } from "@/components/layout/user-menu";
import { ThemeToggle } from "@/components/layout/theme-toggle";

/**
 * Authenticated app shell.
 *
 * `requireUser()` here is the authoritative gate — middleware provides the fast
 * redirect for UX, but enforcing it in the layout guarantees every nested route
 * has a user, so pages can assume authentication. The email is read once here
 * and handed to the (client) user menu as a prop.
 */
export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();

  return (
    <div className="flex min-h-dvh">
      <AppSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="border-hairline surface-glass sticky top-0 z-40 flex h-16 items-center justify-end gap-2 border-b px-6">
          <ThemeToggle />
          <UserMenu email={user.email ?? "account"} />
        </header>
        <main className="flex-1 p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}
