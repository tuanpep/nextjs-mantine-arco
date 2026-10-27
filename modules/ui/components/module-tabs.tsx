"use client";

import { Tabs } from "@mantine/core";

export type ModuleTabItem = {
  value: string;
  label: string;
  count?: number;
};

export type ModuleTabsProps = {
  ariaLabel: string;
  value: string;
  items: ModuleTabItem[];
  onChange: (value: string) => void;
};

/** In-page facet tabs for one module. Place as PageHeader children. */
export function ModuleTabs({
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
      <Tabs.List aria-label={ariaLabel}>
        {items.map((item) => (
          <Tabs.Tab key={item.value} value={item.value}>
            {typeof item.count === "number"
              ? `${item.label} (${item.count})`
              : item.label}
          </Tabs.Tab>
        ))}
      </Tabs.List>
    </Tabs>
  );
}
