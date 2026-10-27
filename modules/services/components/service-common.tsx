"use client";

import Link from "next/link";
import { Alert, Badge, Group, Anchor } from "@mantine/core";
import type { RequestStatus } from "../lib/services";

export function ServiceNavigation() {
  return (
    <Group gap="lg">
      <Anchor component={Link} href="/services">
        Service catalog
      </Anchor>
      <Anchor component={Link} href="/requests">
        My requests
      </Anchor>
      <Anchor component={Link} href="/operations">
        DX operations
      </Anchor>
    </Group>
  );
}

export function DemoNotice() {
  return (
    <Alert color="orange" title="Demo workspace">
      Requests and DX actions are simulated and shared across these pages until
      refresh. No real permissions, provisioning, exports, or data changes
      occur. Approval is a review decision, not proof of delivery.
    </Alert>
  );
}

export function StatusBadge({ status }: { status: RequestStatus }) {
  return (
    <Badge
      color={
        status === "Declined"
          ? "red"
          : status === "Approved" || status === "Fulfilled"
            ? "green"
            : status === "Submitted"
              ? "gray"
              : "blue"
      }
    >
      {status}
    </Badge>
  );
}
