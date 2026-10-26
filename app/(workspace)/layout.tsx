import type { ReactNode } from "react";

import { AppShellFrame } from "@/modules/issues/components/app-shell-frame";

export default function WorkspaceLayout({ children }: { children: ReactNode }) {
  return <AppShellFrame>{children}</AppShellFrame>;
}
