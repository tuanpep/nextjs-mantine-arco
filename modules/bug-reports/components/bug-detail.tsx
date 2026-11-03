"use client";

import { Anchor, Stack, Text, Title } from "@mantine/core";
import { useTranslations } from "next-intl";

import { usePortal } from "@/modules/portal/components/portal-provider";
import { getApplication } from "@/modules/projects/lib/applications";
import { recordTrail } from "@/modules/projects/lib/record-trail";
import { NoteAction } from "@/modules/ui/components/note-action";
import { NotesList } from "@/modules/ui/components/notes-list";
import { ProjectUnavailable } from "@/modules/ui/components/project-unavailable";
import { RecordDetailFrame } from "@/modules/ui/components/record-detail-frame";
import { RecordFields } from "@/modules/ui/components/record-fields";
import { RecordUnavailable } from "@/modules/ui/components/record-unavailable";

import {
  bugActions,
  type BugNoteAction,
  type BugTransition,
} from "../lib/state";

import { BugFileList } from "./bug-file-list";
import { useBugCopy } from "./use-bug-copy";

export function BugDetail({
  projectId,
  bugId,
}: {
  projectId: string;
  bugId: string;
}) {
  const t = useTranslations("Bugs");
  const portal = useTranslations("Portal");
  const nav = useTranslations("Workspace");
  const copy = useBugCopy();
  const { bugs, transitionBug, addBugMessage } = usePortal();
  const bug = bugs.find(
    (item) => item.id === bugId && item.projectId === projectId,
  );
  const application = getApplication(projectId);
  const base = `/projects/${projectId}/support/bugs`;
  if (!application) return <ProjectUnavailable />;
  if (!bug) return <RecordUnavailable backHref={base} />;

  const actions = bugActions(bug.status).map((kind) => ({
    value: kind,
    label: bugActionLabel(kind, portal),
  }));
  const fields = [
    { label: portal("severity"), value: copy.severity(bug.severity) },
    { label: t("happened"), value: bug.happened },
    { label: t("steps"), value: bug.steps },
    { label: t("expected"), value: bug.expected },
    { label: t("environment"), value: bug.environment },
    { label: t("impactScope"), value: copy.impact(bug.impactScope) },
    { label: t("urgency"), value: copy.urgency(bug.urgency) },
    { label: t("correlation"), value: bug.correlationId },
    { label: t("impactDetail"), value: bug.impactDetail },
  ].filter((field) => field.value.trim().length > 0);

  return (
    <RecordDetailFrame
      title={bug.title}
      status={copy.status(bug.status)}
      meta={bug.id}
      breadcrumbs={recordTrail(application, nav("projects"), [
        { title: t("title"), href: base },
        { title: bug.title, href: `${base}/${bug.id}` },
      ])}
    >
      <RecordFields fields={fields} />
      {bug.pageUrl ? (
        <Stack gap={4}>
          <Text size="sm" fw={600}>
            {t("pageUrl")}
          </Text>
          <Anchor href={bug.pageUrl} target="_blank" rel="noopener noreferrer">
            {bug.pageUrl}
          </Anchor>
        </Stack>
      ) : null}
      <BugFileList label={t("attachments")} files={bug.attachments} />
      {bug.messages.length > 0 || bug.status !== "Resolved" ? (
        <Stack component="section" aria-label={t("discussion")} gap="sm">
          <Title order={2} size="h4">
            {t("discussion")}
          </Title>
          {bug.messages.map((message) => (
            <Text key={message.id} style={{ whiteSpace: "pre-wrap" }}>
              {message.text}
            </Text>
          ))}
          {bug.status === "Resolved" ? null : (
            <NoteAction
              actions={[{ value: "message", label: t("postMessage") }]}
              noteLabel={t("message")}
              submitLabel={t("postMessage")}
              onSubmit={(_action, text) =>
                addBugMessage(projectId, bug.id, text)
              }
            />
          )}
        </Stack>
      ) : null}
      <NotesList
        title={portal("notes")}
        notes={bug.notes.map((note) => ({
          label: bugActionLabel(note.action, portal),
          text: note.text,
        }))}
      />
      <NoteAction
        actions={actions}
        onSubmit={(action, note) => {
          if (!isBugAction(action)) return;
          transitionBug(projectId, bug.id, { kind: action, note });
        }}
      />
    </RecordDetailFrame>
  );
}

function isBugAction(value: string): value is BugTransition["kind"] {
  return value === "start" || value === "resolve" || value === "reopen";
}

function bugActionLabel(
  action: BugNoteAction,
  t: ReturnType<typeof useTranslations<"Portal">>,
) {
  switch (action) {
    case "start":
      return t("actionStart");
    case "resolve":
      return t("actionResolve");
    case "reopen":
      return t("actionReopen");
    default: {
      const neverAction: never = action;
      return neverAction;
    }
  }
}
