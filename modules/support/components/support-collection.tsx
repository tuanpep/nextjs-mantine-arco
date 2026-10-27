"use client";

import {
  Anchor,
  Badge,
  Box,
  Button,
  Card,
  Group,
  Select,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  ThemeIcon,
  Title,
  UnstyledButton,
} from "@mantine/core";
import {
  IconArrowRight,
  IconPlus,
  IconSearch,
  IconLifebuoy,
} from "@tabler/icons-react";
import Link from "next/link";
import { useQueryStates } from "nuqs";

import { supportStatuses } from "../lib/fixtures";
import {
  requestCatalogCards,
  requestTypeLabels,
} from "../lib/request-catalog";
import { getApplication } from "@/modules/projects/lib/applications";
import { supportSearchParams } from "../lib/search-params";
import { filterSupport } from "../lib/support-state";
import {
  SupportIntro,
  SupportStatusBadge,
  SupportUnavailable,
  supportPath,
} from "./support-common";
import { useSupport } from "./support-provider";

export function SupportCollection({ projectId }: { projectId?: string }) {
  const { requests } = useSupport();
  const [filters, setFilters] = useQueryStates(supportSearchParams);
  if (projectId && !getApplication(projectId)) return <SupportUnavailable />;
  const basePath = supportPath(projectId ?? null);
  const items = filterSupport(requests.filter((item) => !projectId || item.applicationId === projectId), filters.q, filters.status);
  return (
    <Stack gap="md">
      <SupportIntro title="Your support requests" applicationId={projectId ?? null} />
      <Group justify="space-between" align="flex-end">
        <div>
          <Title order={2} size="h3">
            Requests from Jo Lee
          </Title>
        </div>
        <Button
          component={Link}
          href={`${basePath}/new?type=general`}
          leftSection={<IconPlus size={16} />}
        >
          Ask for help
        </Button>
      </Group>
      <Stack gap="xs">
        <Text size="sm" fw={600}>
          Request catalog in this project
        </Text>
        <Text size="xs" c="dimmed">
          Known types route to the default handler when configured. Something
          else remains the catch-all. Choosing a type does not fulfill the
          request.
        </Text>
        <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="sm">
          {requestCatalogCards.map((card) => (
            <UnstyledButton
              key={card.type}
              component={Link}
              href={`${basePath}/new?type=${card.type}`}
              style={{ display: "block" }}
            >
              <Card withBorder padding="sm" radius="sm" h="100%">
                <Text fw={600} size="sm">
                  {card.title}
                </Text>
                <Text size="xs" c="dimmed" mt={4}>
                  {card.description}
                </Text>
              </Card>
            </UnstyledButton>
          ))}
        </SimpleGrid>
      </Stack>
      <Card withBorder p={0} radius="sm">
        <Group
          align="flex-end"
          p="sm"
          style={{
            borderBottom: "1px solid var(--mantine-color-default-border)",
          }}
        >
          <TextInput
            style={{ flex: "1 1 260px" }}
            label="Search requests"
            placeholder="Search by summary or reference"
            leftSection={<IconSearch size={16} />}
            value={filters.q}
            onChange={(event) =>
              void setFilters({ q: event.currentTarget.value })
            }
          />
          <Select
            style={{ flex: "0 1 220px" }}
            label="Status"
            value={filters.status}
            allowDeselect={false}
            data={[
              { value: "all", label: "All statuses" },
              ...supportStatuses.map((status) => ({
                value: status,
                label: status,
              })),
            ]}
            onChange={(value) => {
              const status = supportSearchParams.status.parse(value ?? "all");
              void setFilters({ status: status ?? "all" });
            }}
          />
        </Group>
        <Text
          size="xs"
          c="dimmed"
          aria-live="polite"
          px="md"
          py="xs"
          bg="var(--mantine-color-default-hover)"
        >
          {items.length} matching {items.length === 1 ? "request" : "requests"}
        </Text>
        {items.length === 0 ? (
          <Box p="xl">
            <Stack align="center">
              <ThemeIcon size="xl" variant="light">
                <IconLifebuoy />
              </ThemeIcon>
              <Title order={2} size="h3">
                No requests match
              </Title>
              <Button
                variant="light"
                onClick={() => void setFilters({ q: "", status: "all" })}
              >
                Clear filters
              </Button>
            </Stack>
          </Box>
        ) : (
          <Stack gap={0}>
            {items.map((item) => (
              <Box
                key={item.id}
                px="md"
                py="sm"
                style={{
                  borderTop: "1px solid var(--mantine-color-default-border)",
                }}
              >
                <Group justify="space-between" align="flex-start">
                  <Stack gap={4} style={{ flex: "1 1 240px", minWidth: 0 }}>
                    <Group gap="xs">
                      <Badge variant="light" color="gray" size="xs">
                        Support
                      </Badge>
                      <Text size="xs" c="dimmed">
                        {item.id}
                      </Text>
                    </Group>
                    <Anchor
                      component={Link}
                      href={`${supportPath(item.applicationId)}/${item.id}`}
                      fw={600}
                      size="sm"
                      style={{ overflowWrap: "anywhere" }}
                    >
                      {item.summary}
                    </Anchor>
                    <Text size="sm" c="dimmed">
                      {getApplication(item.applicationId ?? "")?.name ??
                        "Application not identified"}{" "}
                      · {requestTypeLabels[item.requestType]} · Priority{" "}
                      {item.priority} · {item.handler ?? "Unclaimed"} · Next:{" "}
                      {item.nextActor}
                    </Text>
                  </Stack>
                  <Group gap="sm">
                    <Badge variant="light" color="grape" size="sm">
                      {item.priority}
                    </Badge>
                    <SupportStatusBadge status={item.status} />
                    <IconArrowRight size={18} aria-hidden="true" />
                  </Group>
                </Group>
              </Box>
            ))}
          </Stack>
        )}
      </Card>
    </Stack>
  );
}
