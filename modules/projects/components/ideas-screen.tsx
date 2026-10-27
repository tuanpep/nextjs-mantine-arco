"use client";

import {
  Badge,
  Box,
  Group,
  Paper,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { parseAsString, useQueryState } from "nuqs";

const ideas = [
  {
    id: "IDE-024",
    title: "Remember my last workspace",
    summary: "Return to the workspace I used most recently after signing in.",
    position: "Under review",
    next: "Product team to review the use case.",
  },
  {
    id: "IDE-019",
    title: "Make product links easier to find",
    summary: "Group frequently used product links on the portal home page.",
    position: "Received",
    next: "Product team to review the suggestion.",
  },
];

export function IdeasScreen() {
  const [query, setQuery] = useQueryState("q", parseAsString.withDefault(""));
  const visible = ideas.filter((idea) =>
    `${idea.title} ${idea.summary}`
      .toLowerCase()
      .includes(query.trim().toLowerCase()),
  );
  return (
    <Stack gap="md">
      <Text size="sm" c="dimmed">
        Projects / Beacon Portal / Work items / Ideas
      </Text>
      <Group gap="sm">
        <Title order={1} size="h2">
          Ideas
        </Title>
        <Badge variant="light" color="gray" size="sm">
          Read-only
        </Badge>
      </Group>
      <Paper withBorder radius="sm" style={{ overflow: "hidden" }}>
        <Box
          p="sm"
          style={{
            borderBottom: "1px solid var(--mantine-color-default-border)",
          }}
        >
          <TextInput
            aria-label="Search ideas"
            placeholder="Search ideas…"
            leftSection={<IconSearch size={16} />}
            value={query}
            onChange={(event) =>
              void setQuery(event.currentTarget.value || null)
            }
          />
        </Box>
        <Text
          size="xs"
          c="dimmed"
          px="md"
          py="xs"
          bg="var(--mantine-color-default-hover)"
          aria-live="polite"
        >
          {visible.length} authorized ideas
        </Text>
        {visible.map((idea) => (
          <Box
            key={idea.id}
            px="md"
            py="sm"
            style={{
              borderTop: "1px solid var(--mantine-color-default-border)",
            }}
          >
            <Group justify="space-between">
              <Group gap="xs">
                <Badge variant="light" color="violet" size="xs">
                  Idea
                </Badge>
                <Text size="xs" c="dimmed">
                  {idea.id}
                </Text>
              </Group>
              <Badge variant="light" color="violet">
                {idea.position}
              </Badge>
            </Group>
            <Title order={2} size="sm" mt={4}>
              {idea.title}
            </Title>
            <Text size="sm" mt={4}>
              {idea.summary}
            </Text>
            <Group gap="xs" mt={6}>
              <Text size="xs" c="dimmed">
                Responsibility: Product Services
              </Text>
              <Text size="xs" c="dimmed">
                Next action: {idea.next}
              </Text>
              <Text size="xs" c="dimmed">
                Official outcome: not recorded
              </Text>
            </Group>
          </Box>
        ))}
        {visible.length === 0 && (
          <Box p="xl" ta="center">
            <Title order={2} size="lg">
              No matching ideas
            </Title>
          </Box>
        )}
      </Paper>
    </Stack>
  );
}
