"use client";

import {
  Anchor,
  AppShell,
  AppShellHeader,
  AppShellMain,
  AppShellNavbar,
  AppShellSection,
  Container,
  ScrollArea,
  Tooltip,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Link from "next/link";
import type { ReactNode } from "react";

import { ShellHeader } from "./shell-header";
import { SidebarNav } from "./sidebar-nav";

export function AppShellFrame({ children }: { children: ReactNode }) {
  const [mobileOpened, { toggle: toggleMobile, close: closeMobile }] =
    useDisclosure(false);
  const [desktopCollapsed, { toggle: toggleDesktop }] = useDisclosure(false);
  const iconOnly = desktopCollapsed && !mobileOpened;

  return (
    <AppShell
      layout="alt"
      header={{ height: 56 }}
      navbar={{
        width: iconOnly ? 72 : 268,
        breakpoint: "sm",
        collapsed: { mobile: !mobileOpened },
      }}
      padding="md"
    >
      <AppShellHeader>
        <ShellHeader
          iconOnly={iconOnly}
          mobileOpened={mobileOpened}
          onToggleMobile={toggleMobile}
          onToggleDesktop={toggleDesktop}
          onNavigate={closeMobile}
        />
      </AppShellHeader>
      <AppShellNavbar p={iconOnly ? "xs" : "md"}>
        <AppShellSection mb="sm">
          <Tooltip label="Beacon Portal" position="right" disabled={!iconOnly}>
            <Anchor
              component={Link}
              href="/issues"
              underline="never"
              c="inherit"
              fw={600}
              size="sm"
              ta={iconOnly ? "center" : "left"}
              display="block"
              onClick={closeMobile}
            >
              {iconOnly ? "BP" : "Beacon Portal"}
            </Anchor>
          </Tooltip>
        </AppShellSection>
        <AppShellSection grow component={ScrollArea} type="auto">
          <SidebarNav iconOnly={iconOnly} onNavigate={closeMobile} />
        </AppShellSection>
      </AppShellNavbar>
      <AppShellMain>
        <Container size="lg">{children}</Container>
      </AppShellMain>
    </AppShell>
  );
}
