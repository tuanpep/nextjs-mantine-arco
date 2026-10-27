"use client";

import { useState } from "react";
import {
  Accordion,
  Alert,
  Badge,
  Button,
  Checkbox,
  Group,
  NativeSelect,
  Paper,
  Progress,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { IconBook, IconSearch } from "@tabler/icons-react";
import { articles, onboarding } from "../data";

export function LearningScreen() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All topics");
  const [role, setRole] = useState("Requester");
  const [completed, setCompleted] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<Record<string, string>>({});
  const tasks = onboarding[role] ?? [];
  const count = tasks.filter((task) =>
    completed.includes(`${role}:${task}`),
  ).length;
  const visible = articles.filter(
    (article) =>
      (category === "All topics" || category === article.category) &&
      `${article.title} ${article.summary} ${article.sections.map((section) => section.body).join(" ")}`
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
  );

  return (
    <Stack gap="lg">
      <Group gap="sm">
        <IconBook size={28} aria-hidden />
        <div>
          <Title order={1}>Learning center</Title>
          <Text c="dimmed">
            Practical guides for your first day and your next task.
          </Text>
        </div>
      </Group>
      <Alert title="Demo session" color="blue">
        Checklist progress and article feedback stay on this page only.
        Reloading or leaving resets them. No training records are submitted.
      </Alert>
      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
        <Paper withBorder p="lg">
          <Stack>
            <Title order={2}>Your onboarding checklist</Title>
            <NativeSelect
              label="Your learning role"
              data={Object.keys(onboarding)}
              value={role}
              onChange={(event) => setRole(event.currentTarget.value)}
            />
            <Text size="sm" role="status">
              {count} of {tasks.length} steps complete for {role.toLowerCase()}
            </Text>
            <Progress
              value={tasks.length ? (count / tasks.length) * 100 : 0}
              aria-label="Onboarding completion"
            />
            {tasks.map((task) => {
              const key = `${role}:${task}`;
              return (
                <Checkbox
                  key={key}
                  label={task}
                  checked={completed.includes(key)}
                  onChange={(event) => {
                    const checked = event.currentTarget.checked;
                    setCompleted((current) =>
                      checked
                        ? [...current, key]
                        : current.filter((item) => item !== key),
                    );
                  }}
                />
              );
            })}
            {count === tasks.length && (
              <Text c="green" role="status">
                Checklist complete. You can revisit any step.
              </Text>
            )}
          </Stack>
        </Paper>
        <Paper withBorder p="lg">
          <Stack>
            <Badge w="fit-content" color="violet">
              Start here
            </Badge>
            <Title order={2}>Learn by doing</Title>
            <Text>
              Read a guide, try the workflow with sample data, then check off
              the task when you understand it. Your checklist is a personal
              reminder, not a certification.
            </Text>
            <Text size="sm" c="dimmed">
              Requesters can start with support requests. Testers should read
              the acceptance guide before running a scenario. Coordinators can
              use the triage guide to practice handoffs.
            </Text>
          </Stack>
        </Paper>
      </SimpleGrid>
      <Title order={2}>Guides and how-tos</Title>
      <Group align="end" grow>
        <TextInput
          label="Search guides"
          placeholder="Try access, defects, or support"
          leftSection={<IconSearch size={16} aria-hidden />}
          value={query}
          onChange={(event) => setQuery(event.currentTarget.value)}
        />
        <NativeSelect
          label="Topic"
          data={["All topics", "Getting started", "Support", "Testing"]}
          value={category}
          onChange={(event) => setCategory(event.currentTarget.value)}
        />
      </Group>
      <Text size="sm" c="dimmed" role="status">
        {visible.length} {visible.length === 1 ? "guide" : "guides"} found
      </Text>
      {visible.length === 0 ? (
        <Paper withBorder p="lg">
          <Stack align="start">
            <Title order={3}>No matching guides</Title>
            <Text>Try a different phrase or clear your filters.</Text>
            <Button
              onClick={() => {
                setQuery("");
                setCategory("All topics");
              }}
            >
              Clear filters
            </Button>
          </Stack>
        </Paper>
      ) : (
        <Accordion variant="separated">
          {visible.map((article) => (
            <Accordion.Item value={article.id} key={article.id}>
              <Accordion.Control>
                <Stack gap={4}>
                  <Group gap="xs">
                    <Badge color="gray">{article.category}</Badge>
                    <Text size="xs" c="dimmed">
                      {article.minutes} min read
                    </Text>
                  </Group>
                  <Text fw={600}>{article.title}</Text>
                  <Text size="sm" c="dimmed">
                    {article.summary}
                  </Text>
                </Stack>
              </Accordion.Control>
              <Accordion.Panel>
                <Stack py="md" maw={780}>
                  {article.sections.map((section) => (
                    <Stack gap="xs" key={section.title}>
                      <Title order={3}>{section.title}</Title>
                      <Text lh={1.7}>{section.body}</Text>
                    </Stack>
                  ))}
                  <Paper withBorder p="md">
                    <Stack gap="xs">
                      <Text fw={600}>Was this guide helpful?</Text>
                      <Group>
                        <Button
                          aria-pressed={feedback[article.id] === "Yes"}
                          variant={
                            feedback[article.id] === "Yes"
                              ? "filled"
                              : "default"
                          }
                          onClick={() =>
                            setFeedback((current) => ({
                              ...current,
                              [article.id]: "Yes",
                            }))
                          }
                        >
                          Yes, helpful
                        </Button>
                        <Button
                          aria-pressed={feedback[article.id] === "No"}
                          variant={
                            feedback[article.id] === "No" ? "filled" : "default"
                          }
                          onClick={() =>
                            setFeedback((current) => ({
                              ...current,
                              [article.id]: "No",
                            }))
                          }
                        >
                          Needs improvement
                        </Button>
                      </Group>
                      {feedback[article.id] && (
                        <Text size="sm" role="status">
                          Feedback noted in this demo:{" "}
                          {feedback[article.id] === "Yes"
                            ? "helpful"
                            : "needs improvement"}
                          . You can change your answer.
                        </Text>
                      )}
                    </Stack>
                  </Paper>
                </Stack>
              </Accordion.Panel>
            </Accordion.Item>
          ))}
        </Accordion>
      )}
    </Stack>
  );
}
