"use client";

import { Button, Group, Select, Stack, Text, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useTranslations } from "next-intl";
import { useState } from "react";
import {
  FEATURE_TEXT_MAX_LENGTH,
  validateFeatureText,
  type FeatureTransition,
} from "../lib/state";

export function FeatureDecisionForm({
  onSubmit,
}: {
  onSubmit: (action: FeatureTransition) => boolean;
}) {
  const t = useTranslations("Features");
  const portal = useTranslations("Portal");
  const [kind, setKind] = useState<FeatureTransition["kind"]>("accept");
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
        if (onSubmit({ kind, note })) form.reset();
        else form.setFieldError("note", t("actionFailed"));
      })}
    >
      <Stack gap="sm">
        <Select
          label={t("decision")}
          data={[
            { value: "accept", label: portal("actionAccept") },
            { value: "decline", label: portal("actionDecline") },
          ]}
          value={kind}
          allowDeselect={false}
          onChange={(value) => {
            if (value === "accept" || value === "decline") setKind(value);
          }}
        />
        {kind === "accept" ? (
          <Text size="sm">{t("acceptanceNotice")}</Text>
        ) : null}
        <Textarea
          label={t("decisionReason")}
          required
          minRows={3}
          {...form.getInputProps("note")}
        />
        <Group justify="flex-end">
          <Button type="submit">{t("applyDecision")}</Button>
        </Group>
      </Stack>
    </form>
  );
}
