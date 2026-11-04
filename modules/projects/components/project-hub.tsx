"use client";

import {
  Anchor,
  Badge,
  Box,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

import { usePortal } from "@/modules/portal/components/portal-provider";
import { projectAttention } from "@/modules/portal/lib/project-summary";
import { PageFrame } from "@/modules/ui/components/page-frame";
import { PageHeader } from "@/modules/ui/components/page-header";
import { ProjectUnavailable } from "@/modules/ui/components/project-unavailable";

import { getApplication } from "../lib/applications";

export function ProjectHub({ projectId }: { projectId: string }) {
  const application = getApplication(projectId);
  const t = useTranslations("Overview");
  const nav = useTranslations("Workspace");
  const copy = useTranslations("Portal");
  const bugsCopy = useTranslations("Bugs");
  const locale = useLocale();
  const portal = usePortal();

  if (!application) return <ProjectUnavailable />;

  const base = `/projects/${projectId}`;
  const attention = projectAttention(projectId, portal, locale);
  const bugsHref = `${base}/support/bugs?view=open&sort=severity-desc`;
  const featuresHref = `${base}/ideas/features?view=open`;
  const severityLabels = {
    Critical: copy("severityCritical"),
    High: copy("severityHigh"),
    Medium: copy("severityMedium"),
    Low: copy("severityLow"),
  };
  const statusLabels = {
    Open: copy("statusOpen"),
    "In progress": copy("statusInProgress"),
    "Waiting for reporter": bugsCopy("statusWaiting"),
    Resolved: copy("statusResolved"),
  };

  return (
    <PageFrame
      paneNarrow="sheet"
      paneLabel={copy("details")}
      pane={
        <Stack gap="xl">
          <Stack
            component="section"
            aria-labelledby="pending-review-title"
            gap="sm"
          >
            <Title id="pending-review-title" order={2} size="h4">
              {t("pendingReview")}
            </Title>
            <Paper withBorder>
              {[
                {
                  label: t("openFeatures"),
                  count: attention.featureCount,
                  href: featuresHref,
                },
                {
                  label: t("newFeedback"),
                  count: attention.feedbackCount,
                  href: `${base}/ideas/feedback?view=open`,
                },
              ].map((item) => (
                <Group key={item.href} justify="space-between" p="md">
                  <Anchor component={Link} href={item.href} size="sm">
                    {item.label}
                  </Anchor>
                  <Text size="sm" c="dimmed">
                    {item.count}
                  </Text>
                </Group>
              ))}
            </Paper>
          </Stack>

          <Stack component="section" aria-labelledby="resources-title" gap="sm">
            <Title id="resources-title" order={2} size="h4">
              {t("resources")}
            </Title>
            <Group>
              <Anchor component={Link} href={`${base}/guides`} size="sm">
                {t("guides")}
              </Anchor>
              <Anchor component={Link} href={`${base}/discussions`} size="sm">
                {t("discussions")}
              </Anchor>
            </Group>
          </Stack>
        </Stack>
      }
      header={
        <PageHeader
          title={t("title")}
          breadcrumbs={[
            { title: nav("projects"), href: "/" },
            { title: application.name, href: base },
          ]}
        />
      }
    >
      <Stack gap="xl">
        <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
          {[
            { label: t("openBugs"), count: attention.bugCount, href: bugsHref },
            {
              label: t("openHelp"),
              count: attention.helpCount,
              href: `${base}/support/help?view=open`,
            },
            {
              label: t("pendingDecisions"),
              count: attention.featureCount,
              href: featuresHref,
            },
          ].map((item) => (
            <Paper
              key={item.href}
              withBorder
              p="md"
              component="section"
              aria-label={item.label}
            >
              <Group justify="space-between">
                <Anchor component={Link} href={item.href} fw={600}>
                  {item.label}
                </Anchor>
                <Text size="xl" fw={700}>
                  {item.count}
                </Text>
              </Group>
            </Paper>
          ))}
        </SimpleGrid>

        <Stack
          component="section"
          aria-labelledby="attention-bugs-title"
          gap="sm"
        >
          <Title id="attention-bugs-title" order={2} size="h4">
            {t("bugsAttention")}
          </Title>
          <Paper withBorder style={{ overflow: "hidden" }}>
            {attention.bugs.length === 0 ? (
              <Text p="md" size="sm" c="dimmed">
                {t("emptyBugs")}
              </Text>
            ) : (
              <Stack
                component="ul"
                aria-label={t("bugsAttention")}
                gap={0}
                m={0}
                p={0}
                style={{ listStyle: "none" }}
              >
                {attention.bugs.map((bug) => (
                  <Box
                    component="li"
                    key={bug.id}
                    p="md"
                    style={{
                      borderBottom:
                        "1px solid var(--mantine-color-default-border)",
                      overflowWrap: "anywhere",
                    }}
                  >
                    <Group justify="space-between" align="flex-start" gap="xs">
                      <Anchor
                        component={Link}
                        href={bug.href}
                        fw={600}
                        style={{ minWidth: 0 }}
                      >
                        {bug.title}
                      </Anchor>
                      <Group gap="xs">
                        <Badge
                          color={
                            bug.severity === "Critical"
                              ? "red"
                              : bug.severity === "High"
                                ? "orange"
                                : "gray"
                          }
                          variant="light"
                        >
                          {severityLabels[bug.severity]}
                        </Badge>
                        <Badge variant="outline" color="gray">
                          {statusLabels[bug.status]}
                        </Badge>
                      </Group>
                    </Group>
                    <Text size="xs" c="dimmed" mt={4}>
                      {bug.id}
                    </Text>
                  </Box>
                ))}
              </Stack>
            )}
            <Box p="md">
              <Anchor component={Link} href={bugsHref} size="sm">
                {t("viewBugs")}
              </Anchor>
            </Box>
          </Paper>
        </Stack>
      </Stack>
    </PageFrame>
  );
}
