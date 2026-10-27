"use client";

import {
  ActionIcon,
  Anchor,
  AppShell,
  Avatar,
  Box,
  Burger,
  Divider,
  Group,
  NavLink,
  NativeSelect,
  Stack,
  Text,
  useMantineColorScheme,
} from "@mantine/core";
import { useDisclosure, useMounted } from "@mantine/hooks";
import {
  IconGridDots,
  IconLayoutDashboard,
  IconLifebuoy,
  IconBulb,
  IconMoon,
  IconSun,
  IconHome,
  IconChevronRight,
  IconInbox,
  IconBook,
  IconChecklist,
  IconActivity,
  IconSettings,
  IconClipboardList,
} from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useState, useTransition, type ReactNode } from "react";

import { setLocale } from "@/lib/i18n/actions";

import { applications, applicationPath, getApplication } from "../lib/applications";
import { useRouter } from "nextjs-toploader/app";

export function WorkspaceShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const application = pathname.startsWith("/projects/") ? getApplication(pathname.split("/")[2] ?? "") : undefined;
  const productPath = application ? applicationPath(application.id) : "/applications";
  const t = useTranslations("Workspace");
  const locale = useLocale();
  const [pending, startTransition] = useTransition();
  const [languageError, setLanguageError] = useState(false);
  const inProduct = Boolean(application);
  const [opened, { toggle, close }] = useDisclosure();
  const mounted = useMounted();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const projectLinks = [
    { label: t("overview"), href: productPath, icon: IconLayoutDashboard },
    {
      label: t("support"),
      href: `${productPath}/support`,
      icon: IconLifebuoy,
    },
    { label: locale === "vi" ? "Cải tiến · Tất cả ứng dụng" : "Improvements · All applications", href: "/improvements", icon: IconBulb },
  ];
  const workspaceLinks = [
    { label: t("home"), href: "/", icon: IconHome },
    { label: t("applications"), href: "/applications", icon: IconGridDots },
    { label: t("getHelp"), href: "/help", icon: IconLifebuoy },
    {
      label: locale === "vi" ? "Danh mục dịch vụ" : "Service catalog",
      href: "/services",
      icon: IconClipboardList,
    },
    { label: t("requests"), href: "/requests", icon: IconInbox },
    {
      label: locale === "vi" ? "Học tập" : "Learning",
      href: "/learning",
      icon: IconBook,
    },
    {
      label: locale === "vi" ? "Kiểm thử UAT" : "UAT & testing",
      href: "/uat",
      icon: IconChecklist,
    },
    {
      label: locale === "vi" ? "Cải tiến" : "Improvements",
      href: "/improvements",
      icon: IconBulb,
    },
    {
      label: locale === "vi" ? "Trạng thái dịch vụ" : "Service status",
      href: "/status",
      icon: IconActivity,
    },
  ];
  const operationsLabel = locale === "vi" ? "Vận hành DX" : "DX operations";
  const isActive = (href: string) =>
    pathname === href ||
    (href !== "/" && pathname.startsWith(`${href}/`)) ||
    (href === "/applications" && pathname === "/projects");
  const currentSection = inProduct
    ? application?.name
    : (workspaceLinks.find(({ href }) => isActive(href))?.label ??
      (isActive("/operations") ? operationsLabel : t("digitalServices")));

  return (
    <AppShell
      header={{ height: 48 }}
      navbar={{ width: 232, breakpoint: "sm", collapsed: { mobile: !opened } }}
      padding={0}
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between" wrap="nowrap" gap="xs">
          <Group gap="sm">
            <Burger
              hiddenFrom="sm"
              opened={opened}
              disabled={!mounted}
              onClick={toggle}
              aria-label={opened ? t("closeNavigation") : t("openNavigation")}
              size="sm"
            />
            <Anchor component={Link} href="/" c="inherit" underline="never">
              <Group gap="xs" wrap="nowrap">
                <IconLifebuoy size={22} color="var(--mantine-color-violet-6)" />
                <Text fw={600} size="md">
                  DX Portal
                </Text>
              </Group>
            </Anchor>
            <Group gap="xs" visibleFrom="sm" wrap="nowrap">
              <IconChevronRight size={14} color="var(--mantine-color-dimmed)" />
              <Text size="sm" c="dimmed">
                {currentSection}
              </Text>
            </Group>
          </Group>
          <Group gap="sm">
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
            <Avatar
              color="violet"
              radius="xl"
              size={32}
              aria-label={t("demoAccount")}
            >
              JL
            </Avatar>
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
          <Text size="xs" fw={600} c="dimmed" px="sm" pt="xs">
            {t("digitalServices")}
          </Text>
          <Stack gap={2} style={{ flexShrink: 0 }}>
            {workspaceLinks.map(({ label, href, icon: Icon }) => {
              const active = isActive(href);
              return (
                <Box key={href}>
                  <NavLink
                    component={Link}
                    href={href}
                    label={label}
                    leftSection={<Icon size={18} />}
                    active={active}
                    aria-current={active ? "page" : undefined}
                    onClick={close}
                    py={7}
                  />
                </Box>
              );
            })}
          </Stack>
          {inProduct && (
            <Box
              component="section"
              aria-label={application?.name}
              style={{ flexShrink: 0 }}
            >
              <Divider />
              <Group px="sm" py="md" gap="sm" wrap="nowrap">
                <Avatar color="blue" radius="md" size={32}>
                  {application?.initials}
                </Avatar>
                <Text fw={600} size="sm">
                  {application?.name}
                </Text>
              </Group>
              <NativeSelect
                disabled={!mounted}
                aria-label={locale === "vi" ? "Chuyển ứng dụng" : "Switch application"}
                value={application?.id}
                data={applications.map((item) => ({ value: item.id, label: item.name }))}
                onChange={(event) => { router.push(applicationPath(event.currentTarget.value)); close(); }}
                mb="sm"
              />
              <Stack gap={2}>
                {projectLinks.map(({ label, href, icon: Icon }) => {
                  const active =
                    href === productPath
                      ? pathname === href
                      : pathname === href || pathname.startsWith(`${href}/`);
                  return (
                    <Box key={href}>
                      {href === `${productPath}/support` && (
                        <Text
                          size="xs"
                          c="dimmed"
                          fw={600}
                          px="sm"
                          mt="md"
                          mb="xs"
                        >
                          {t("workItems")}
                        </Text>
                      )}
                      <NavLink
                        component={Link}
                        href={href}
                        label={label}
                        leftSection={<Icon size={18} />}
                        active={active}
                        aria-current={active ? "page" : undefined}
                        onClick={close}
                        py={7}
                      />
                    </Box>
                  );
                })}
              </Stack>
            </Box>
          )}
          <Box mt="auto" pt="sm" style={{ flexShrink: 0 }}>
            <Divider mb="xs" />
            <Text size="xs" c="dimmed" px="sm" mb={4}>
              {locale === "vi" ? "Nhóm DX · Demo" : "DX team · Demo"}
            </Text>
            <NavLink
              component={Link}
              href="/operations"
              label={operationsLabel}
              leftSection={<IconSettings size={18} />}
              active={isActive("/operations")}
              aria-current={isActive("/operations") ? "page" : undefined}
              onClick={close}
              py={7}
            />
          </Box>
        </Stack>
      </AppShell.Navbar>
      <AppShell.Main>
        <Box
          px={{ base: "md", sm: "xl" }}
          py="lg"
          maw={1280}
          mx="auto"
          style={{ minWidth: 0 }}
        >
          {languageError && (
            <Text role="alert" c="red" size="sm" mb="md">
              {t("languageError")}
            </Text>
          )}
          {children}
          <Text
            size="xs"
            c="dimmed"
            mt={48}
            pt="md"
            style={{
              borderTop: "1px solid var(--mantine-color-default-border)",
            }}
          >
            {t("demoNotice")}
          </Text>
        </Box>
      </AppShell.Main>
    </AppShell>
  );
}
