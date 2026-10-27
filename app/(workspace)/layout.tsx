import { cookies } from "next/headers";
import { Suspense, type ReactNode } from "react";

import { WorkspaceShell } from "@/modules/projects/components/workspace-shell";
import {
  parseSidebarCollapsed,
  sidebarCollapsedCookie,
} from "@/modules/projects/lib/sidebar-preference";
import { SupportProvider } from "@/modules/support/components/support-provider";
import WorkspaceLoading from "./loading";

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
    <SupportProvider>
      <Suspense fallback={<WorkspaceLoading />}>
        <WorkspaceShell initialDesktopCollapsed={initialDesktopCollapsed}>
          {children}
        </WorkspaceShell>
      </Suspense>
    </SupportProvider>
  );
}
