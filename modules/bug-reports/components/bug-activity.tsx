import { Stack, Text, Title } from "@mantine/core";
import { useTranslations } from "next-intl";

import type { BugNoteAction, BugReport } from "../lib/state";

export function BugActivity({
  bug,
  actionLabel,
}: {
  bug: BugReport;
  actionLabel: (action: BugNoteAction) => string;
}) {
  const t = useTranslations("Bugs");
  const events = [
    ...bug.notes.map((note) => ({
      key: `note-${note.order}`,
      order: note.order,
      label: actionLabel(note.action),
      text: note.text,
      resumed: false,
    })),
    ...bug.messages.map((message) => ({
      key: `message-${message.id}`,
      order: message.order,
      label: t("messagePosted"),
      text: message.text,
      resumed: message.resumedFromWaiting,
    })),
  ].sort((a, b) => a.order - b.order);

  return (
    <section aria-labelledby="bug-activity-heading">
      <Title id="bug-activity-heading" order={2} size="h4">
        {t("activity")}
      </Title>
      <ol>
        {events.map((event) => (
          <li key={event.key}>
            <Stack gap={4}>
              <Text fw={600}>
                {event.label}
                {event.resumed ? ` · ${t("returnedToOpen")}` : ""}
              </Text>
              <Text
                style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}
              >
                {event.text}
              </Text>
            </Stack>
          </li>
        ))}
      </ol>
    </section>
  );
}
