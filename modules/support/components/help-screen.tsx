"use client";

import {
  Alert,
  Anchor,
  Button,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useMounted } from "@mantine/hooks";
import Link from "next/link";
import { useState } from "react";

const destinations = [
  {
    title: "Something isn't working",
    description:
      "Report an error, failed transaction, slow screen, or unexpected behavior. You don't need to know the application or cause.",
    keywords: "bug issue incident broken production support",
    href: "/support/new",
    action: "Report a production issue",
  },
  {
    title: "I need access or a service",
    description:
      "Request access, a role change, training, reporting assistance, or an approved configuration change.",
    keywords: "permission account access service request data report",
    href: "/services",
    action: "Browse services",
  },
  {
    title: "I want to learn a task",
    description:
      "Find getting-started instructions, troubleshooting guidance, and onboarding steps.",
    keywords: "learn onboarding guide training help how",
    href: "/learning",
    action: "Find a guide",
  },
  {
    title: "I'm testing a new release",
    description:
      "Record a UAT result or defect against the campaign and version you are testing. Keep UAT separate from live-service incidents.",
    keywords: "uat test defect acceptance release",
    href: "/uat",
    action: "Open UAT campaigns",
  },
  {
    title: "I have an improvement idea",
    description:
      "Describe a better way of working, an application enhancement, or an opportunity to automate a business process.",
    keywords: "idea enhancement automation demand transformation",
    href: "/improvements",
    action: "Propose an improvement",
  },
];

export function HelpScreen() {
  const mounted = useMounted();
  const [query, setQuery] = useState("");
  const matches = destinations.filter((item) =>
    `${item.title} ${item.description} ${item.keywords}`
      .toLowerCase()
      .includes(query.trim().toLowerCase()),
  );
  return (
    <Stack gap="lg">
      <Title order={1}>Get help</Title>
      <Text c="dimmed">
        Tell us what you need. You do not have to identify the technical cause
        first.
      </Text>
      <Alert title="Check for a known disruption" color="blue">
        A workaround may already be available.{" "}
        <Anchor component={Link} href="/status">
          View service status
        </Anchor>{" "}
        before reporting the same issue.
      </Alert>
      <TextInput
        label="Find the right help"
        placeholder="Try access, training, bug, or UAT"
        disabled={!mounted}
        value={query}
        onChange={(event) => setQuery(event.currentTarget.value)}
      />
      <SimpleGrid cols={{ base: 1, md: 2 }}>
        {matches.map((item) => (
          <Paper key={item.href} withBorder p="lg" radius="md">
            <Stack h="100%" justify="space-between">
              <Stack gap="xs">
                <Title order={2} size="h3">
                  {item.title}
                </Title>
                <Text size="sm" c="dimmed">
                  {item.description}
                </Text>
              </Stack>
              <Group>
                <Button component={Link} href={item.href} variant="light">
                  {item.action}
                </Button>
              </Group>
            </Stack>
          </Paper>
        ))}
      </SimpleGrid>
      {matches.length === 0 && (
        <Paper withBorder p="xl">
          <Stack align="center">
            <Title order={2} size="h3">
              No matching help topics
            </Title>
            <Text>Try a shorter phrase or browse all options.</Text>
            <Button onClick={() => setQuery("")}>Clear search</Button>
          </Stack>
        </Paper>
      )}
      <Paper withBorder p="md">
        <Text size="sm">
          Already submitted a report?{" "}
          <Anchor component={Link} href="/support">
            View production support
          </Anchor>{" "}
          or{" "}
          <Anchor component={Link} href="/requests">
            track service requests
          </Anchor>
          .
        </Text>
      </Paper>
      <Text size="sm" c="dimmed">
        Demo only. Do not enter passwords, confidential records, or personal
        data. Security incidents should follow your company&apos;s approved
        security reporting process.
      </Text>
    </Stack>
  );
}
