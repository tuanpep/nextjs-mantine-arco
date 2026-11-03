"use client";

import { Button, Group, Select, Stack, Text, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useState } from "react";
import { useTranslations } from "next-intl";

export function NoteAction({
  actions,
  submitLabel,
  noteLabel,
  onSubmit,
}: {
  actions: { value: string; label: string }[];
  submitLabel?: string;
  noteLabel?: string;
  onSubmit: (action: string, note: string) => void;
}) {
  const t = useTranslations("Portal");
  const [action, setAction] = useState(actions[0]?.value ?? "");
  const selected = actions.some((item) => item.value === action)
    ? action
    : (actions[0]?.value ?? "");
  const form = useForm({
    initialValues: { note: "" },
    validate: {
      note: (value) => (value.trim() ? null : t("required")),
    },
  });

  if (actions.length === 0 || !selected) return null;
  const current = actions.find((item) => item.value === selected) ?? actions[0];

  return (
    <form
      onSubmit={form.onSubmit((values) => {
        onSubmit(selected, values.note);
        form.reset();
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
          <Button type="submit">{submitLabel ?? t("apply")}</Button>
        </Group>
      </Stack>
    </form>
  );
}
