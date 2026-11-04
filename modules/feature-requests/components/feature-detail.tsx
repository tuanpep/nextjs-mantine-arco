"use client";

import { Anchor } from "@mantine/core";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { parseAsString, useQueryState } from "nuqs";

import { usePortal } from "@/modules/portal/components/portal-provider";
import { getApplication } from "@/modules/projects/lib/applications";
import { recordTrail } from "@/modules/projects/lib/record-trail";
import { NotesList } from "@/modules/ui/components/notes-list";
import { ProjectUnavailable } from "@/modules/ui/components/project-unavailable";
import { RecordDetailFrame } from "@/modules/ui/components/record-detail-frame";
import { RecordFields } from "@/modules/ui/components/record-fields";
import { RecordUnavailable } from "@/modules/ui/components/record-unavailable";

import { featureQueueReturnHref } from "../lib/queue-navigation";
import { FeatureDecisionForm } from "./feature-decision-form";
import { FeatureNoteForm } from "./feature-note-form";
import { useFeatureCopy } from "./use-feature-copy";

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
  const copy = useFeatureCopy();
  const [returnTo] = useQueryState("returnTo", parseAsString);
  const { features, transitionFeature, addFeatureNote } = usePortal();
  const item = features.find(
    (entry) => entry.id === featureId && entry.projectId === projectId,
  );
  const application = getApplication(projectId);
  const base = `/projects/${projectId}/ideas/features`;
  const backHref = featureQueueReturnHref(base, returnTo);
  if (!application) return <ProjectUnavailable />;
  if (!item) return <RecordUnavailable backHref={backHref} />;

  return (
    <RecordDetailFrame
      title={item.title}
      status={copy.status(item.status)}
      meta={item.id}
      breadcrumbs={recordTrail(application, nav("projects"), [
        { title: t("title"), href: backHref },
        { title: item.title, href: `${base}/${item.id}` },
      ])}
    >
      <Anchor component={Link} href={backHref}>
        {t("back")}
      </Anchor>
      <RecordFields
        fields={[
          { label: t("problem"), value: item.problem },
          { label: t("outcome"), value: item.outcome },
        ]}
      />
      <NotesList
        title={portal("notes")}
        notes={item.notes.map((note) => ({
          label: copy.action(note.action),
          text: note.text,
        }))}
      />
      <FeatureNoteForm
        onSubmit={(text) => addFeatureNote(projectId, item.id, text)}
      />
      {item.status === "Submitted" ? (
        <FeatureDecisionForm
          onSubmit={(action) => transitionFeature(projectId, item.id, action)}
        />
      ) : null}
    </RecordDetailFrame>
  );
}
