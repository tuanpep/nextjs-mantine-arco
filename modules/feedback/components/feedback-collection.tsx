"use client";

import {
  Badge,
  Box,
  Button,
  Group,
  Paper,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import Link from "next/link";
import { parseAsString, useQueryState } from "nuqs";

import { getApplication } from "@/modules/projects/lib/applications";

import { feedbackItems } from "../lib/fixtures";

export function FeedbackCollection({ projectId }: { projectId: string }) {
  const application = getApplication(projectId);
  const [query, setQuery] = useQueryState("q", parseAsString.withDefault(""));
  const visible = feedbackItems.filter(
    (item) =>
      item.projectId === projectId &&
      `${item.title} ${item.observation}`
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
  );

  return (
    <Stack gap="md">
      <Text size="sm" c="dimmed">
        {application?.name ?? "Project"} / Feedback
      </Text>
      <Group justify="space-between" align="flex-start">
        <div>
          <Title order={1} size="h2">
            Feedback
          </Title>
          <Text size="sm" c="dimmed">
            Share an observation. Acknowledgement is not a promise to change the
            product.
          </Text>
        </div>
        <Button component={Link} href={`/projects/${projectId}/feedback/new`}>
          Share feedback
        </Button>
      </Group>
      <Paper withBorder radius="sm" style={{ overflow: "hidden" }}>
        <Box
          p="sm"
          style={{
            borderBottom: "1px solid var(--mantine-color-default-border)",
          }}
        >
          <TextInput
            aria-label="Search feedback"
            placeholder="Search feedback…"
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
          {visible.length} observations in this project
        </Text>
        {visible.map((item) => (
          <Box
            key={item.id}
            component={Link}
            href={`/projects/${projectId}/feedback/${item.id}`}
            px="md"
            py="sm"
            display="block"
            c="inherit"
            td="none"
            style={{
              borderTop: "1px solid var(--mantine-color-default-border)",
            }}
          >
            <Group justify="space-between">
              <Text size="xs" c="dimmed">
                {item.id}
              </Text>
              <Badge variant="light" color="gray">
                {item.disposition}
              </Badge>
            </Group>
            <Title order={2} size="sm" mt={4}>
              {item.title}
            </Title>
            <Text size="sm" mt={4} lineClamp={2}>
              {item.observation}
            </Text>
            <Text size="xs" c="dimmed" mt={6}>
              Next actor: {item.nextActor}
            </Text>
          </Box>
        ))}
        {visible.length === 0 && (
          <Box p="xl" ta="center">
            <Title order={2} size="lg">
              No matching feedback
            </Title>
          </Box>
        )}
      </Paper>
    </Stack>
  );
}
