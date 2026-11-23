"use client";

import {
  Anchor,
  AppShell,
  Burger,
  Container,
  Group,
  NavLink,
  ScrollArea,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState, type ReactNode } from "react";

import {
  AppHeaderToolbar,
  AppSkipLink,
} from "../components/navigation/app-header";

import { categories, components } from "./component-catalog";
import classes from "./component-book-shell.module.css";

const navigationId = "component-book-menu";

export function ComponentBookShell({ children }: { children: ReactNode }) {
  const t = useTranslations("ComponentBook");
  const pathname = usePathname();
  const [opened, { close, toggle }] = useDisclosure(false);
  const [query, setQuery] = useState("");
  const menuToggle = useRef<HTMLButtonElement>(null);
  const search = query.toLowerCase().replace(/[\s-]+/g, "");
  const matches = components.filter(({ name }) =>
    name.toLowerCase().includes(search),
  );

  return (
    <AppShell
      header={{ height: 56 }}
      navbar={{ width: 240, breakpoint: "sm", collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppSkipLink onClick={close} />
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between" wrap="nowrap">
          <Group gap="xs" wrap="nowrap" miw={0}>
            <Burger
              ref={menuToggle}
              size="sm"
              hiddenFrom="sm"
              opened={opened}
              onClick={toggle}
              aria-label={t("toggleMenu")}
              aria-expanded={opened}
              aria-controls={navigationId}
            />
            <Anchor
              component={Link}
              href="/"
              onClick={close}
              c="inherit"
              fw={600}
              underline="never"
              truncate
            >
              {t("title")}
            </Anchor>
          </Group>
          <AppHeaderToolbar />
        </Group>
      </AppShell.Header>

      <AppShell.Navbar
        id={navigationId}
        aria-label={t("menu")}
        className={opened ? undefined : classes.collapsed}
        onKeyDown={(event) => {
          if (event.key !== "Escape" || event.defaultPrevented || !opened)
            return;
          close();
          menuToggle.current?.focus();
        }}
      >
        <AppShell.Section p="sm">
          <TextInput
            label={t("search")}
            value={query}
            onChange={(event) => setQuery(event.currentTarget.value)}
          />
        </AppShell.Section>
        <AppShell.Section grow component={ScrollArea}>
          <Stack gap="sm" px="sm" pb="md">
            {matches.length ? (
              categories.map((group) => {
                const entries = matches.filter(
                  (entry) => entry.category === group,
                );
                if (!entries.length) return null;

                return (
                  <div key={group}>
                    <Text size="xs" fw={600} c="dimmed" px="sm" mb={4}>
                      {t(`categories.${group}`)}
                    </Text>
                    {entries.map(({ name, href }) => (
                      <NavLink
                        key={name}
                        component={Link}
                        href={href}
                        prefetch={false}
                        label={name}
                        active={pathname === href}
                        aria-current={pathname === href ? "page" : undefined}
                        onClick={() => {
                          if (!opened) return;
                          close();
                          if (pathname === href) menuToggle.current?.focus();
                        }}
                      />
                    ))}
                  </div>
                );
              })
            ) : (
              <Text size="sm" role="status">
                {t("empty")}
              </Text>
            )}
          </Stack>
        </AppShell.Section>
      </AppShell.Navbar>

      <AppShell.Main id="main-content" tabIndex={-1}>
        <Container size="lg" px={0} py="sm">
          {children}
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}
