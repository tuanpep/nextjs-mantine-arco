"use client";

import { Avatar, Menu, Text, UnstyledButton } from "@mantine/core";
import { IconLogout } from "@tabler/icons-react";
import { useTranslations } from "next-intl";

import { useProfile } from "../lib/use-profile";
import { useAuth } from "./auth-provider";

export function AccountMenu() {
  const t = useTranslations("Workspace");
  const { logOut } = useAuth();
  const { displayName, email, avatarSrc, initials } = useProfile();
  const label = displayName || t("signedOut");

  return (
    <Menu position="bottom-end" withinPortal>
      <Menu.Target>
        <UnstyledButton aria-label={label}>
          <Avatar color="violet" size={32} src={avatarSrc} name={label}>
            {initials}
          </Avatar>
        </UnstyledButton>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Label>
          <Text size="sm" fw={600} lineClamp={1}>
            {label}
          </Text>
          {email ? (
            <Text size="xs" c="dimmed" lineClamp={1}>
              {email}
            </Text>
          ) : null}
        </Menu.Label>
        <Menu.Item
          leftSection={<IconLogout size={16} />}
          onClick={() => logOut()}
        >
          {t("logOut")}
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
