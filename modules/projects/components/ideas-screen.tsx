"use client";

import {
  Alert,
  Badge,
  Box,
  Button,
  Card,
  Group,
  Paper,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useMounted } from "@mantine/hooks";
import { IconSearch, IconThumbUp } from "@tabler/icons-react";
import { parseAsString, useQueryState } from "nuqs";
import { useState } from "react";

import { DetailsFormFields } from "@/lib/form-details";

import { getApplication } from "../lib/applications";
import { ideaIntakeFields } from "../lib/idea-intake-fields";

type Idea = {
  id: string;
  title: string;
  problem: string;
  outcome: string;
  suggestedChange: string;
  sponsorCandidate: string;
  votes: number;
  votedByMe: boolean;
  position: string;
  next: string;
};

const seedIdeas: Idea[] = [
  {
    id: "IDE-024",
    title: "Remember my last workspace",
    problem: "After signing in I land on a generic page instead of my project.",
    outcome: "Return to the workspace I used most recently after signing in.",
    suggestedChange: "Store last project per account in the shell.",
    sponsorCandidate: "",
    votes: 12,
    votedByMe: false,
    position: "Under review",
    next: "Lan Vo to record a decision reason.",
  },
  {
    id: "IDE-019",
    title: "Make product links easier to find",
    problem: "Frequently used product links are hard to reach from the workspace.",
    outcome: "Group frequently used product links inside the project workspace.",
    suggestedChange: "",
    sponsorCandidate: "Khoa Dang",
    votes: 3,
    votedByMe: false,
    position: "Received",
    next: "Lan Vo to review the suggestion.",
  },
];

export function IdeasScreen({ projectId }: { projectId: string }) {
  const mounted = useMounted();
  const application = getApplication(projectId);
  const [query, setQuery] = useQueryState("q", parseAsString.withDefault(""));
  const [ideas, setIdeas] = useState(seedIdeas);
  const [composing, setComposing] = useState(false);
  const [notice, setNotice] = useState("");
  const form = useForm({
    initialValues: {
      title: "",
      problem: "",
      outcome: "",
      suggestedChange: "",
      sponsorCandidate: "",
    },
    validate: {
      title: (value) => (value.trim() ? null : "Enter a short title."),
      problem: (value) =>
        value.trim() ? null : "Describe the problem in plain language.",
      outcome: (value) =>
        value.trim() ? null : "Describe the desired outcome.",
    },
  });
  const visible = ideas.filter((idea) =>
    `${idea.title} ${idea.problem} ${idea.outcome}`
      .toLowerCase()
      .includes(query.trim().toLowerCase()),
  );

  function toggleVote(id: string) {
    setIdeas((current) =>
      current.map((idea) => {
        if (idea.id !== id) return idea;
        if (idea.votedByMe) {
          return {
            ...idea,
            votedByMe: false,
            votes: Math.max(0, idea.votes - 1),
          };
        }
        return { ...idea, votedByMe: true, votes: idea.votes + 1 };
      }),
    );
  }

  return (
    <Stack gap="md">
      <Text size="sm" c="dimmed">
        {application?.name ?? "Project"} / Ideas
      </Text>
      <Group justify="space-between" align="flex-start">
        <div>
          <Group gap="sm">
            <Title order={1} size="h2">
              Ideas
            </Title>
            <Badge variant="light" color="violet" size="sm">
              Votes are a signal, not a roadmap
            </Badge>
          </Group>
          <Text size="sm" c="dimmed" mt={4}>
            Describe a problem and desired outcome. Votes show interest. They do
            not put an idea on a delivery plan. A sponsor candidate is not
            approval.
          </Text>
        </div>
        <Button
          disabled={!mounted}
          onClick={() => {
            setComposing((open) => !open);
            setNotice("");
          }}
        >
          {composing ? "Close form" : "Suggest an idea"}
        </Button>
      </Group>
      {notice && (
        <Alert role="status" color="teal" title="Saved in this demo">
          {notice}
        </Alert>
      )}
      {composing && (
        <Card withBorder p="md" radius="sm">
          <form
            onSubmit={form.onSubmit((values) => {
              const id = `IDE-${String(ideas.length + 25).padStart(3, "0")}`;
              setIdeas((current) => [
                {
                  id,
                  title: values.title.trim(),
                  problem: values.problem.trim(),
                  outcome: values.outcome.trim(),
                  suggestedChange: values.suggestedChange.trim(),
                  sponsorCandidate: values.sponsorCandidate.trim(),
                  votes: 1,
                  votedByMe: true,
                  position: "Submitted",
                  next: "Lan Vo will read the problem. This is not on a delivery plan.",
                },
                ...current,
              ]);
              form.reset();
              setComposing(false);
              setNotice(
                `${id} saved in this browser session only. Your vote was counted once.`,
              );
            })}
          >
            <Stack gap="md">
              <DetailsFormFields
                fields={ideaIntakeFields}
                disabled={!mounted}
                getInputProps={(key) => form.getInputProps(key)}
              />
              <Group justify="flex-end">
                <Button type="submit" disabled={!mounted}>
                  Send idea in demo
                </Button>
              </Group>
            </Stack>
          </form>
        </Card>
      )}
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
          {visible.length} ideas in this project
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
            <Group justify="space-between" align="flex-start">
              <Stack gap={4} style={{ flex: 1, minWidth: 0 }}>
                <Group gap="xs">
                  <Badge variant="light" color="violet" size="xs">
                    Idea
                  </Badge>
                  <Text size="xs" c="dimmed">
                    {idea.id}
                  </Text>
                  <Badge variant="light" color="violet">
                    {idea.position}
                  </Badge>
                </Group>
                <Title order={2} size="sm">
                  {idea.title}
                </Title>
                <Text size="sm">{idea.problem}</Text>
                <Text size="sm" c="dimmed">
                  Desired outcome: {idea.outcome}
                </Text>
                {idea.suggestedChange ? (
                  <Text size="sm" c="dimmed">
                    Suggested change: {idea.suggestedChange}
                  </Text>
                ) : null}
                {idea.sponsorCandidate ? (
                  <Text size="xs" c="dimmed">
                    Sponsor candidate: {idea.sponsorCandidate} (not approval)
                  </Text>
                ) : null}
                <Text size="xs" c="dimmed">
                  Next action: {idea.next}
                </Text>
              </Stack>
              <Stack gap="xs" align="flex-end">
                <Text size="sm" fw={600}>
                  {idea.votes} {idea.votes === 1 ? "vote" : "votes"}
                </Text>
                <Button
                  size="compact-sm"
                  variant={idea.votedByMe ? "filled" : "light"}
                  leftSection={<IconThumbUp size={14} />}
                  disabled={!mounted}
                  onClick={() => toggleVote(idea.id)}
                >
                  {idea.votedByMe ? "Remove vote" : "This would help me"}
                </Button>
              </Stack>
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
