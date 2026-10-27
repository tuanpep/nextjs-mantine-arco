"use client";

import { useState } from "react";
import {
  Alert,
  Button,
  Group,
  NativeSelect,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  Textarea,
  TextInput,
  Title,
} from "@mantine/core";
import {
  allowedStatuses,
  services,
  type RequestStatus,
  type ServiceRequest,
} from "../lib/services";
import { useServices } from "./services-provider";
import { DemoNotice, ServiceNavigation, StatusBadge } from "./service-common";
import { RequestDetail } from "./request-detail";
import { SupportOperations } from "@/modules/support/components/support-operations";
import { SupportCollection } from "@/modules/support/components/support-collection";

export function RequestsWorkspace({
  operations = false,
}: {
  operations?: boolean;
}) {
  const [queue, setQueue] = useState("services");
  return (
    <Stack gap="lg">
      {(
        <Group aria-label="DX queue type">
          <Button
            variant={queue === "services" ? "filled" : "default"}
            aria-pressed={queue === "services"}
            onClick={() => setQueue("services")}
          >
            Service requests
          </Button>
          <Button
            variant={queue === "support" ? "filled" : "default"}
            aria-pressed={queue === "support"}
            onClick={() => setQueue("support")}
          >
              Support requests
          </Button>
        </Group>
      )}
      {operations && queue === "support" ? (
        <SupportOperations />
      ) : !operations && queue === "support" ? (
        <SupportCollection />
      ) : (
        <ServiceRequests operations={operations} />
      )}
    </Stack>
  );
}

function ServiceRequests({ operations }: { operations: boolean }) {
  const { requests } = useServices();
  const [selectedId, setSelectedId] = useState(requests[0]?.id ?? "");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const visible = requests.filter(
    (request) =>
      (!status || request.status === status) &&
      `${request.id} ${request.application} ${services.find((service) => service.id === request.serviceId)?.title}`
        .toLowerCase()
        .includes(search.toLowerCase()),
  );
  const selected =
    visible.find((request) => request.id === selectedId) ?? visible[0];
  return (
    <Stack gap="lg">
      <ServiceNavigation />
      <div>
        <Text size="sm" c="dimmed">
          DX SUPPORT / {operations ? "OPERATIONS" : "REQUEST TRACKING"}
        </Text>
        <Title order={1} mt="xs">
          {operations ? "DX operations queue" : "My requests"}
        </Title>
        <Text c="dimmed" mt="xs">
          {operations
            ? "Simulate DX triage, assign an owner, and record a review decision."
            : "Follow service requests, review decisions, and the next steps."}
        </Text>
      </div>
      <DemoNotice />
      <Group align="end">
        <TextInput
          label="Search requests"
          placeholder="Request ID, application or service"
          value={search}
          onChange={(event) => setSearch(event.currentTarget.value)}
          style={{ flex: 1, minWidth: 180 }}
        />
        <NativeSelect
          label="Filter status"
          value={status}
          onChange={(event) => setStatus(event.currentTarget.value)}
          data={[
            { value: "", label: "All statuses" },
            "Submitted",
            "In review",
            "Approved",
            "In progress",
            "Fulfilled",
            "Declined",
          ]}
        />
      </Group>
      <Text size="sm" c="dimmed">
        {visible.length} requests ·{" "}
        {operations
          ? "All demo requests"
          : "Your demo requests, including seeded examples"}
      </Text>
      {!visible.length ? (
        <Paper withBorder p="xl">
          <Title order={2} size="h3">
            No matching requests
          </Title>
          <Text mt="xs">Try another search or clear the filters.</Text>
          <Button
            mt="md"
            onClick={() => {
              setSearch("");
              setStatus("");
            }}
          >
            Clear filters
          </Button>
        </Paper>
      ) : (
        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
          <Stack gap="sm">
            {visible.map((request) => (
              <Paper
                key={request.id}
                withBorder
                p="md"
                style={
                  selected?.id === request.id
                    ? { borderColor: "var(--mantine-color-blue-5)" }
                    : undefined
                }
              >
                <Group justify="space-between">
                  <Button
                    variant="subtle"
                    onClick={() => setSelectedId(request.id)}
                    aria-pressed={selected?.id === request.id}
                  >
                    {request.id}
                  </Button>
                  <StatusBadge status={request.status} />
                </Group>
                <Text fw={600} mt="sm">
                  {request.application}
                </Text>
                <Text size="sm" c="dimmed">
                  {
                    services.find((service) => service.id === request.serviceId)
                      ?.title
                  }{" "}
                  · {request.assignee || "Unassigned"}
                </Text>
              </Paper>
            ))}
          </Stack>
          <Stack>
            {selected && (
              <>
                <RequestDetail request={selected} />
                {operations && (
                  <QueueControls
                    key={`${selected.id}-${selected.status}-${selected.assignee}`}
                    request={selected}
                  />
                )}
              </>
            )}
          </Stack>
        </SimpleGrid>
      )}
    </Stack>
  );
}

