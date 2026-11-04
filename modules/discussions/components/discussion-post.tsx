"use client";

import { Avatar, Group, Paper, Stack, Text } from "@mantine/core";
import { useFormatter, useTranslations } from "next-intl";

import { DEMO_AUTHOR } from "../lib/state";

export function DiscussionPost({
  author,
  createdAt,
  text,
  opening = false,
}: {
  author: string;
  createdAt: string;
  text: string;
  opening?: boolean;
}) {
  const t = useTranslations("Discussions");
  const portal = useTranslations("Portal");
  const format = useFormatter();
  const name = author === DEMO_AUTHOR ? portal("you") : author;
  return (
    <Paper
      component="article"
      withBorder
      p="md"
      aria-label={opening ? t("body") : t("replyBy", { author: name })}
    >
      <Stack gap="sm">
        <Group wrap="nowrap" align="flex-start">
          <Avatar color={opening ? "blue" : "gray"} radius="xl" aria-hidden>
            {name.slice(0, 1)}
          </Avatar>
          <Stack gap={0}>
            <Text size="sm" fw={600}>
              {name}
            </Text>
            <Text component="time" dateTime={createdAt} size="xs" c="dimmed">
              {format.dateTime(new Date(createdAt), {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </Text>
          </Stack>
        </Group>
        <Text
          size="sm"
          style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}
        >
          {text}
        </Text>
      </Stack>
    </Paper>
  );
}
