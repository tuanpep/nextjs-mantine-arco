"use client";

import {
  ActionIcon,
  Anchor,
  Group,
  NativeSelect,
  Text,
  useMantineColorScheme,
} from "@mantine/core";
import { useMounted } from "@mantine/hooks";
import { IconMoon, IconSun } from "@tabler/icons-react";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { useState, useTransition } from "react";

import { setLocale } from "@/lib/i18n/actions";

export function AppHeader() {
  const t = useTranslations("App");
  const locale = useLocale();
  const [pending, startTransition] = useTransition();
  const [languageError, setLanguageError] = useState(false);
  const mounted = useMounted();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  return (
    <>
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
      <Group h="100%" px="md" justify="space-between" wrap="nowrap">
        <Anchor component={Link} href="/" c="inherit" underline="never">
          <Text fw={600} size="md">
            {t("name")}
          </Text>
        </Anchor>
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
        </Group>
      </Group>
      {languageError && (
        <Text role="alert" c="red" size="sm" px="md" pb="xs">
          {t("languageError")}
        </Text>
      )}
    </>
  );
}
