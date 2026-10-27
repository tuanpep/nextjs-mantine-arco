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
} from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "nextjs-toploader/app";
import { useState, useTransition, type ReactNode } from "react";

import { setLocale } from "@/lib/i18n/actions";
import { AccountMenu } from "@/modules/account/components/account-menu";

import {
  applications,
  DEFAULT_PROJECT_ID,
  getApplication,
  projectSectionPath,
  projectSupportPath,
} from "../lib/applications";

export function WorkspaceShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const application = pathname.startsWith("/projects/")
    ? getApplication(pathname.split("/")[2] ?? "")
    : undefined;
  const productPath = application
    ? `/projects/${application.id}`
    : projectSupportPath(DEFAULT_PROJECT_ID);
  const homeHref = projectSupportPath(
    application?.id ?? DEFAULT_PROJECT_ID,
  );
  const t = useTranslations("Workspace");
  const locale = useLocale();
  const [pending, startTransition] = useTransition();
  const [languageError, setLanguageError] = useState(false);
  const [opened, { toggle, close }] = useDisclosure();
  const mounted = useMounted();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const projectLinks = [
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
  ];
  const settingsHref = `${productPath}/settings`;
  const isSectionActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);
  const currentSection =
    projectLinks.find(({ href }) => isSectionActive(href))?.label ??
    (isSectionActive(settingsHref) ? t("settings") : (application?.name ?? t("workspace")));

  return (
    <AppShell
      header={{ height: 48 }}
      navbar={{ width: 232, breakpoint: "sm", collapsed: { mobile: !opened } }}
      padding={0}
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between" wrap="nowrap" gap="xs">
          <Group gap="sm" wrap="nowrap" style={{ minWidth: 0 }}>
            <Burger
              hiddenFrom="sm"
              opened={opened}
              disabled={!mounted}
              onClick={toggle}
              aria-label={opened ? t("closeNavigation") : t("openNavigation")}
              size="sm"
            />
            <Anchor component={Link} href={homeHref} c="inherit" underline="never">
              <Group gap="xs" wrap="nowrap">
                <IconLifebuoy size={22} color="var(--mantine-color-violet-6)" />
                <Text fw={600} size="md">
                  DX Portal
                </Text>
              </Group>
            </Anchor>
            <Group gap="xs" visibleFrom="sm" wrap="nowrap" style={{ minWidth: 0 }}>
              <IconChevronRight size={14} color="var(--mantine-color-dimmed)" />
              {application ? (
                <>
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
                        projectSectionPath(
                          event.currentTarget.value,
                          pathname,
                        ),
                      );
                      close();
                    }}
                  />
                  <IconChevronRight
                    size={14}
                    color="var(--mantine-color-dimmed)"
                  />
                  <Text size="sm" c="dimmed" truncate>
                    {currentSection}
                  </Text>
                </>
              ) : (
                <Text size="sm" c="dimmed">
                  {t("workspace")}
                </Text>
              )}
            </Group>
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
          {application ? (
            <>
              <Group px="sm" py="md" gap="sm" wrap="nowrap" hiddenFrom="sm">
                <Avatar color="blue" radius="md" size={32}>
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
                        projectSectionPath(
                          event.currentTarget.value,
                          pathname,
                        ),
                      );
                      close();
                    }}
                  />
                </Box>
              </Group>
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
            <Text size="sm" c="dimmed" px="sm" py="md">
              {t("noProjectContext")}
            </Text>
          )}
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
