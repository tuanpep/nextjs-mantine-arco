"use client";

import { Text } from "@mantine/core";
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
  featureActions,
  type FeatureNoteAction,
  type FeatureStatus,
  type FeatureTransition,
} from "../lib/state";

export function FeatureDetail({
  projectId,
  featureId,
}: {
  projectId: string;
  featureId: string;
}) {
  const t = useTranslations("Features");
  const portal = useTranslations("Portal");
  const nav = useTranslations("Workspace");
  const { features, transitionFeature } = usePortal();
  const item = features.find(
    (entry) => entry.id === featureId && entry.projectId === projectId,
  );
  const application = getApplication(projectId);
  const base = `/projects/${projectId}/ideas/features`;
  if (!application) return <ProjectUnavailable />;
  if (!item) return <RecordUnavailable backHref={base} />;

  return (
    <RecordDetailFrame
      title={item.title}
      status={featureStatusLabel(item.status, portal)}
      meta={item.id}
      breadcrumbs={recordTrail(application, nav("projects"), [
        { title: t("title"), href: base },
        { title: item.title, href: `${base}/${item.id}` },
      ])}
    >
      <RecordFields
        fields={[
          { label: t("problem"), value: item.problem },
          { label: t("outcome"), value: item.outcome },
        ]}
      />
      <NotesList
        title={portal("notes")}
        notes={item.notes.map((note) => ({
          label: featureActionLabel(note.action, portal),
          text: note.text,
        }))}
      />
      {featureActions(item.status).length === 0 ? (
        <Text size="sm">{portal("decisionStands")}</Text>
      ) : (
        <NoteAction
          actions={featureActions(item.status).map((kind) => ({
            value: kind,
            label: featureActionLabel(kind, portal),
          }))}
          onSubmit={(action, note) => {
            if (!isFeatureAction(action)) return;
            transitionFeature(projectId, item.id, { kind: action, note });
          }}
        />
      )}
    </RecordDetailFrame>
  );
}

function isFeatureAction(value: string): value is FeatureTransition["kind"] {
  return value === "accept" || value === "decline";
}

function featureStatusLabel(
  status: FeatureStatus,
  t: ReturnType<typeof useTranslations<"Portal">>,
) {
  switch (status) {
    case "Submitted":
      return t("statusSubmitted");
    case "Accepted":
      return t("statusAccepted");
    case "Declined":
      return t("statusDeclined");
    default: {
      const neverStatus: never = status;
      return neverStatus;
    }
  }
}

function featureActionLabel(
  action: FeatureNoteAction,
  t: ReturnType<typeof useTranslations<"Portal">>,
) {
  switch (action) {
    case "accept":
      return t("actionAccept");
    case "decline":
      return t("actionDecline");
    default: {
      const neverAction: never = action;
      return neverAction;
    }
  }
}
