import type { ReactNode } from "react";

import { ComponentBookShell } from "@/modules/ui/component-book/component-book-shell";

export default function Layout({ children }: { children: ReactNode }) {
  return <ComponentBookShell>{children}</ComponentBookShell>;
}
