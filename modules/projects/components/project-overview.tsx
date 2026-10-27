"use client";

import {
  Anchor,
  Avatar,
  Badge,
  Box,
  Button,
  Divider,
  Group,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { IconBulb, IconLifebuoy, IconLock } from "@tabler/icons-react";
import Link from "next/link";

import { useSupport } from "@/modules/support/components/support-provider";
import {
  applications,
  applicationPath,
  type Application,
} from "../lib/applications";

export function ProjectOverview({
  application = applications[0],
}: {
  application?: Application;
}) {
  const { requests } = useSupport();
  const path = applicationPath(application.id);
  const applicationRequests = requests.filter(
    (request) => request.applicationId === application.id,
  );
  return (
    <Stack gap="lg">
      <Text size="sm" c="dimmed">
        Applications / {application.name} / Overview
      </Text>
      <Group justify="space-between">
        <Group>
          <Avatar size={48} color="blue" radius="md">
            {application.initials}
          </Avatar>
          <Box>
            <Group gap="sm">
              <Title order={1}>{application.name}</Title>
              <IconLock size={16} aria-label="Internal application" />
              <Badge color="green">Active</Badge>
            </Group>
            <Text c="dimmed" size="sm" mt={4}>
              dx-organization / {application.id}
            </Text>
          </Box>
        </Group>
        <Button component={Link} href={`${path}/support/new`} variant="filled">
          Submit Support
        </Button>
      </Group>
      <Paper withBorder radius="md">
        <Group p="md" bg="var(--gl-bg-canvas)">
          <Title order={2} size="sm">
            Application overview
          </Title>
          <Badge color="gray">Private</Badge>
        </Group>
        <Divider />
        <Stack p="lg" gap="sm">
          <Title order={2} size="lg">
            {application.description}
          </Title>
          <Text c="dimmed">
            Find support for {application.name} from {application.owner}.
          </Text>
          <Group mt="xs" gap="sm">
            <Avatar size={28} color="gray">
              {application.owner
                .split(" ")
                .map((word) => word[0])
                .join("")}
            </Avatar>
            <Text size="sm">
              Maintained by{" "}
              <Text span fw={600}>
                {application.owner}
              </Text>
            </Text>
          </Group>
        </Stack>
      </Paper>
      <Paper withBorder p="lg" radius="md">
        <Stack gap="sm">
          <Title order={2} size="lg">
            Learn, test, and request services
          </Title>
          <Text size="sm" c="dimmed">
            These shared destinations cover all applications. They are not
            filtered to {application.name}.
          </Text>
          <Group>
            <Button component={Link} href="/learning" variant="light">
              Shared user guides
            </Button>
            <Button component={Link} href="/services" variant="light">
              Shared service catalog
            </Button>
            <Button component={Link} href="/uat" variant="light">
              Shared release testing
            </Button>
            <Button component={Link} href="/status" variant="default">
              Shared status & maintenance
            </Button>
          </Group>
          <Text size="xs" c="dimmed">
            No production application launcher or live access provisioning is
            connected in this demo.
          </Text>
        </Stack>
      </Paper>
      <Paper withBorder radius="md">
        <Group p="md" justify="space-between" bg="var(--gl-bg-canvas)">
          <Title order={2} size="sm">
            Work items
          </Title>
        </Group>
        <Divider />
        <Group p="lg" justify="space-between">
          <Group align="flex-start">
            <IconLifebuoy size={20} />
            <Box>
              <Group gap="xs">
                <Text fw={600}>Support</Text>
                <Badge color="gray">{applicationRequests.length}</Badge>
              </Group>
            </Box>
          </Group>
          <Anchor component={Link} href={`${path}/support`} size="sm">
            View Support
          </Anchor>
        </Group>
        <Divider />
        <Group p="lg" justify="space-between">
          <Group align="flex-start">
            <IconBulb size={20} />
            <Box>
              <Group gap="xs">
                <Text fw={600}>Shared improvements</Text>
              </Group>
            </Box>
          </Group>
          <Button component={Link} href="/improvements">
            Browse shared improvements
          </Button>
        </Group>
      </Paper>
    </Stack>
  );
}
