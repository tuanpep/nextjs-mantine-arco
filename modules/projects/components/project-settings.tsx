"use client";

import {
  Alert,
  Button,
  Divider,
  NavLink,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useMediaQuery, useMounted } from "@mantine/hooks";
import { parseAsStringLiteral, useQueryState } from "nuqs";
import { useState, type ReactNode } from "react";

import { DestinationUnavailable } from "@/modules/ui/components/destination-unavailable";
import { PageFrame } from "@/modules/ui/components/page-frame";
import { PageHeader } from "@/modules/ui/components/page-header";

import { getApplication } from "../lib/applications";

const settingsSections = [
  "identity",
  "responsibilities",
  "gaps",
  "archive",
] as const;

type SettingsSection = (typeof settingsSections)[number];

const sectionLabels: Record<SettingsSection, string> = {
  identity: "Identity",
  responsibilities: "Default responsibilities",
  gaps: "Still missing",
  archive: "Archive this project",
};

export function ProjectSettings({ projectId }: { projectId: string }) {
  const mounted = useMounted();
  const isNarrow = useMediaQuery("(max-width: 74.99em)", false, {
    getInitialValueInEffect: true,
  });
  const application = getApplication(projectId);
  const [section, setSection] = useQueryState(
    "section",
    parseAsStringLiteral(settingsSections),
  );
  const [owner, setOwner] = useState(application?.owner ?? "");
  const [supportHandler, setSupportHandler] = useState("Minh Pham");
  const [feedbackReviewer, setFeedbackReviewer] = useState("Lan Vo");
  const [ideaReviewer, setIdeaReviewer] = useState("Lan Vo");
  const [uatCoordinator, setUatCoordinator] = useState("Hoa Nguyen");
  const [notice, setNotice] = useState("");

  if (!application) {
    return (
      <PageFrame>
        <DestinationUnavailable backHref="/" backLabel="Back to projects" />
      </PageFrame>
    );
  }

  const gaps = [
    !owner.trim() && "Accountable owner is missing",
    !supportHandler.trim() && "Default support handler is missing",
    !feedbackReviewer.trim() && "Feedback reviewer is missing",
    !ideaReviewer.trim() && "Idea reviewer is missing",
    !uatCoordinator.trim() && "UAT coordinator is missing",
  ].filter(Boolean) as string[];

  const activeSection: SettingsSection = section ?? "identity";
  const paneIndexOpen = Boolean(section);
  const showSectionBack = Boolean(isNarrow && section);

  const nav = (
    <Stack gap={2} component="nav" aria-label="Settings sections">
      {settingsSections.map((id) => (
        <NavLink
          key={id}
          label={sectionLabels[id]}
          active={activeSection === id}
          aria-current={activeSection === id ? "page" : undefined}
          onClick={() => void setSection(id)}
          py={7}
        />
      ))}
    </Stack>
  );

  const sectionContent: Record<SettingsSection, ReactNode> = {
    identity: (
      <Stack gap="md">
        <Title order={2} size="h3">
          Identity
        </Title>
        <TextInput label="Project name" value={application.name} disabled />
        <TextInput
          disabled={!mounted}
          label="Accountable owner"
          value={owner}
          onChange={(event) => setOwner(event.currentTarget.value)}
        />
      </Stack>
    ),
    responsibilities: (
      <Stack gap="md">
        <Title order={2} size="h3">
          Default responsibilities
        </Title>
        <TextInput
          disabled={!mounted}
          label="Support handler"
          value={supportHandler}
          onChange={(event) => setSupportHandler(event.currentTarget.value)}
        />
        <TextInput
          disabled={!mounted}
          label="Feedback reviewer"
          value={feedbackReviewer}
          onChange={(event) => setFeedbackReviewer(event.currentTarget.value)}
        />
        <TextInput
          disabled={!mounted}
          label="Idea reviewer"
          value={ideaReviewer}
          onChange={(event) => setIdeaReviewer(event.currentTarget.value)}
        />
        <TextInput
          disabled={!mounted}
          label="UAT coordinator"
          value={uatCoordinator}
          onChange={(event) => setUatCoordinator(event.currentTarget.value)}
        />
        <Button
          style={{ alignSelf: "flex-start" }}
          disabled={!mounted}
          onClick={() =>
            setNotice("Names saved. No access or duty was granted.")
          }
        >
          Save names
        </Button>
      </Stack>
    ),
    gaps: (
      <Stack gap="sm">
        <Title order={2} size="h3">
          Still missing
        </Title>
        {gaps.length === 0 ? (
          <Text size="sm">No gaps listed.</Text>
        ) : (
          gaps.map((gap) => (
            <Text key={gap} size="sm">
              � {gap}
            </Text>
          ))
        )}
      </Stack>
    ),
    archive: (
      <Stack gap="sm">
        <Title order={2} size="h3">
          Archive this project
        </Title>
        <Text size="sm">
          Archive stays blocked until an owner decides what happens to open
          tickets, feedback, and campaigns.
        </Text>
        <Button disabled>Archive unavailable</Button>
      </Stack>
    ),
  };

  return (
    <PageFrame
      fullBleed
      panePosition="start"
      paneNarrow="index"
      paneIndexOpen={paneIndexOpen}
      paneLabel="Settings sections"
      pane={nav}
      header={
        <PageHeader
          title={showSectionBack ? sectionLabels[activeSection] : "Settings"}
          breadcrumbs={
            showSectionBack
              ? [
                  {
                    title: "Settings",
                    href: `/projects/${projectId}/settings`,
                  },
                  { title: sectionLabels[activeSection] },
                ]
              : [
                  {
                    title: "Overview",
                    href: `/projects/${projectId}`,
                  },
                  { title: "Settings" },
                ]
          }
          onParentClick={
            showSectionBack
              ? () => {
                  void setSection(null);
                }
              : undefined
          }
        />
      }
    >
      <Stack gap="md">
        <Alert color="blue">Naming people here is not an access grant.</Alert>
        {notice && (
          <Alert role="status" color="teal">
            {notice}
          </Alert>
        )}
        <Divider />
        {sectionContent[activeSection]}
      </Stack>
    </PageFrame>
  );
}
