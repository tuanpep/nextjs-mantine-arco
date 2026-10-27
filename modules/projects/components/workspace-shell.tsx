"use client";

import {
  ActionIcon,
  Anchor,
  AppShell,
  Avatar,
  Box,
  Burger,
  Group,
  NavLink,
  NativeSelect,
  Stack,
  Text,
  Tooltip,
  useMantineColorScheme,
} from "@mantine/core";
import { useDisclosure, useMounted } from "@mantine/hooks";
import {
  IconLifebuoy,
  IconBulb,
  IconMoon,
  IconSun,
  IconChevronRight,
  IconChecklist,
  IconSettings,
  IconMessageCircle,
  IconHome,
  IconLayoutDashboard,
  IconLayoutSidebarLeftCollapse,
  IconLayoutSidebarLeftExpand,
} from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "nextjs-toploader/app";
import { useState, useTransition, type ReactNode } from "react";

import { setLocale } from "@/lib/i18n/actions";
import { AccountMenu } from "@/modules/account/components/account-menu";

import {
  applicationPath,
  applications,
  getApplication,
  projectSectionPath,
} from "../lib/applications";
import { writeSidebarCollapsedCookie } from "../lib/sidebar-preference";

export function WorkspaceShell({
  children,
  initialDesktopCollapsed = false,
}: {
  children: ReactNode;
  initialDesktopCollapsed?: boolean;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const application = pathname.startsWith("/projects/")
    ? getApplication(pathname.split("/")[2] ?? "")
    : undefined;
  const productPath = application ? `/projects/${application.id}` : undefined;
  const homeHref = "/";
  const overviewHref = application
    ? applicationPath(application.id)
    : undefined;
  const settingsHref = productPath ? `${productPath}/settings` : undefined;
  const t = useTranslations("Workspace");
  const locale = useLocale();
  const [pending, startTransition] = useTransition();
  const [languageError, setLanguageError] = useState(false);
  const [opened, { toggle, close }] = useDisclosure();
  const [desktopCollapsed, setDesktopCollapsed] = useState(
    initialDesktopCollapsed,
  );
  const mounted = useMounted();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const projectLinks = productPath
    ? [
        {
          label: t("support"),
          href: `${productPath}/support`,
          icon: IconLifebuoy,
        },
        {
          label: t("feedback"),
          href: `${productPath}/feedback`,
          icon: IconMessageCircle,
        },
        {
          label: t("ideas"),
          href: `${productPath}/ideas`,
          icon: IconBulb,
        },
        {
          label: t("uat"),
          href: `${productPath}/uat`,
          icon: IconChecklist,
        },
      ]
    : [];
  const isSectionActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);
  const isHomeActive = pathname === "/";
  const isOverviewActive = Boolean(overviewHref && pathname === overviewHref);

  function toggleDesktopSidebar() {
    setDesktopCollapsed((current) => {
      const next = !current;
      writeSidebarCollapsedCookie(next);
      return next;
    });
  }

  return (
    <AppShell
      header={{ height: 48 }}
      navbar={{
        width: 232,
        breakpoint: "lg",
        collapsed: { mobile: !opened, desktop: desktopCollapsed },
      }}
      padding={0}
    >
      <Anchor
        href="#main-content"
        size="sm"
        style={{
          position: "absolute",
          left: 16,
          top: 8,
          zIndex: 1000,
          transform: "translateY(-200%)",
        }}
        styles={{
          root: {
            "&:focus": {
              transform: "translateY(0)",
              background: "var(--mantine-color-body)",
              padding: "4px 8px",
              borderRadius: "var(--mantine-radius-md)",
            },
          },
        }}
      >
        {t("skipToContent")}
      </Anchor>
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between" wrap="nowrap" gap="xs">
          <Group gap="sm" wrap="nowrap" style={{ minWidth: 0 }}>
            <Burger
              hiddenFrom="lg"
              opened={opened}
              disabled={!mounted}
              onClick={toggle}
              aria-label={opened ? t("closeNavigation") : t("openNavigation")}
              size="sm"
            />
            <Tooltip
              label={desktopCollapsed ? t("showSidebar") : t("hideSidebar")}
            >
              <ActionIcon
                visibleFrom="lg"
                variant="subtle"
                c="dimmed"
                disabled={!mounted}
                onClick={toggleDesktopSidebar}
                aria-label={
                  desktopCollapsed ? t("showSidebar") : t("hideSidebar")
                }
              >
                {desktopCollapsed ? (
                  <IconLayoutSidebarLeftExpand size={18} />
                ) : (
                  <IconLayoutSidebarLeftCollapse size={18} />
                )}
              </ActionIcon>
            </Tooltip>
            <Anchor
              component={Link}
              href={homeHref}
              c="inherit"
              underline="never"
            >
              <Group gap="xs" wrap="nowrap">
                <IconLifebuoy size={22} color="var(--mantine-color-violet-6)" />
                <Text fw={600} size="md">
                  DX Portal
                </Text>
              </Group>
            </Anchor>
            {application ? (
              <Group
                gap="xs"
                visibleFrom="lg"
                wrap="nowrap"
                style={{ minWidth: 0 }}
              >
                <IconChevronRight
                  size={14}
                  color="var(--mantine-color-dimmed)"
                />
                <NativeSelect
                  disabled={!mounted}
                  aria-label={t("switchProject")}
                  value={application.id}
                  size="xs"
                  w={160}
                  data={applications.map((item) => ({
                    value: item.id,
                    label: item.name,
                  }))}
                  onChange={(event) => {
                    router.push(
                      projectSectionPath(event.currentTarget.value, pathname),
                    );
                    close();
                  }}
                />
              </Group>
            ) : null}
          </Group>
          <Group gap="sm" wrap="nowrap">
            <NativeSelect
              aria-label={t("language")}
              value={locale}
              disabled={pending}
              size="xs"
              w={110}
              data={[
                { value: "vi", label: "Tiếng Việt" },
                { value: "en", label: "English" },
              ]}
              onChange={(event) => {
                const nextLocale = event.currentTarget.value;
                setLanguageError(false);
                startTransition(async () => {
                  try {
                    await setLocale(nextLocale);
                  } catch {
                    setLanguageError(true);
                  }
                });
              }}
            />
            <ActionIcon
              variant="subtle"
              c="dimmed"
              onClick={toggleColorScheme}
              aria-label={
                colorScheme === "dark" ? t("lightTheme") : t("darkTheme")
              }
            >
              {colorScheme === "dark" ? (
                <IconSun size={18} />
              ) : (
                <IconMoon size={18} />
              )}
            </ActionIcon>
            <AccountMenu />
          </Group>
        </Group>
      </AppShell.Header>
      <AppShell.Navbar
        p="xs"
        component="nav"
        aria-label={t("mainNavigation")}
        bg="var(--gl-bg-canvas)"
      >
        <Stack h="100%" gap="sm" style={{ overflowY: "auto" }}>
          <Stack gap={2} style={{ flexShrink: 0 }}>
            <NavLink
              component={Link}
              href={homeHref}
              label={t("home")}
              leftSection={<IconHome size={18} />}
              active={isHomeActive}
              aria-current={isHomeActive ? "page" : undefined}
              onClick={close}
              py={7}
            />
          </Stack>
          {application && overviewHref && settingsHref ? (
            <>
              <Group px="sm" py="md" gap="sm" wrap="nowrap" hiddenFrom="lg">
                <Avatar color="blue" size={32}>
                  {application.initials}
                </Avatar>
                <Box style={{ minWidth: 0, flex: 1 }}>
                  <Text fw={600} size="sm" truncate>
                    {application.name}
                  </Text>
                  <NativeSelect
                    disabled={!mounted}
                    aria-label={t("switchProject")}
                    value={application.id}
                    mt="xs"
                    data={applications.map((item) => ({
                      value: item.id,
                      label: item.name,
                    }))}
                    onChange={(event) => {
                      router.push(
                        projectSectionPath(event.currentTarget.value, pathname),
                      );
                      close();
                    }}
                  />
                </Box>
              </Group>
              <Stack gap={2} style={{ flexShrink: 0 }}>
                <NavLink
                  component={Link}
                  href={overviewHref}
                  label={t("overview")}
                  leftSection={<IconLayoutDashboard size={18} />}
                  active={isOverviewActive}
                  aria-current={isOverviewActive ? "page" : undefined}
                  onClick={close}
                  py={7}
                />
              </Stack>
              <Text size="xs" fw={600} c="dimmed" px="sm" pt="xs">
                {t("workItems")}
              </Text>
              <Stack gap={2} style={{ flexShrink: 0 }}>
                {projectLinks.map(({ label, href, icon: Icon }) => {
                  const active = isSectionActive(href);
                  return (
                    <NavLink
                      key={href}
                      component={Link}
                      href={href}
                      label={label}
                      leftSection={<Icon size={18} />}
                      active={active}
                      aria-current={active ? "page" : undefined}
                      onClick={close}
                      py={7}
                    />
                  );
                })}
              </Stack>
              <Box mt="auto" pt="sm" style={{ flexShrink: 0 }}>
                <NavLink
                  component={Link}
                  href={settingsHref}
                  label={t("settings")}
                  leftSection={<IconSettings size={18} />}
                  active={isSectionActive(settingsHref)}
                  aria-current={
                    isSectionActive(settingsHref) ? "page" : undefined
                  }
                  onClick={close}
                  py={7}
                />
              </Box>
            </>
          ) : (
            <>
              <Text size="xs" fw={600} c="dimmed" px="sm" pt="xs">
                {t("projects")}
              </Text>
              <Stack gap={2} style={{ flexShrink: 0 }}>
                {applications.map((item) => {
                  const href = applicationPath(item.id);
                  return (
                    <NavLink
                      key={item.id}
                      component={Link}
                      href={href}
                      label={item.name}
                      leftSection={
                        <Avatar color="blue" size={22}>
                          {item.initials}
                        </Avatar>
                      }
                      onClick={close}
                      py={7}
                    />
                  );
                })}
              </Stack>
            </>
          )}
        </Stack>
      </AppShell.Navbar>
      <AppShell.Main id="main-content" component="main">
        {languageError && (
          <Text role="alert" c="red" size="sm" px="md" pt="md">
            {t("languageError")}
          </Text>
        )}
        {children}
      </AppShell.Main>
    </AppShell>
  );
}
