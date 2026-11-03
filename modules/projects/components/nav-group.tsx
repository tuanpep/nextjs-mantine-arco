"use client";

import { NavLink } from "@mantine/core";
import type { ComponentType, ReactNode } from "react";

type NavIcon = ComponentType<{ size?: number; "aria-hidden"?: boolean }>;

export function NavGroup({
  label,
  icon: Icon,
  children,
}: {
  label: string;
  icon: NavIcon;
  children: ReactNode;
}) {
  return (
    <NavLink
      component="button"
      type="button"
      label={label}
      leftSection={<Icon size={16} aria-hidden />}
      defaultOpened
    >
      {children}
    </NavLink>
  );
}
