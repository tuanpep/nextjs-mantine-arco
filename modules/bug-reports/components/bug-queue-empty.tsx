"use client";

import { Button, Group, Stack, Text } from "@mantine/core";
import { useTranslations } from "next-intl";

import type { BugView } from "../lib/search-params";

export function BugQueueEmpty({
  view,
  narrowed,
  hasReports,
  searching,
  onClear,
  onView,
}: {
  view: BugView;
  narrowed: boolean;
  hasReports: boolean;
  searching: boolean;
  onClear: () => void;
  onView: (view: BugView) => void;
}) {
  const t = useTranslations("Bugs");
  const portal = useTranslations("Portal");
  const title = narrowed
    ? portal("noMatches")
    : !hasReports
      ? t("emptyAll")
      : view === "resolved"
        ? t("emptyResolved")
        : t("emptyOpen");
  return (
    <Stack align="center" py="xl" gap="sm">
      <Text fw={600}>{title}</Text>
      <Group justify="center">
        {narrowed ? (
          <Button variant="default" onClick={onClear}>
            {t("clearFilter")}
          </Button>
        ) : !hasReports ? null : (
          <Button
            variant="default"
            onClick={() => onView(view === "open" ? "resolved" : "open")}
          >
            {view === "open" ? t("viewResolved") : t("viewActive")}
          </Button>
        )}
        {searching && view !== "all" ? (
          <Button variant="subtle" onClick={() => onView("all")}>
            {t("searchAll")}
          </Button>
        ) : null}
      </Group>
    </Stack>
  );
}
