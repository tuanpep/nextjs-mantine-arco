import { Suspense, type ReactNode } from "react";

import { WorkspaceShell } from "@/modules/projects/components/workspace-shell";
import { SupportProvider } from "@/modules/support/components/support-provider";
import WorkspaceLoading from "./loading";

export default function WorkspaceLayout({ children }: { children: ReactNode }) {
  return (
    <SupportProvider>
      <Suspense fallback={<WorkspaceLoading />}>
        <WorkspaceShell>{children}</WorkspaceShell>
      </Suspense>
    </SupportProvider>
  );
}
