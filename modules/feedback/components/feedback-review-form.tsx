"use client";

import { Button, Stack, Textarea, VisuallyHidden } from "@mantine/core";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { useUnsavedDraft } from "@/modules/ui/components/use-unsaved-draft";
import { FEEDBACK_TEXT_MAX_LENGTH, validateFeedbackText } from "../lib/state";

export function FeedbackReviewForm({
  onSubmit,
}: {
  onSubmit: (note: string) => boolean;
}) {
  const t = useTranslations("Feedback");
  const portal = useTranslations("Portal");
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  useUnsavedDraft(note.length > 0, portal("discardDraft"));

  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        const issue = validateFeedbackText(note, FEEDBACK_TEXT_MAX_LENGTH);
        if (issue) {
          setError(
            issue === "required"
              ? portal("required")
              : t("noteTooLong", { limit: FEEDBACK_TEXT_MAX_LENGTH }),
          );
          return;
        }
        if (!onSubmit(note)) setError(t("actionFailed"));
      }}
    >
      <Stack gap="sm">
        <Textarea
          label={t("reviewNote")}
          required
          value={note}
          error={error}
          onChange={(event) => setNote(event.currentTarget.value)}
        />
        {error ? <VisuallyHidden role="alert">{error}</VisuallyHidden> : null}
        <Button type="submit">{t("markReviewed")}</Button>
      </Stack>
    </form>
  );
}
