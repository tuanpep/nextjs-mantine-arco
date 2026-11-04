"use client";

import { Button, Group, Stack, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useTranslations } from "next-intl";
import { FEATURE_TEXT_MAX_LENGTH, validateFeatureText } from "../lib/state";

export function FeatureNoteForm({
  onSubmit,
}: {
  onSubmit: (text: string) => boolean;
}) {
  const t = useTranslations("Features");
  const portal = useTranslations("Portal");
  const form = useForm({
    initialValues: { note: "" },
    validate: {
      note: (value) =>
        validateFeatureText(value, FEATURE_TEXT_MAX_LENGTH) === "required"
          ? portal("required")
          : validateFeatureText(value, FEATURE_TEXT_MAX_LENGTH) === "tooLong"
            ? t("noteTooLong")
            : null,
    },
  });
  return (
    <form
      onSubmit={form.onSubmit(({ note }) => {
        if (onSubmit(note)) form.reset();
        else form.setFieldError("note", t("actionFailed"));
      })}
    >
      <Stack gap="sm">
        <Textarea
          label={t("note")}
          required
          minRows={3}
          {...form.getInputProps("note")}
        />
        <Group justify="flex-end">
          <Button type="submit">{t("addNote")}</Button>
        </Group>
      </Stack>
    </form>
  );
}
