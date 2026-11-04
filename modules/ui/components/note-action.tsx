"use client";

import {
  Alert,
  Button,
  Group,
  Select,
  Stack,
  Text,
  Textarea,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useState } from "react";
import { useTranslations } from "next-intl";

import { useUnsavedDraft } from "./use-unsaved-draft";

export function NoteAction({
  actions,
  submitLabel,
  noteLabel,
  useActionLabel = false,
  protectDraft = false,
  errorMessage,
  successMessage,
  validateNote,
  onSubmit,
}: {
  actions: { value: string; label: string }[];
  submitLabel?: string;
  noteLabel?: string;
  useActionLabel?: boolean;
  protectDraft?: boolean;
  errorMessage?: string;
  successMessage?: string;
  validateNote?: (value: string) => string | null;
  onSubmit: (action: string, note: string) => boolean | void;
}) {
  const t = useTranslations("Portal");
  const [action, setAction] = useState(actions[0]?.value ?? "");
  const [outcome, setOutcome] = useState<"idle" | "failed" | "succeeded">(
    "idle",
  );
  const selected = actions.some((item) => item.value === action)
    ? action
    : (actions[0]?.value ?? "");
  const form = useForm({
    initialValues: { note: "" },
    validate: {
      note: (value) =>
        value.trim() ? (validateNote?.(value) ?? null) : t("required"),
    },
  });
  useUnsavedDraft(protectDraft && form.isDirty(), t("discardDraft"));

  if (actions.length === 0 || !selected) return null;
  const current = actions.find((item) => item.value === selected) ?? actions[0];

  return (
    <form
      onSubmit={form.onSubmit((values) => {
        if (onSubmit(selected, values.note) === false) {
          setOutcome("failed");
          return;
        }
        setOutcome("succeeded");
        form.reset();
        if (useActionLabel) setAction(actions[0]?.value ?? "");
      })}
    >
      <Stack gap="sm">
        {actions.length > 1 ? (
          <Select
            label={t("action")}
            data={actions}
            value={selected}
            allowDeselect={false}
            onChange={(value) => {
              if (value) setAction(value);
            }}
          />
        ) : (
          <Text fw={600}>{current?.label}</Text>
        )}
        <Textarea
          label={noteLabel ?? t("note")}
          required
          minRows={3}
          {...form.getInputProps("note")}
        />
        <Group justify="flex-end">
          <Button type="submit">
            {submitLabel ?? (useActionLabel ? current?.label : t("apply"))}
          </Button>
        </Group>
        {outcome === "failed" && errorMessage ? (
          <Alert color="red" role="alert">
            {errorMessage}
          </Alert>
        ) : null}
        {outcome === "succeeded" && successMessage ? (
          <Text size="sm" role="status">
            {successMessage}
          </Text>
        ) : null}
      </Stack>
    </form>
  );
}
