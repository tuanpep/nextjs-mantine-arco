"use client";

import {
  ActionIcon,
  Avatar,
  Button,
  Group,
  Text,
  Tooltip,
} from "@mantine/core";
import {
  IconBug,
  IconBulb,
  IconChecklist,
  IconLifebuoy,
  IconMessageCircle,
} from "@tabler/icons-react";
import Link from "next/link";

import { DestinationUnavailable } from "@/modules/ui/components/destination-unavailable";
import { PageFrame } from "@/modules/ui/components/page-frame";
import { PageHeader } from "@/modules/ui/components/page-header";

import { getApplication } from "../lib/applications";

const primaryAction = {
  label: "Report a bug",
  href: (projectId: string) => `/projects/${projectId}/support/new?type=broken`,
  icon: IconBug,
} as const;

const secondaryActions = [
  {
    label: "Ask a question",
    href: (projectId: string) =>
      `/projects/${projectId}/support/new?type=question`,
    icon: IconLifebuoy,
  },
  {
    label: "Share feedback",
    href: (projectId: string) => `/projects/${projectId}/feedback/new`,
    icon: IconMessageCircle,
  },
  {
    label: "Suggest an idea",
    href: (projectId: string) => `/projects/${projectId}/ideas/new`,
    icon: IconBulb,
  },
  {
    label: "Open UAT",
    href: (projectId: string) => `/projects/${projectId}/uat`,
    icon: IconChecklist,
  },
] as const;

export function ProjectHub({ projectId }: { projectId: string }) {
  const application = getApplication(projectId);

  if (!application) {
    return (
      <PageFrame>
        <DestinationUnavailable backHref="/" backLabel="Back to projects" />
      </PageFrame>
    );
  }

  return (
    <PageFrame
      header={
        <PageHeader
          title="Overview"
          breadcrumbs={[{ title: "Overview", href: `/projects/${projectId}` }]}
          description={
            <Group gap="sm" wrap="nowrap" align="flex-start">
              <Avatar color="blue" size={40}>
                {application.initials}
              </Avatar>
              <Text size="sm" c="dimmed">
                {application.name} � {application.description} � Owner{" "}
                {application.owner}
              </Text>
            </Group>
          }
          actions={
            <Group gap="xs">
              <Button
                component={Link}
                href={primaryAction.href(projectId)}
                leftSection={<primaryAction.icon size={16} />}
              >
                {primaryAction.label}
              </Button>
              {secondaryActions.map(({ label, href, icon: Icon }) => (
                <Tooltip key={label} label={label}>
                  <ActionIcon
                    component={Link}
                    href={href(projectId)}
                    variant="default"
                    size="lg"
                    aria-label={label}
                  >
                    <Icon size={18} aria-hidden />
                  </ActionIcon>
                </Tooltip>
              ))}
            </Group>
          }
        />
      }
    >
      {null}
    </PageFrame>
  );
}
