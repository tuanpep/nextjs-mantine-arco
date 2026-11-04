"use client";

import { useTranslations } from "next-intl";
import { useQueryStates } from "nuqs";

import { usePortal } from "@/modules/portal/components/portal-provider";
import { getApplication } from "@/modules/projects/lib/applications";
import { recordTrail } from "@/modules/projects/lib/record-trail";
import { NoteAction } from "@/modules/ui/components/note-action";
import { NotesList } from "@/modules/ui/components/notes-list";
import { ProjectUnavailable } from "@/modules/ui/components/project-unavailable";
import { RecordDetailFrame } from "@/modules/ui/components/record-detail-frame";
import { RecordFields } from "@/modules/ui/components/record-fields";
import { RecordUnavailable } from "@/modules/ui/components/record-unavailable";

import { helpSearchParams, serializeHelpQueue } from "../lib/search-params";
import {
  helpActions,
  type HelpNoteAction,
  type HelpStatus,
  type HelpTransition,
} from "../lib/state";

export function HelpDetail({
  projectId,
  helpId,
}: {
  projectId: string;
  helpId: string;
}) {
  const t = useTranslations("HelpRequests");
  const portal = useTranslations("Portal");
  const nav = useTranslations("Workspace");
  const { help, transitionHelp } = usePortal();
  const [query] = useQueryStates(helpSearchParams);
  const item = help.find(
    (entry) => entry.id === helpId && entry.projectId === projectId,
  );
  const application = getApplication(projectId);
  const base = `/projects/${projectId}/support/help`;
  const back = serializeHelpQueue(base, query);
  if (!application) return <ProjectUnavailable />;
  if (!item) return <RecordUnavailable backHref={back} />;

  return (
    <RecordDetailFrame
      title={item.question}
      status={helpStatusLabel(item.status, portal)}
      meta={item.id}
      breadcrumbs={recordTrail(application, nav("projects"), [
        { title: t("title"), href: back },
        {
          title: item.question,
          href: serializeHelpQueue(`${base}/${item.id}`, query),
        },
      ])}
    >
      <RecordFields fields={[{ label: t("tried"), value: item.tried }]} />
      <NotesList
        title={t("conversation")}
        notes={item.notes.map((note) => ({
          label: helpActionLabel(note.action, t),
          text: note.text,
        }))}
      />
      <NoteAction
        key={item.id}
        noteLabel={t("message")}
        useActionLabel
        protectDraft
        errorMessage={t("updateFailed")}
        actions={helpActions(item.status).map((kind) => ({
          value: kind,
          label: helpActionLabel(kind, t),
        }))}
        onSubmit={(action, note) => {
          if (!isHelpAction(action)) return false;
          return transitionHelp(projectId, item.id, { kind: action, note });
        }}
      />
    </RecordDetailFrame>
  );
}

function isHelpAction(value: string): value is HelpTransition["kind"] {
  return value === "reply" || value === "answer" || value === "reopen";
}

function helpStatusLabel(
  status: HelpStatus,
  t: ReturnType<typeof useTranslations<"Portal">>,
) {
  switch (status) {
    case "Open":
      return t("statusOpen");
    case "Answered":
      return t("statusAnswered");
    default: {
      const neverStatus: never = status;
      return neverStatus;
    }
  }
}

function helpActionLabel(
  action: HelpNoteAction,
  t: ReturnType<typeof useTranslations<"HelpRequests">>,
) {
  switch (action) {
    case "reply":
      return t("reply");
    case "answer":
      return t("answer");
    case "reopen":
      return t("reopen");
    default: {
      const neverAction: never = action;
      return neverAction;
    }
  }
}
