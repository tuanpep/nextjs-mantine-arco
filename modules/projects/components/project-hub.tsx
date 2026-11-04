"use client";

import { Anchor, Paper, SimpleGrid, Stack, Text } from "@mantine/core";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

import { usePortal } from "@/modules/portal/components/portal-provider";
import { projectSummaries } from "@/modules/portal/lib/project-summary";
import { PageFrame } from "@/modules/ui/components/page-frame";
import { PageHeader } from "@/modules/ui/components/page-header";
import { ProjectUnavailable } from "@/modules/ui/components/project-unavailable";

import { getApplication } from "../lib/applications";

export function ProjectHub({ projectId }: { projectId: string }) {
  const application = getApplication(projectId);
  const t = useTranslations("Overview");
  const nav = useTranslations("Workspace");
  const locale = useLocale();
  const portal = usePortal();

  if (!application) return <ProjectUnavailable />;

  const base = `/projects/${projectId}`;
  const labels = {
    bug: { label: t("openBugs"), view: t("viewBugs"), empty: t("emptyActive") },
    help: {
      label: t("openHelp"),
      view: t("viewHelp"),
      empty: t("emptyActive"),
    },
    feature: {
      label: t("openFeatures"),
      view: t("viewFeatures"),
      empty: t("emptyActive"),
    },
    feedback: {
      label: t("newFeedback"),
      view: t("viewFeedback"),
      empty: t("emptyActive"),
    },
    guide: {
      label: t("guides"),
      view: t("viewGuides"),
      empty: t("emptyGuides"),
    },
    discussion: {
      label: t("discussions"),
      view: t("viewDiscussions"),
      empty: t("emptyDiscussions"),
    },
  };
  const cards = projectSummaries(projectId, portal, locale);

  return (
    <PageFrame
      header={
        <PageHeader
          title={t("title")}
          description={application.name}
          breadcrumbs={[
            { title: nav("projects"), href: "/" },
            { title: application.name, href: base },
          ]}
        />
      }
    >
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
        {cards.map((card) => (
          <Paper
            key={card.kind}
            component="section"
            aria-label={labels[card.kind].label}
            withBorder
            p="md"
          >
            <Stack gap="sm" h="100%">
              <Text size="sm" c="dimmed">
                {labels[card.kind].label}
              </Text>
              <Text size="xl" fw={700}>
                {card.count}
              </Text>
              {card.count === 0 && (
                <Text size="sm" c="dimmed">
                  {labels[card.kind].empty}
                </Text>
              )}
              {card.records.map((record) => (
                <Anchor
                  key={record.id}
                  component={Link}
                  href={record.href}
                  size="sm"
                >
                  {record.title}
                </Anchor>
              ))}
              <Anchor component={Link} href={card.href} size="sm" mt="auto">
                {labels[card.kind].view}
              </Anchor>
            </Stack>
          </Paper>
        ))}
      </SimpleGrid>
    </PageFrame>
  );
}
