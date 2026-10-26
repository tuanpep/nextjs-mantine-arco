"use client";

import {
  ActionIcon,
  Avatar,
  Box,
  Burger,
  Group,
  Indicator,
  Menu,
  MenuDivider,
  MenuDropdown,
  MenuItem,
  MenuLabel,
  MenuTarget,
  TextInput,
  Tooltip,
  UnstyledButton,
  useMantineColorScheme,
} from "@mantine/core";
import {
  IconBell,
  IconComponents,
  IconLayoutSidebarLeftCollapse,
  IconLayoutSidebarLeftExpand,
  IconListDetails,
  IconMoon,
  IconSearch,
  IconSun,
} from "@tabler/icons-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { parseAsString, useQueryState } from "nuqs";
import { useState } from "react";

const notices = [
  {
    id: "SUP-1042",
    title: "Login fails after password reset",
    detail: "Status set to Open",
  },
  {
    id: "SUP-1038",
    title: "Export skips the last page",
    detail: "Status set to Waiting",
  },
] as const;

export function ShellHeader({
  iconOnly,
  mobileOpened,
  onToggleMobile,
  onToggleDesktop,
  onNavigate,
}: {
  iconOnly: boolean;
  mobileOpened: boolean;
  onToggleMobile: () => void;
  onToggleDesktop: () => void;
  onNavigate: () => void;
}) {
  const sidebarLabel = iconOnly ? "Expand sidebar" : "Collapse sidebar";

  return (
    <Box
      h="100%"
      px="md"
      style={{
        display: "grid",
        gridTemplateColumns:
          "minmax(0, 1fr) minmax(12rem, 26rem) minmax(0, 1fr)",
        alignItems: "center",
        columnGap: "var(--mantine-spacing-sm)",
      }}
    >
      <Group gap="sm" wrap="nowrap" justify="flex-start">
        <Burger
          opened={mobileOpened}
          onClick={onToggleMobile}
          hiddenFrom="sm"
          size="sm"
          aria-label={mobileOpened ? "Close navigation" : "Open navigation"}
        />
        <Tooltip label={sidebarLabel} position="bottom">
          <ActionIcon
            visibleFrom="sm"
            variant="subtle"
            color="gray"
            aria-label={sidebarLabel}
            onClick={onToggleDesktop}
          >
            {iconOnly ? (
              <IconLayoutSidebarLeftExpand size={18} />
            ) : (
              <IconLayoutSidebarLeftCollapse size={18} />
            )}
          </ActionIcon>
        </Tooltip>
      </Group>
      <IssueSearch onNavigate={onNavigate} />
      <HeaderActions />
    </Box>
  );
}

function IssueSearch({ onNavigate }: { onNavigate: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const [query, setQuery] = useQueryState(
    "q",
    parseAsString.withDefault("").withOptions({ shallow: false }),
  );

  function onQueryChange(value: string) {
    if (pathname !== "/issues") {
      router.push(value ? `/issues?q=${encodeURIComponent(value)}` : "/issues");
      onNavigate();
      return;
    }

    void setQuery(value || null);
  }

  return (
    <TextInput
      aria-label="Search issues"
      placeholder="Search issues"
      leftSection={<IconSearch size={16} />}
      value={query}
      onChange={(event) => onQueryChange(event.currentTarget.value)}
      w="100%"
    />
  );
}

function HeaderActions() {
  const { colorScheme, setColorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";
  const [unread, setUnread] = useState(notices.map((notice) => notice.id));
  const visibleNotices = notices.filter((notice) => unread.includes(notice.id));

  return (
    <Group gap="xs" wrap="nowrap" justify="flex-end">
      <Tooltip label={dark ? "Switch to light theme" : "Switch to dark theme"}>
        <ActionIcon
          variant="subtle"
          color="gray"
          aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
          onClick={() => setColorScheme(dark ? "light" : "dark")}
        >
          {dark ? <IconSun size={18} /> : <IconMoon size={18} />}
        </ActionIcon>
      </Tooltip>
      <Menu position="bottom-end" width={280}>
        <MenuTarget>
          <ActionIcon
            variant="subtle"
            color="gray"
            aria-label={
              visibleNotices.length > 0
                ? `Notifications, ${visibleNotices.length} unread`
                : "Notifications"
            }
          >
            <Indicator
              label={visibleNotices.length}
              disabled={visibleNotices.length === 0}
              size={16}
              offset={4}
            >
              <IconBell size={18} />
            </Indicator>
          </ActionIcon>
        </MenuTarget>
        <MenuDropdown>
          <MenuLabel>Notifications</MenuLabel>
          {visibleNotices.length === 0 ? (
            <MenuItem disabled>No new notifications</MenuItem>
          ) : (
            visibleNotices.map((notice) => (
              <MenuItem key={notice.id} onClick={() => setUnread([])}>
                {notice.title}
                <Box c="dimmed" fz="xs">
                  {notice.id} · {notice.detail}
                </Box>
              </MenuItem>
            ))
          )}
        </MenuDropdown>
      </Menu>
      <Menu position="bottom-end" width={220}>
        <MenuTarget>
          <UnstyledButton type="button" aria-label="Account menu">
            <Avatar color="blue" radius="xl">
              MC
            </Avatar>
          </UnstyledButton>
        </MenuTarget>
        <MenuDropdown>
          <MenuLabel>Mina Cho</MenuLabel>
          <MenuLabel>mina.cho@beacon.example</MenuLabel>
          <MenuDivider />
          <MenuItem
            component={Link}
            href="/issues"
            leftSection={<IconListDetails size={16} />}
          >
            Issues
          </MenuItem>
          <MenuItem
            component={Link}
            href="/showcase"
            leftSection={<IconComponents size={16} />}
          >
            Showcase
          </MenuItem>
        </MenuDropdown>
      </Menu>
    </Group>
  );
}
