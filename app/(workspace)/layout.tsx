import { cookies } from "next/headers";
import { Suspense, type ReactNode } from "react";

import { WorkspaceShell } from "@/modules/projects/components/workspace-shell";
import { ProjectSettingsProvider } from "@/modules/projects/components/project-settings-provider";
import {
  parseSidebarCollapsed,
  sidebarCollapsedCookie,
} from "@/modules/projects/lib/sidebar-preference";
import { SupportProvider } from "@/modules/support/components/support-provider";
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
    <SupportProvider>
      <ProjectSettingsProvider>
        <Suspense fallback={<WorkspaceShellSkeleton />}>
          <WorkspaceShell initialDesktopCollapsed={initialDesktopCollapsed}>
            {children}
          </WorkspaceShell>
        </Suspense>
      </ProjectSettingsProvider>
    </SupportProvider>
  );
}
