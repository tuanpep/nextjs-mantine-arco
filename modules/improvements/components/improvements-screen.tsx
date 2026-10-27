"use client";

import { useState } from "react";
import {
  Alert,
  Badge,
  Box,
  Button,
  Group,
  Modal,
  Paper,
  Radio,
  Select,
  Stack,
  Text,
  Textarea,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconBulb, IconPlus, IconSearch } from "@tabler/icons-react";
import { ideaKind, seedIdeas, type Idea } from "../lib/ideas";

export function ImprovementsScreen() {
  const [ideas, setIdeas] = useState(seedIdeas);
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState<string | null>("all");
  const [creating, setCreating] = useState(false);
  const [selected, setSelected] = useState<Idea | null>(null);
  const [notice, setNotice] = useState("");
  const form = useForm({
    initialValues: {
      kind: "enhancement",
      title: "",
      pain: "",
      value: "",
      teams: "",
      sponsor: "",
    },
    validate: {
      title: (value) => (value.trim() ? null : "Enter a title"),
      pain: (value) => (value.trim() ? null : "Describe the pain point"),
      value: (value) => (value.trim() ? null : "Describe the business value"),
      teams: (value) => (value.trim() ? null : "Enter the affected teams"),
      sponsor: (value, values) =>
        values.kind === "demand" && !value.trim()
          ? "Enter a business sponsor for this demand"
          : null,
    },
  });
  const filtered = ideas.filter(
    (idea) =>
      (kind === "all" || kind === idea.kind) &&
      `${idea.title} ${idea.pain} ${idea.teams}`
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
  );

  return (
    <Stack gap="lg">
      <Text size="sm" c="dimmed">
        DX organization / Improvements
      </Text>
      <Group justify="space-between">
        <Box>
          <Title order={1}>Improvements & digital demand</Title>
          <Text c="dimmed" mt="xs">
            Suggest a better application or a change that spans teams.
          </Text>
        </Box>
        <Button
          variant="filled"
          leftSection={<IconPlus size={16} />}
          onClick={() => {
            form.reset();
            setCreating(true);
          }}
        >
          New submission
        </Button>
      </Group>
      <Alert title="Demo workspace" color="blue">
        Seed ideas and submissions are local examples. Changes reset when you
        leave this page or reload. Nothing is sent for approval.
      </Alert>
      {notice && (
        <Alert role="status" color="green">
          {notice}
        </Alert>
      )}
      <Paper withBorder radius="md" p="md">
        <Group align="end">
          <TextInput
            label="Search ideas"
            placeholder="Title, pain point or team"
            leftSection={<IconSearch size={16} />}
            value={query}
            onChange={(event) => setQuery(event.currentTarget.value)}
            style={{ flex: 1, minWidth: 180 }}
          />
          <Select
            label="Submission type"
            value={kind}
            onChange={setKind}
            allowDeselect={false}
            data={[
              { value: "all", label: "All types" },
              { value: "enhancement", label: "Application enhancement" },
              { value: "demand", label: "Transformation demand" },
            ]}
          />
        </Group>
      </Paper>
      <Text size="sm" c="dimmed" aria-live="polite">
        {filtered.length} submissions
      </Text>
      {filtered.length === 0 ? (
        <Paper withBorder p="xl" ta="center">
          <IconBulb size={28} />
          <Title order={2} mt="sm">
            No matching ideas
          </Title>
          <Text c="dimmed" my="sm">
            Try another search or submission type.
          </Text>
          <Button
            onClick={() => {
              setQuery("");
              setKind("all");
            }}
          >
            Clear filters
          </Button>
        </Paper>
      ) : (
        filtered.map((idea) => (
          <Paper key={idea.id} withBorder p="lg" radius="md">
            <Group justify="space-between" mb="xs">
              <Text size="sm" c="dimmed">
                {idea.id} · {ideaKind(idea.kind)}
              </Text>
              <Badge color="blue">Submitted</Badge>
            </Group>
            <Title order={2} size="lg">
              {idea.title}
            </Title>
            <Text mt="xs">{idea.pain}</Text>
            <Group justify="space-between" mt="md">
              <Text size="sm" c="dimmed">
                {idea.teams}
              </Text>
              <Button
                onClick={() => setSelected(idea)}
                aria-label={`View details for ${idea.title}`}
              >
                View details
              </Button>
            </Group>
          </Paper>
        ))
      )}
      <Modal
        opened={creating}
        onClose={() => setCreating(false)}
        title="New improvement submission"
        size="lg"
      >
        <form
          noValidate
          onSubmit={form.onSubmit((values) => {
            const base = {
              id: `IMP-${105 + ideas.length - seedIdeas.length}`,
              title: values.title.trim(),
              pain: values.pain.trim(),
              value: values.value.trim(),
              teams: values.teams.trim(),
              submitted: new Date().toISOString(),
            };
            const idea: Idea =
              values.kind === "demand"
                ? { ...base, kind: "demand", sponsor: values.sponsor.trim() }
                : { ...base, kind: "enhancement" };
            setIdeas((current) => [idea, ...current]);
            setQuery("");
            setKind("all");
            setCreating(false);
            setNotice(
              `${idea.id} submitted in this demo. No review or approval has taken place.`,
            );
            setSelected(idea);
          })}
        >
          <Stack>
            <Radio.Group
              label="What kind of change?"
              {...form.getInputProps("kind")}
            >
              <Stack gap="xs" mt="xs">
                <Radio
                  value="enhancement"
                  label="Application enhancement"
                  description="A focused change to an existing application."
                />
                <Radio
                  value="demand"
                  label="Transformation demand"
                  description="A larger process or digital change across teams. Requires a sponsor."
                />
              </Stack>
            </Radio.Group>
            <TextInput
              label="Title"
              required
              {...form.getInputProps("title")}
            />
            <Textarea
              label="Pain point"
              description="What happens today, and who is affected?"
              required
              minRows={3}
              {...form.getInputProps("pain")}
            />
            <Textarea
              label="Business value"
              description="What would improve, and how would you measure it?"
              required
              minRows={3}
              {...form.getInputProps("value")}
            />
            <TextInput
              label="Affected teams"
              required
              {...form.getInputProps("teams")}
            />
            {form.values.kind === "demand" && (
              <TextInput
                label="Business sponsor"
                description="The person or role accountable for the proposed change."
                required
                {...form.getInputProps("sponsor")}
              />
            )}
            <Text size="sm" c="dimmed">
              The initial status is Submitted. This does not confirm funding,
              approval or a delivery date.
            </Text>
            <Group justify="flex-end">
              <Button onClick={() => setCreating(false)}>Cancel</Button>
              <Button type="submit" variant="filled">
                Submit idea
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
      <Modal
        opened={selected !== null}
        onClose={() => setSelected(null)}
        title="Submission details"
        size="lg"
      >
        {selected && (
          <Stack>
            <Group>
              <Text size="sm">{selected.id}</Text>
              <Badge>Submitted</Badge>
            </Group>
            <Title order={2}>{selected.title}</Title>
            <Text c="dimmed">{ideaKind(selected.kind)}</Text>
            <Text size="sm">
              Submitted{" "}
              <time dateTime={selected.submitted}>
                {selected.submitted.replace("T", " ").replace("Z", " UTC")}
              </time>
            </Text>
            <Box>
              <Text fw={600}>Pain point</Text>
              <Text style={{ whiteSpace: "pre-wrap" }}>{selected.pain}</Text>
            </Box>
            <Box>
              <Text fw={600}>Business value</Text>
              <Text style={{ whiteSpace: "pre-wrap" }}>{selected.value}</Text>
            </Box>
            <Box>
              <Text fw={600}>Affected teams</Text>
              <Text>{selected.teams}</Text>
            </Box>
            {selected.kind === "demand" && (
              <Box>
                <Text fw={600}>Business sponsor</Text>
                <Text>{selected.sponsor}</Text>
              </Box>
            )}
            <Alert color="gray">
              Awaiting initial review. No approval, funding or delivery
              commitment is recorded in this demo.
            </Alert>
            <Button onClick={() => setSelected(null)}>Close details</Button>
          </Stack>
        )}
      </Modal>
    </Stack>
  );
}