function QueueControls({ request }: { request: ServiceRequest }) {
  const { actOnRequest } = useServices();
  const [assignee, setAssignee] = useState(request.assignee);
  const options = allowedStatuses(request.status);
  const [nextStatus, setNextStatus] = useState<RequestStatus | undefined>(
    options[0],
  );
  const [reason, setReason] = useState("");
  const [evidence, setEvidence] = useState("");
  const [error, setError] = useState("");
  if (request.status === "Declined")
    return (
      <Alert color="red">
        This request was declined. Submit a new request if the business need
        changes.
      </Alert>
    );
  if (request.status === "Fulfilled")
    return (
      <Alert color="green">
        This demo request is closed. Simulated fulfillment only. No real
        provisioning or changes occurred.
      </Alert>
    );
  function apply(action: Parameters<typeof actOnRequest>[1]) {
    try {
      actOnRequest(request.id, action);
      setError("");
    } catch (issue) {
      setError(
        issue instanceof Error ? issue.message : "Could not update request.",
      );
    }
  }
  return (
    <Paper withBorder p="lg">
      <Stack>
        <Title order={2} size="h3">
          Simulated DX actions
        </Title>
        <Text size="sm" c="dimmed">
          This is not an authenticated operator role. Every change stays in demo
          memory.
        </Text>
        {error && (
          <Alert color="red" role="alert">
            {error}
          </Alert>
        )}
        <NativeSelect
          label="DX assignee"
          value={assignee}
          onChange={(event) => setAssignee(event.currentTarget.value)}
          data={[
            { value: "", label: "Choose an owner" },
            "Linh Nguyen",
            "Minh Tran",
            "Alex Chen",
          ]}
        />
        <Button onClick={() => apply({ kind: "assign", assignee })}>
          Assign owner
        </Button>
        <NativeSelect
          label="Next status"
          value={nextStatus ?? ""}
          onChange={(event) =>
            setNextStatus(
              options.find((option) => option === event.currentTarget.value),
            )
          }
          data={options}
        />
        <Textarea
          label="Decision / progress reason"
          description="Required for every status change. At least 10 characters."
          value={reason}
          onChange={(event) => setReason(event.currentTarget.value)}
          minRows={3}
        />
        {nextStatus === "Fulfilled" && (
          <Textarea
            label="Simulated fulfillment evidence"
            description="Required. Describe the demo verification or reference, at least 10 characters. Do not include sensitive data."
            required
            value={evidence}
            onChange={(event) => setEvidence(event.currentTarget.value)}
            minRows={3}
          />
        )}
        <Button
          variant="filled"
          disabled={!nextStatus}
          onClick={() => {
            if (nextStatus === "Fulfilled")
              apply({ kind: "status", status: nextStatus, reason, evidence });
            else if (nextStatus)
              apply({ kind: "status", status: nextStatus, reason });
          }}
        >
          Record status update
        </Button>
        <Text size="xs" c="dimmed">
          Approval records a simulated review only. In progress means
          coordination, not provisioning. Fulfilled closes the demo with
          evidence only; no real provisioning occurs.
        </Text>
      </Stack>
    </Paper>
  );
}
