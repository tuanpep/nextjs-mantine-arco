"use client";

import { Box, Tabs } from "@mantine/core";
import type { ReactNode } from "react";

export type ModuleTabItem = {
  value: string;
  label: string;
  count?: number;
};

export type ModuleTabsProps = {
  id: string;
  ariaLabel: string;
  value: string;
  items: ModuleTabItem[];
  onChange: (value: string) => void;
};

/** In-page facet tabs for one module. Place as PageHeader children. */
export function ModuleTabs({
  id,
  ariaLabel,
  value,
  items,
  onChange,
}: ModuleTabsProps) {
  return (
    <Tabs
      value={value}
      onChange={(next) => {
        if (next) onChange(next);
      }}
    >
      <Tabs.List
        aria-label={ariaLabel}
        style={{ flexWrap: "nowrap", overflowX: "auto" }}
      >
        {items.map((item) => (
          <Tabs.Tab
            key={item.value}
            value={item.value}
            id={`${id}-tab-${item.value}`}
            aria-controls={`${id}-panel`}
            style={{ flexShrink: 0 }}
          >
            {typeof item.count === "number"
              ? `${item.label} (${item.count})`
              : item.label}
          </Tabs.Tab>
        ))}
      </Tabs.List>
    </Tabs>
  );
}

export function ModuleTabPanel({
  id,
  value,
  children,
}: {
  id: string;
  value: string;
  children: ReactNode;
}) {
  return (
    <Box
      id={`${id}-panel`}
      role="tabpanel"
      aria-labelledby={`${id}-tab-${value}`}
      tabIndex={0}
    >
      {children}
    </Box>
  );
}
