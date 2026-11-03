import { cookies } from "next/headers";
import { Suspense, type ReactNode } from "react";

import { PortalProvider } from "@/modules/portal/components/portal-provider";
import { WorkspaceShell } from "@/modules/projects/components/workspace-shell";
import {
  parseSidebarCollapsed,
  sidebarCollapsedCookie,
} from "@/modules/projects/lib/sidebar-preference";
import { WorkspaceShellSkeleton } from "@/modules/ui/components/page-skeletons";

export default async function WorkspaceLayout({
  children,
}: {
  children: ReactNode;
}) {
  const store = await cookies();
  const initialDesktopCollapsed = parseSidebarCollapsed(
    store.get(sidebarCollapsedCookie)?.value,
  );

  return (
    <PortalProvider>
      <Suspense fallback={<WorkspaceShellSkeleton />}>
        <WorkspaceShell initialDesktopCollapsed={initialDesktopCollapsed}>
          {children}
        </WorkspaceShell>
      </Suspense>
    </PortalProvider>
  );
}
