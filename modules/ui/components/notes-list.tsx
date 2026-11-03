"use client";

import { Stack, Text, Title } from "@mantine/core";

export function NotesList({
  title,
  notes,
}: {
  title: string;
  notes: { label: string; text: string }[];
}) {
  if (notes.length === 0) return null;
  return (
    <Stack component="section" aria-label={title} gap="sm">
      <Title order={2} size="h4">
        {title}
      </Title>
      {notes.map((note, index) => (
        <Stack key={`${note.label}-${index}`} gap={2}>
          <Text size="sm" fw={600}>
            {note.label}
          </Text>
          <Text style={{ whiteSpace: "pre-wrap" }}>{note.text}</Text>
        </Stack>
      ))}
    </Stack>
  );
}
