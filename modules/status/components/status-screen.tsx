"use client";

import { useState } from "react";
import {
  Accordion,
  Alert,
  Badge,
  Box,
  Button,
  Group,
  Paper,
  SimpleGrid,
  Select,
  Stack,
  Switch,
  Text,
  Title,
} from "@mantine/core";
import { IconActivity } from "@tabler/icons-react";
import { records } from "../lib/records";

export function StatusScreen() {
  const [category, setCategory] = useState<string | null>("all");
  const [subscriptions, setSubscriptions] = useState<string[]>([]);
  const [affected, setAffected] = useState<string[]>([]);
  const filtered = records.filter(
    (record) => category === "all" || record.category === category,
  );

  function toggleSubscription(id: string) {
    setSubscriptions((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  }

  return (
    <Stack gap="lg">
      <Text size="sm" c="dimmed">
        DX organization / Service status
      </Text>
      <Box>
        <Title order={1}>Service status & communications</Title>
        <Text c="dimmed" mt="xs">
          Incidents, maintenance and known issues in one place.
        </Text>
      </Box>
      <Alert
        title="Manual demo records, not live monitoring"
        color="orange"
        icon={<IconActivity size={20} />}
      >
        This page has no monitoring integration. Last manually recorded update:{" "}
        <time dateTime="2026-10-26T09:30:00Z">
          26 October 2026 at 09:30 UTC
        </time>
        . This is a fixed demo snapshot, not a statement of current service
        health. Subscriptions and affected reports stay on this page only and
        reset when you leave or reload. No email or notification is sent.
      </Alert>
      <SimpleGrid cols={{ base: 1, sm: 3 }}>
        <Paper withBorder p="md" radius="md">
          <Text c="dimmed" size="sm">
            Active demo incidents
          </Text>
          <Title order={2}>1 investigating</Title>
        </Paper>
        <Paper withBorder p="md" radius="md">
          <Text c="dimmed" size="sm">
            Planned maintenance
          </Text>
          <Title order={2}>1 scheduled window</Title>
        </Paper>
        <Paper withBorder p="md" radius="md">
          <Text c="dimmed" size="sm">
            Known issues
          </Text>
          <Title order={2}>1 documented workaround</Title>
        </Paper>
      </SimpleGrid>
      <Select
        label="Record type"
        value={category}
        onChange={setCategory}
        allowDeselect={false}
        maw={320}
        data={[
          { value: "all", label: "All records" },
          { value: "incident", label: "Incidents" },
          { value: "maintenance", label: "Maintenance" },
          { value: "known", label: "Known issues" },
        ]}
      />
      {filtered.map((record) => (
        <Paper
          key={record.id}
          withBorder
          radius="md"
          p="lg"
          component="section"
          aria-label={record.title}
        >
          <Stack>
            <Group justify="space-between">
              <Text size="sm" c="dimmed">
                {record.id} · {record.service}
              </Text>
              <Badge color={record.color}>{record.status}</Badge>
            </Group>
            <Title order={2} size="lg">
              {record.title}
            </Title>
            <Text>{record.summary}</Text>
            <Accordion variant="default">
              <Accordion.Item value="updates">
                <Accordion.Control>Timeline & workaround</Accordion.Control>
                <Accordion.Panel>
                  <Stack>
                    <Alert title="Workaround" color="blue">
                      {record.workaround}
                    </Alert>
                    <Text fw={600}>Manual update timeline</Text>
                    {record.updates.map((update) => (
                      <Box
                        key={update.at}
                        style={{
                          borderLeft:
                            "2px solid var(--mantine-color-default-border)",
                          paddingLeft: 16,
                        }}
                      >
                        <Text size="sm" fw={600}>
                          <time dateTime={update.at}>
                            {update.at
                              .replace("T", " ")
                              .replace(":00Z", " UTC")}
                          </time>
                        </Text>
                        <Text mt={4}>{update.text}</Text>
                      </Box>
                    ))}
                  </Stack>
                </Accordion.Panel>
              </Accordion.Item>
            </Accordion>
            <Group justify="space-between">
              <Switch
                label={`Subscribe to ${record.id}`}
                checked={subscriptions.includes(record.id)}
                onChange={() => toggleSubscription(record.id)}
              />
              {record.category !== "maintenance" && (
                <Group gap="sm">
                  <Text size="sm" aria-live="polite">
                    {record.affected + (affected.includes(record.id) ? 1 : 0)}{" "}
                    affected reports
                  </Text>
                  <Button
                    aria-pressed={affected.includes(record.id)}
                    onClick={() =>
                      setAffected((current) =>
                        current.includes(record.id)
                          ? current.filter((id) => id !== record.id)
                          : [...current, record.id],
                      )
                    }
                  >
                    {affected.includes(record.id)
                      ? "Remove my affected report"
                      : "I'm also affected"}
                  </Button>
                </Group>
              )}
            </Group>
            {subscriptions.includes(record.id) && (
              <Text role="status" size="sm" c="dimmed">
                Subscribed in this demo only. No notifications will be
                delivered.
              </Text>
            )}
          </Stack>
        </Paper>
      ))}
    </Stack>
  );
}
