"use client";

import {
  AppShell,
  Button,
  Container,
  Group,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useTranslations } from "next-intl";

import { AppHeader } from "./app-header";

export function LandingPage() {
  const t = useTranslations("Home");

  return (
    <AppShell header={{ height: 48 }} padding="md">
      <AppShell.Header>
        <AppHeader />
      </AppShell.Header>
      <AppShell.Main id="main-content">
        <Container size="sm" py="xl">
          <Stack gap="lg">
            <Stack gap="xs">
              <Title order={1}>{t("title")}</Title>
              <Text c="dimmed">{t("body")}</Text>
            </Stack>
            <Group>
              <Button>Primary</Button>
              <Button variant="default">Secondary</Button>
            </Group>
          </Stack>
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}
