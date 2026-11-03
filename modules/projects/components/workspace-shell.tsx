"use client";

import {
  ActionIcon,
  Anchor,
  AppShell,
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
  IconBook,
  IconBulb,
  IconChevronRight,
  IconFolders,
  IconLayoutDashboard,
  IconLayoutSidebarLeftCollapse,
  IconLayoutSidebarLeftExpand,
  IconLifebuoy,
  IconMessages,
  IconMoon,
  IconSun,
} from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "nextjs-toploader/app";
import {
  useState,
  useTransition,
  type ComponentType,
  type ReactNode,
} from "react";

import { setLocale } from "@/lib/i18n/actions";
import { AccountMenu } from "@/modules/account/components/account-menu";
import { OpenRequestControl } from "@/modules/portal/components/open-request-panel";

import {
  applicationPath,
  applications,
  getApplication,
  projectSectionPath,
} from "../lib/applications";
import { writeSidebarCollapsedCookie } from "../lib/sidebar-preference";

import { NavGroup } from "./nav-group";
import { ProjectSwitcher } from "./project-switcher";

const projectOptions = applications.map((item) => ({
  value: item.id,
  label: item.name,
}));

type NavIcon = ComponentType<{ size?: number; "aria-hidden"?: boolean }>;

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
  const homeHref = "/";
  const t = useTranslations("Workspace");
  const portal = useTranslations("Portal");
  const locale = useLocale();
  const [pending, startTransition] = useTransition();
  const [languageError, setLanguageError] = useState(false);
  const [opened, { toggle, close }] = useDisclosure();
  const [desktopCollapsed, setDesktopCollapsed] = useState(
    initialDesktopCollapsed,
  );
  const mounted = useMounted();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const isHomeActive = pathname === "/";

  function destinationActive(href: string, exact = false) {
    if (exact) return pathname === href;
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  function toggleDesktopSidebar() {
    setDesktopCollapsed((current) => {
      const next = !current;
      writeSidebarCollapsedCookie(next);
      return next;
    });
  }

  function switchProject(projectId: string) {
    if (!getApplication(projectId)) return;
    router.push(projectSectionPath(projectId, pathname));
    close();
  }

  function sectionLink(
    href: string,
    label: string,
    exact = false,
    icon?: NavIcon,
  ) {
    const active = destinationActive(href, exact);
    const Icon = icon;
    return (
      <NavLink
        key={href}
        component={Link}
        href={href}
        label={label}
        leftSection={Icon ? <Icon size={16} aria-hidden /> : undefined}
        active={active}
        aria-current={active ? "page" : undefined}
        onNavigate={() => close()}
      />
    );
  }

  const base = application ? applicationPath(application.id) : "";

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
            <Group
              gap="xs"
              visibleFrom="lg"
              wrap="nowrap"
              style={{ minWidth: 0 }}
            >
              <IconChevronRight size={14} color="var(--mantine-color-dimmed)" />
              <ProjectSwitcher
                options={projectOptions}
                disabled={!mounted}
                label={application ? t("switchProject") : t("chooseProject")}
                placeholder={t("chooseProject")}
                nothingFound={t("noProjectsFound")}
                value={application?.id ?? ""}
                onChange={switchProject}
              />
            </Group>
          </Group>
          <Group gap="sm" wrap="nowrap">
            <Box hiddenFrom="lg">
              <OpenRequestControl
                projectId={application?.id ?? null}
                projectOptions={projectOptions}
              />
            </Box>
            <NativeSelect
              aria-label={t("language")}
              value={locale}
              disabled={!mounted || pending}
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
      <AppShell.Navbar p="xs" component="nav" aria-label={t("mainNavigation")}>
        <Stack h="100%" gap="sm">
          <Stack
            gap="sm"
            style={{
              flex: 1,
              minHeight: 0,
              overflowY: "auto",
              marginInlineStart: "calc(-1 * var(--mantine-spacing-xs))",
              paddingInlineStart: "var(--mantine-spacing-xs)",
            }}
          >
            {application && (
              <Box px="sm" py="xs">
                <Text visibleFrom="lg" size="sm" fw={600} truncate>
                  {application.name}
                </Text>
                <Box hiddenFrom="lg">
                  <ProjectSwitcher
                    options={projectOptions}
                    disabled={!mounted}
                    label={t("switchProject")}
                    placeholder={t("chooseProject")}
                    nothingFound={t("noProjectsFound")}
                    value={application.id}
                    fullWidth
                    onChange={switchProject}
                  />
                </Box>
              </Box>
            )}
            {!application && (
              <NavLink
                component={Link}
                href={homeHref}
                onNavigate={() => close()}
                label={t("projects")}
                leftSection={<IconFolders size={16} aria-hidden />}
                active={isHomeActive}
                aria-current={isHomeActive ? "page" : undefined}
              />
            )}
            {application && (
              <Stack gap={4}>
                {sectionLink(base, t("overview"), true, IconLayoutDashboard)}
                <NavGroup label={t("support")} icon={IconLifebuoy}>
                  {sectionLink(`${base}/support/bugs`, t("bugReports"))}
                  {sectionLink(`${base}/support/help`, t("help"))}
                </NavGroup>
                <NavGroup label={t("ideas")} icon={IconBulb}>
                  {sectionLink(`${base}/ideas/features`, t("featureRequests"))}
                  {sectionLink(`${base}/ideas/feedback`, t("feedback"))}
                </NavGroup>
                <NavLink
                  component={Link}
                  href={`${base}/guides`}
                  label={t("guides")}
                  leftSection={<IconBook size={16} aria-hidden />}
                  active={destinationActive(`${base}/guides`)}
                  aria-current={
                    destinationActive(`${base}/guides`) ? "page" : undefined
                  }
                  onNavigate={() => close()}
                />
                <NavLink
                  component={Link}
                  href={`${base}/discussions`}
                  label={t("discussions")}
                  leftSection={<IconMessages size={16} aria-hidden />}
                  active={destinationActive(`${base}/discussions`)}
                  aria-current={
                    destinationActive(`${base}/discussions`)
                      ? "page"
                      : undefined
                  }
                  onNavigate={() => close()}
                />
              </Stack>
            )}
          </Stack>
          <Box visibleFrom="lg">
            <OpenRequestControl
              projectId={application?.id ?? null}
              projectOptions={projectOptions}
              fullWidth
            />
          </Box>
        </Stack>
      </AppShell.Navbar>
      <AppShell.Main id="main-content" component="main">
        {languageError && (
          <Text role="alert" c="red" size="sm" px="md" pt="md">
            {t("languageError")}
          </Text>
        )}
        <Text
          size="sm"
          c="dimmed"
          px={{ base: "md", sm: "xl" }}
          pt="md"
          maw={1280}
          mx="auto"
        >
          {portal("demoNotice")}
        </Text>
        {children}
      </AppShell.Main>
    </AppShell>
  );
}
