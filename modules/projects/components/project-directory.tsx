"use client";

import {
  Anchor,
  Avatar,
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
import { IconArrowRight, IconLock, IconSearch } from "@tabler/icons-react";
import Link from "next/link";
import { parseAsString, useQueryState } from "nuqs";

import {
  applications as applicationRegistry,
  applicationPath,
} from "../lib/applications";

export function ProjectDirectory({
  applications = true,
}: {
  applications?: boolean;
}) {
  const [query, setQuery] = useQueryState("q", parseAsString.withDefault(""));
  const matches = applicationRegistry.filter((application) =>
    `${application.name} ${application.owner} ${application.description}`
      .toLowerCase()
      .includes(query.trim().toLowerCase()),
  );
  return (
    <Stack gap="lg">
      <Text size="sm" c="dimmed">
        Digital services / {applications ? "Applications" : "Projects"}
      </Text>
      <Box>
        <Title order={1}>{applications ? "Applications" : "Projects"}</Title>
        <Text c="dimmed" mt="xs">
          Find an application, understand its purpose, and reach its support
          team.
        </Text>
      </Box>
      <Paper withBorder radius="md" style={{ overflow: "hidden" }}>
        <Group
          p="md"
          justify="space-between"
          bg="var(--gl-bg-canvas)"
          style={{
            borderBottom: "1px solid var(--mantine-color-default-border)",
          }}
        >
          <Group gap="xs">
            <Text fw={600}>Your applications</Text>
            <Badge color="gray">{matches.length}</Badge>
          </Group>
          <TextInput
            aria-label="Search applications"
            placeholder="Search applications"
            leftSection={<IconSearch size={16} />}
            value={query}
            onChange={(event) =>
              void setQuery(event.currentTarget.value || null)
            }
            w={{ base: "100%", sm: 320 }}
          />
        </Group>
        {matches.length > 0 ? (
          matches.map((application) => (
            <Group
              key={application.id}
              p="lg"
              align="flex-start"
              wrap="nowrap"
              gap="md"
            >
              <Avatar size={48} radius="md" color="blue">
                {application.initials}
              </Avatar>
              <Box style={{ flex: 1, minWidth: 0 }}>
                <Group gap="xs">
                  <Anchor
                    component={Link}
                    href={applicationPath(application.id)}
                    c="inherit"
                    fw={600}
                  >
                    DX organization / {application.name}
                  </Anchor>
                  <IconLock size={14} aria-label="Internal application" />
                  <Badge color="green">Active</Badge>
                </Group>
                <Text size="sm" c="dimmed" mt={6}>
                  {application.description}
                </Text>
                <Text size="xs" c="dimmed" mt="sm">
                  {application.owner} · Support
                </Text>
                <Button
                  component={Link}
                  href={applicationPath(application.id)}
                  mt="md"
                  rightSection={<IconArrowRight size={15} />}
                >
                  Open {application.name}
                </Button>
              </Box>
            </Group>
          ))
        ) : (
          <Stack p={48} align="center">
            <IconSearch size={28} />
            <Title order={2} size="lg">
              No matching applications
            </Title>
            <Text c="dimmed">Try another name or clear your search.</Text>
            <Button onClick={() => void setQuery(null)}>Clear search</Button>
          </Stack>
        )}
      </Paper>
    </Stack>
  );
}
