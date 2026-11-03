"use client";

import { Anchor, Paper, SimpleGrid, Stack, Text } from "@mantine/core";
import Link from "next/link";
import { useTranslations } from "next-intl";

import { usePortal } from "@/modules/portal/components/portal-provider";
import { PageFrame } from "@/modules/ui/components/page-frame";
import { PageHeader } from "@/modules/ui/components/page-header";
import { ProjectUnavailable } from "@/modules/ui/components/project-unavailable";

import { getApplication } from "../lib/applications";

export function ProjectHub({ projectId }: { projectId: string }) {
  const application = getApplication(projectId);
  const t = useTranslations("Overview");
  const nav = useTranslations("Workspace");
  const { bugs, help, features, feedback, guides, discussions } = usePortal();

  if (!application) return <ProjectUnavailable />;

  const base = `/projects/${projectId}`;
  const inProject = <T extends { projectId: string }>(items: T[]) =>
    items.filter((item) => item.projectId === projectId);
  const link = (id: string, section: string) => ({
    id,
    href: `${base}/${section}/${id}`,
  });
  const cards = [
    {
      label: t("openBugs"),
      value: inProject(bugs).filter((item) => item.status !== "Resolved")
        .length,
      href: `${base}/support/bugs?view=open`,
      records: inProject(bugs)
        .filter((item) => item.status !== "Resolved")
        .map((item) => ({
          ...link(item.id, "support/bugs"),
          title: item.title,
        })),
    },
    {
      label: t("openHelp"),
      value: inProject(help).filter((item) => item.status === "Open").length,
      href: `${base}/support/help?view=open`,
      records: inProject(help)
        .filter((item) => item.status === "Open")
        .map((item) => ({
          ...link(item.id, "support/help"),
          title: item.question,
        })),
    },
    {
      label: t("openFeatures"),
      value: inProject(features).filter((item) => item.status === "Submitted")
        .length,
      href: `${base}/ideas/features?view=open`,
      records: inProject(features)
        .filter((item) => item.status === "Submitted")
        .map((item) => ({
          ...link(item.id, "ideas/features"),
          title: item.title,
        })),
    },
    {
      label: t("newFeedback"),
      value: inProject(feedback).filter((item) => item.status === "New").length,
      href: `${base}/ideas/feedback?view=open`,
      records: inProject(feedback)
        .filter((item) => item.status === "New")
        .map((item) => ({
          ...link(item.id, "ideas/feedback"),
          title: item.title,
        })),
    },
    {
      label: t("guides"),
      value: inProject(guides).length,
      href: `${base}/guides`,
      records: [],
    },
    {
      label: t("discussions"),
      value: inProject(discussions).length,
      href: `${base}/discussions`,
      records: [],
    },
  ];

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
            key={card.label}
            component="section"
            aria-label={card.label}
            withBorder
            p="md"
          >
            <Stack gap="sm" h="100%">
              <Text size="sm" c="dimmed">
                {card.label}
              </Text>
              <Text size="xl" fw={700}>
                {card.value}
              </Text>
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
                {t("view")}
              </Anchor>
            </Stack>
          </Paper>
        ))}
      </SimpleGrid>
    </PageFrame>
  );
}
