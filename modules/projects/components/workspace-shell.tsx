"use client";

import {
  ActionIcon,
  Anchor,
  AppShell,
  Avatar,
  Box,
  Burger,
  Button,
  ComboboxPopover,
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
  IconChevronDown,
  IconChevronRight,
  IconChecklist,
  IconSettings,
  IconMessageCircle,
  IconFolders,
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
  type ProjectSection,
} from "../lib/applications";
import { writeSidebarCollapsedCookie } from "../lib/sidebar-preference";
import { useProjectSettings } from "./project-settings-provider";

const projectOptions = applications.map((item) => ({
  value: item.id,
  label: item.name,
}));

const projectNavigation = [
  { section: "overview", label: "overview", icon: IconLayoutDashboard },
  { section: "support", label: "support", icon: IconLifebuoy },
  { section: "feedback", label: "feedback", icon: IconMessageCircle },
  { section: "ideas", label: "ideas", icon: IconBulb },
  { section: "uat", label: "uat", icon: IconChecklist },
  { section: "settings", label: "projectSettings", icon: IconSettings },
] as const;

function sectionPath(projectId: string, section: ProjectSection) {
  const base = applicationPath(projectId);
  return section === "overview" ? base : `${base}/${section}`;
}

function ProjectSwitcher({
  value,
  disabled,
  label,
  nothingFound,
  placeholder,
  onChange,
  fullWidth,
}: {
  value: string;
  disabled?: boolean;
  label: string;
  nothingFound: string;
  placeholder: string;
  onChange: (projectId: string) => void;
  fullWidth?: boolean;
}) {
  const selected = getApplication(value);

  return (
    <ComboboxPopover
      value={value}
      allowDeselect={false}
      searchable
      nothingFoundMessage={nothingFound}
      data={projectOptions}
      comboboxProps={{ width: 280, position: "bottom-start" }}
      onChange={(next) => {
        if (typeof next !== "string" || next === value) return;
        onChange(next);
      }}
      renderOption={({ option }) => {
        const project = getApplication(option.value);
        return (
          <Group gap="xs" wrap="nowrap">
            <Avatar color="blue" size={22}>
              {project?.initials ?? option.label.slice(0, 2)}
            </Avatar>
            <Text size="sm">{option.label}</Text>
          </Group>
        );
      }}
    >
      <ComboboxPopover.Target>
        <Button
          variant="default"
          size="compact-xs"
          disabled={disabled}
          aria-label={label}
          fullWidth={fullWidth}
          justify="space-between"
          rightSection={<IconChevronDown size={14} aria-hidden />}
          maw={fullWidth ? undefined : 160}
        >
          <Text component="span" size="xs" truncate>
            {selected?.name ?? placeholder}
          </Text>
        </Button>
      </ComboboxPopover.Target>
    </ComboboxPopover>
  );
}

export function WorkspaceShell({
  children,
  initialDesktopCollapsed = false,
}: {
  children: ReactNode;
  initialDesktopCollapsed?: boolean;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { confirmLeave } = useProjectSettings();
  const application = pathname.startsWith("/projects/")
    ? getApplication(pathname.split("/")[2] ?? "")
    : undefined;
  const homeHref = "/";
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
  const isSectionActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);
  const isHomeActive = pathname === "/";

  function toggleDesktopSidebar() {
    setDesktopCollapsed((current) => {
      const next = !current;
      writeSidebarCollapsedCookie(next);
      return next;
    });
  }

  function switchProject(projectId: string) {
    if (!getApplication(projectId)) return;
    if (application && !confirmLeave(application.id)) return;
    router.push(projectSectionPath(projectId, pathname));
    close();
  }

  function guardNavigation(event: { preventDefault: () => void }) {
    if (application && !confirmLeave(application.id)) {
      event.preventDefault();
      return;
    }
    close();
  }

  function renderProjectDestination(item: (typeof projectNavigation)[number]) {
    const Icon = item.icon;
    if (!application) return null;
    const href = sectionPath(application.id, item.section);
    const active =
      item.section === "overview" ? pathname === href : isSectionActive(href);
    return (
      <NavLink
        key={item.section}
        component={Link}
        href={href}
        label={t(item.label)}
        leftSection={<Icon size={20} aria-hidden />}
        active={active}
        aria-current={active ? "page" : undefined}
        onNavigate={guardNavigation}
      />
    );
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
              onNavigate={guardNavigation}
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
        <Stack h="100%" gap="sm" style={{ overflowY: "auto" }}>
          {application && (
            <Box px="sm" py="xs">
              <Text visibleFrom="lg" size="sm" fw={600} truncate>
                {application.name}
              </Text>
              <Box hiddenFrom="lg">
                <ProjectSwitcher
                  disabled={!mounted}
                  label={application ? t("switchProject") : t("chooseProject")}
                  placeholder={t("chooseProject")}
                  nothingFound={t("noProjectsFound")}
                  value={application?.id ?? ""}
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
              onNavigate={guardNavigation}
              label={t("projects")}
              leftSection={<IconFolders size={20} aria-hidden />}
              active={isHomeActive}
              aria-current={isHomeActive ? "page" : undefined}
            />
          )}
          {application && (
            <>
              <Stack gap="xs" style={{ flexShrink: 0 }}>
                <Stack gap={2} style={{ flexShrink: 0 }}>
                  {projectNavigation
                    .filter((item) => item.section !== "settings")
                    .map(renderProjectDestination)}
                </Stack>
              </Stack>
              <Box mt="auto" pt="sm">
                {projectNavigation
                  .filter((item) => item.section === "settings")
                  .map(renderProjectDestination)}
              </Box>
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
