"use client";

import { Anchor, Stack, Text, Title } from "@mantine/core";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { parseAsString, useQueryState } from "nuqs";

import { usePortal } from "@/modules/portal/components/portal-provider";
import { getApplication } from "@/modules/projects/lib/applications";
import { recordTrail } from "@/modules/projects/lib/record-trail";
import { NoteAction } from "@/modules/ui/components/note-action";
import { ProjectUnavailable } from "@/modules/ui/components/project-unavailable";
import { RecordDetailFrame } from "@/modules/ui/components/record-detail-frame";
import { RecordFields } from "@/modules/ui/components/record-fields";
import { RecordUnavailable } from "@/modules/ui/components/record-unavailable";

import {
  bugActions,
  validateBugText,
  type BugNoteAction,
  type BugTransition,
} from "../lib/state";

import { BugFileList } from "./bug-file-list";
import { BugActivity } from "./bug-activity";
import { bugQueueReturnHref } from "../lib/queue-navigation";
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
  const [returnTo] = useQueryState("returnTo", parseAsString);
  const { bugs, transitionBug, addBugMessage } = usePortal();
  const bug = bugs.find(
    (item) => item.id === bugId && item.projectId === projectId,
  );
  const application = getApplication(projectId);
  const base = `/projects/${projectId}/support/bugs`;
  const backHref = bugQueueReturnHref(base, returnTo);
  if (!application) return <ProjectUnavailable />;
  if (!bug) return <RecordUnavailable backHref={backHref} />;

  const actions = bugActions(bug.status).map((kind) => ({
    value: kind,
    label: bugActionLabel(kind, portal, t),
  }));
  const informationRequest =
    bug.status === "Waiting for reporter"
      ? bug.notes.findLast((note) => note.action === "wait")
      : undefined;
  const fields = [
    { label: t("happened"), value: bug.happened },
    {
      label: t("steps"),
      value: bug.reproduction === "unknown" ? t("stepsUnknown") : bug.steps,
    },
    { label: t("expected"), value: bug.expected },
    { label: t("impactDetail"), value: bug.impactDetail },
  ].filter((field) => field.value.trim().length > 0);
  const details = [
    { label: portal("severity"), value: copy.severity(bug.severity) },
    { label: t("environment"), value: bug.environment },
    { label: t("impactScope"), value: copy.impact(bug.impactScope) },
    { label: t("urgency"), value: copy.urgency(bug.urgency) },
    { label: t("correlation"), value: bug.correlationId },
  ].filter((field) => field.value.trim().length > 0);

  return (
    <RecordDetailFrame
      title={bug.title}
      status={copy.status(bug.status)}
      meta={bug.id}
      pane={
        <Stack gap="lg">
          <RecordFields fields={details} />
          {bug.pageUrl ? (
            <Stack gap={4}>
              <Text size="sm" fw={600}>
                {t("pageUrl")}
              </Text>
              <Anchor
                href={bug.pageUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {bug.pageUrl}
              </Anchor>
            </Stack>
          ) : null}
          <NoteAction
            key={`${bug.id}-action`}
            protectDraft
            errorMessage={t("updateFailed")}
            successMessage={t("statusSaved")}
            validateNote={(value) =>
              validateBugText(value, 10000) === "tooLong"
                ? t("tooLong", { limit: 10000 })
                : null
            }
            actions={actions}
            onSubmit={(action, note) => {
              if (!isBugAction(action)) return false;
              return transitionBug(projectId, bug.id, { kind: action, note });
            }}
          />
        </Stack>
      }
      breadcrumbs={recordTrail(application, nav("projects"), [
        { title: t("title"), href: backHref },
        { title: bug.title, href: `${base}/${bug.id}` },
      ])}
    >
      <Anchor component={Link} href={backHref}>
        {t("backToReports")}
      </Anchor>
      <RecordFields fields={fields} />
      <BugFileList label={t("attachments")} files={bug.attachments} />
      <BugActivity
        bug={bug}
        actionLabel={(action) => bugActionLabel(action, portal, t)}
      />
      <Stack component="section" aria-label={t("discussion")} gap="sm">
        <Title order={2} size="h4">
          {t("discussion")}
        </Title>
        {bug.status === "Waiting for reporter" ? (
          <Stack gap={4}>
            {informationRequest ? (
              <>
                <Text size="sm" fw={600}>
                  {t("informationRequested")}
                </Text>
                <Text style={{ whiteSpace: "pre-wrap" }}>
                  {informationRequest.text}
                </Text>
              </>
            ) : null}
            <Text size="sm" c="dimmed">
              {t("replyResumes")}
            </Text>
          </Stack>
        ) : null}
        <NoteAction
          key={`${bug.id}-message`}
          protectDraft
          errorMessage={t("updateFailed")}
          successMessage={t("messageSaved")}
          validateNote={(value) =>
            validateBugText(value, 10000) === "tooLong"
              ? t("tooLong", { limit: 10000 })
              : null
          }
          actions={[{ value: "message", label: t("postMessage") }]}
          noteLabel={t("message")}
          submitLabel={t("postMessage")}
          onSubmit={(_action, text) => addBugMessage(projectId, bug.id, text)}
        />
      </Stack>
    </RecordDetailFrame>
  );
}

function isBugAction(value: string): value is BugTransition["kind"] {
  return (
    value === "start" ||
    value === "resolve" ||
    value === "reopen" ||
    value === "wait" ||
    value === "resume"
  );
}

function bugActionLabel(
  action: BugNoteAction,
  t: ReturnType<typeof useTranslations<"Portal">>,
  bugs: ReturnType<typeof useTranslations<"Bugs">>,
) {
  switch (action) {
    case "start":
      return t("actionStart");
    case "resolve":
      return t("actionResolve");
    case "reopen":
      return t("actionReopen");
    case "wait":
      return bugs("actionWait");
    case "resume":
      return bugs("actionResume");
    default: {
      const neverAction: never = action;
      return neverAction;
    }
  }
}
