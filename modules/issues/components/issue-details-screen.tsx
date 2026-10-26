"use client";

import {
  Anchor,
  Badge,
  Button,
  Group,
  Stack,
  Tabs,
  TabsList,
  TabsPanel,
  TabsTab,
  Text,
  Textarea,
  Title,
} from "@mantine/core";
import Link from "next/link";
import { useState } from "react";

import { statusColor, type Issue } from "../lib/fixtures";

export function IssueDetailsScreen({ issue }: { issue: Issue }) {
  const [draft, setDraft] = useState("");
  const [comments, setComments] = useState(issue.comments);

  function addComment() {
    const body = draft.trim();
    if (!body) {
      return;
    }

    setComments((current) => [...current, { author: "You", body }]);
    setDraft("");
  }

  return (
    <Stack gap="md">
      <Anchor component={Link} href="/issues" size="sm">
        Issues
      </Anchor>
      <Group justify="space-between">
        <Title order={1}>{issue.title}</Title>
        <Badge variant="light" color={statusColor[issue.status]}>
          {issue.status}
        </Badge>
      </Group>
      <Text c="dimmed">
        {issue.id} · {issue.project}
      </Text>
      <Tabs defaultValue="discussion">
        <TabsList>
          <TabsTab value="discussion">Discussion</TabsTab>
          <TabsTab value="activity">Activity</TabsTab>
        </TabsList>
        <TabsPanel value="discussion" pt="md">
          <Stack gap="md">
            <Text>{issue.description}</Text>
            {comments.map((comment, index) => (
              <Stack key={`${comment.author}-${index}`} gap={4}>
                <Text fw={600}>{comment.author}</Text>
                <Text>{comment.body}</Text>
              </Stack>
            ))}
            <Textarea
              aria-label="Comment"
              placeholder="Write a comment"
              value={draft}
              onChange={(event) => setDraft(event.currentTarget.value)}
              minRows={3}
            />
            <Group justify="flex-end">
              <Button variant="filled" onClick={addComment}>
                Comment
              </Button>
            </Group>
          </Stack>
        </TabsPanel>
        <TabsPanel value="activity" pt="md">
          <Stack gap="xs">
            {issue.activity.map((entry) => (
              <Text key={entry}>{entry}</Text>
            ))}
          </Stack>
        </TabsPanel>
      </Tabs>
    </Stack>
  );
}
