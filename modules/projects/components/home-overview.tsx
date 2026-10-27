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
  SimpleGrid,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { IconArrowRight, IconCircleDot } from "@tabler/icons-react";
import Link from "next/link";

import {
  SupportStatusBadge,
  supportPath,
} from "@/modules/support/components/support-common";
import { useSupport } from "@/modules/support/components/support-provider";
import { getApplication } from "../lib/applications";

export function HomeOverview() {
  const { requests } = useSupport();
  const attention = requests.filter(
    (item) =>
      item.status === "Waiting for sender" ||
      item.status === "Waiting for retest",
  );
  return (
    <Stack gap="lg">
      <Text size="sm" c="dimmed">
        Digital services / Home
      </Text>
      <Group justify="space-between">
        <Box>
          <Title order={1}>Home</Title>
        </Box>
        <Button
          component={Link}
          href="/applications"
          rightSection={<IconArrowRight size={15} />}
        >
          View applications
        </Button>
      </Group>
      <Paper withBorder p="xl" radius="md" bg="var(--gl-bg-canvas)">
        <Stack gap="sm">
          <Text size="xs" fw={700} c="violet">
            DIGITAL TRANSFORMATION
          </Text>
          <Title order={2}>
            Your workplace applications, help, and learning
          </Title>
          <Text c="dimmed" maw={700}>
            Find the right tool, get support when work is blocked, and help
            shape what we build next. This is an interactive demo, not a live
            support channel.
          </Text>
          <Group mt="sm">
            <Button component={Link} href="/help">
              Get help
            </Button>
            <Button component={Link} href="/services" variant="default">
              Request a service
            </Button>
            <Button component={Link} href="/learning" variant="subtle">
              Learn a task
            </Button>
          </Group>
        </Stack>
      </Paper>
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
        {[
          {
            title: "My service requests",
            description:
              "Follow service fulfillment, decisions, and request history.",
            href: "/requests",
          },
          {
            title: "Service status",
            description:
              "Check reported disruptions, workarounds, and planned maintenance.",
            href: "/status",
          },
          {
            title: "Applications & services",
            description:
              "Discover available applications and their support teams.",
            href: "/applications",
          },
          {
            title: "Learning & onboarding",
            description:
              "Read practical guides and follow your getting-started checklist.",
            href: "/learning",
          },
          {
            title: "UAT & testing",
            description:
              "Run business scenarios, report defects, and review acceptance.",
            href: "/uat",
          },
          {
            title: "Improvements",
            description:
              "Suggest an application change or propose a digital initiative.",
            href: "/improvements",
          },
        ].map((item) => (
          <Paper key={item.href} withBorder p="lg" radius="md">
            <Stack gap="xs">
              <Anchor component={Link} href={item.href} fw={600}>
                {item.title}
              </Anchor>
              <Text size="sm" c="dimmed">
                {item.description}
              </Text>
            </Stack>
          </Paper>
        ))}
      </SimpleGrid>
      <Paper withBorder radius="md">
        <Group p="md" bg="var(--gl-bg-canvas)">
          <Title order={2} size="sm">
            Needs your attention
          </Title>
          <Badge color="orange">{attention.length}</Badge>
        </Group>
        {attention.length === 0 ? (
          <Text p="lg" c="dimmed">
            No requests are waiting for your response.
          </Text>
        ) : (
          attention.map((item) => (
            <Box key={item.id}>
              <Divider />
              <Group p="md" justify="space-between" gap="sm">
                <Group align="flex-start" wrap="nowrap">
                  <IconCircleDot
                    size={18}
                    color="var(--mantine-color-green-6)"
                  />
                  <Box>
                    <Anchor
                      component={Link}
                      href={`${supportPath(item.applicationId)}/${item.id}`}
                      fw={600}
                    >
                      {item.summary}
                    </Anchor>
                    <Text size="xs" c="dimmed" mt={4}>
                      {getApplication(item.applicationId ?? "")?.name ?? "DX triage"} · {item.id} ·{" "}
                      {item.status === "Waiting for retest"
                        ? "Share your retest result"
                        : "Reply to the support team"}
                    </Text>
                  </Box>
                </Group>
                <SupportStatusBadge status={item.status} />
              </Group>
            </Box>
          ))
        )}
      </Paper>
      <Paper withBorder radius="md">
        <Group p="md" justify="space-between" bg="var(--gl-bg-canvas)">
          <Title order={2} size="sm">
            Your applications
          </Title>
          <Anchor component={Link} href="/applications" size="sm">
            View all applications
          </Anchor>
        </Group>
        <Divider />
        <Group p="lg" justify="space-between">
          <Group>
            <Avatar color="blue" size={40}>
              BP
            </Avatar>
            <Box>
              <Anchor
                component={Link}
                href="/projects/beacon-portal"
                c="inherit"
                fw={600}
              >
                Beacon Portal
              </Anchor>
              <Text size="sm" c="dimmed">
                Internal product access · Product Services
              </Text>
            </Box>
          </Group>
          <Badge color="gray">
            {requests.filter((item) => item.status !== "Resolved").length} open
            support requests
          </Badge>
        </Group>
      </Paper>
    </Stack>
  );
}
