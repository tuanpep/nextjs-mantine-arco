"use client";

import {
  Paper,
  Stack,
  Group,
  Title,
  Text,
  Divider,
  Timeline,
} from "@mantine/core";
import { services, type ServiceRequest } from "../lib/services";
import { StatusBadge } from "./service-common";

export function RequestDetail({ request }: { request: ServiceRequest }) {
  const service = services.find((item) => item.id === request.serviceId);
  return (
    <Paper withBorder p="lg">
      <Stack>
        <Group justify="space-between">
          <Title order={2}>{request.id}</Title>
          <StatusBadge status={request.status} />
        </Group>
        <Text fw={600}>
          {service?.title} · {request.application}
        </Text>
        <Text size="sm" c="dimmed">
          DX owner: {request.assignee || "Unassigned"}
        </Text>
        <div>
          <Text fw={600}>Business justification</Text>
          <Text style={{ overflowWrap: "anywhere" }}>
            {request.justification}
          </Text>
        </div>
        {service?.fields.map((field) => (
          <div key={field.key}>
            <Text size="sm" c="dimmed">
              {field.label}
            </Text>
            <Text style={{ overflowWrap: "anywhere" }}>
              {request.details[field.key]}
            </Text>
          </div>
        ))}
        <Text size="sm">{service?.approval}</Text>
        {request.status === "Approved" && (
          <Text c="green">
            Review approved. Fulfillment has not been confirmed.
          </Text>
        )}
        {request.status === "In progress" && (
          <Text>
            DX is coordinating next steps. No real changes have been applied.
          </Text>
        )}
        {request.status === "Fulfilled" && (
          <Text c="green">
            Simulated fulfillment only. No real provisioning or changes
            occurred. See history for the recorded evidence.
          </Text>
        )}
        <Divider />
        <Title order={3} size="h4">
          Request history
        </Title>
        <Timeline bulletSize={12} lineWidth={2}>
          {request.history.map((event, index) => (
            <Timeline.Item key={`${event.at}-${index}`} title={event.actor}>
              <Text size="sm" style={{ overflowWrap: "anywhere" }}>
                {event.message}
              </Text>
              <Text size="xs" c="dimmed">
                {new Date(event.at).toLocaleString()}
              </Text>
            </Timeline.Item>
          ))}
        </Timeline>
      </Stack>
    </Paper>
  );
}
