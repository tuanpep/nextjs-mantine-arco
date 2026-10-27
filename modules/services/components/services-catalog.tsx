"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Alert,
  Anchor,
  Button,
  Card,
  Group,
  Modal,
  SimpleGrid,
  Stack,
  Text,
  Textarea,
  TextInput,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { IconArrowUpRight, IconBriefcase } from "@tabler/icons-react";
import {
  services,
  validateRequest,
  type RequestDraft,
  type Service,
} from "../lib/services";
import { useServices } from "./services-provider";
import { DemoNotice, ServiceNavigation } from "./service-common";

export function ServicesCatalog() {
  const [selected, setSelected] = useState<Service | null>(null);
  const [created, setCreated] = useState("");
  return (
    <Stack gap="lg">
      <ServiceNavigation />
      <div>
        <Text size="sm" c="dimmed">
          DX SUPPORT / SERVICE CATALOG
        </Text>
        <Title order={1} mt="xs">
          What do you need?
        </Title>
        <Text c="dimmed" mt="xs">
          Choose a service. Tell us the application and business need, and DX
          will review the next steps.
        </Text>
      </div>
      <DemoNotice />
      {created && (
        <Alert color="green" title="Demo request submitted" role="status">
          {created} is waiting for triage.{" "}
          <Anchor component={Link} href="/requests">
            Track your request
          </Anchor>
        </Alert>
      )}
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
        {services.map((service) => (
          <Card key={service.id} p="lg">
            <Stack h="100%" gap="md">
              <ThemeIcon variant="light" size={40}>
                <IconBriefcase size={22} />
              </ThemeIcon>
              <div>
                <Title order={2} size="h3">
                  {service.title}
                </Title>
                <Text c="dimmed" mt="xs">
                  {service.description}
                </Text>
              </div>
              <Text size="sm">{service.approval}</Text>
              <Button
                mt="auto"
                fullWidth
                rightSection={<IconArrowUpRight size={16} />}
                onClick={() => setSelected(service)}
              >
                Request {service.title.toLowerCase()}
              </Button>
            </Stack>
          </Card>
        ))}
      </SimpleGrid>
      <Modal
        opened={selected !== null}
        onClose={() => setSelected(null)}
        title={
          selected
            ? `Request ${selected.title.toLowerCase()}`
            : "Request service"
        }
        size="lg"
      >
        {selected && (
          <ServiceForm
            key={selected.id}
            service={selected}
            onSubmitted={(id) => {
              setCreated(id);
              setSelected(null);
            }}
          />
        )}
      </Modal>
    </Stack>
  );
}

function ServiceForm({
  service,
  onSubmitted,
}: {
  service: Service;
  onSubmitted: (id: string) => void;
}) {
  const { submitRequest } = useServices();
  const [draft, setDraft] = useState<RequestDraft>({
    serviceId: service.id,
    application: "",
    justification: "",
    details: {},
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        const issues = validateRequest(draft);
        setErrors(issues);
        if (!Object.keys(issues).length) onSubmitted(submitRequest(draft));
      }}
    >
      <Stack>
        <Alert title="Review expectations">
          {service.approval} Submission does not grant access or apply changes.
        </Alert>
        <Text size="sm" c="dimmed">
          Use references, not passwords or sensitive record contents.
        </Text>
        <TextInput
          label="Application"
          required
          value={draft.application}
          error={errors.application}
          onChange={(event) =>
            setDraft({ ...draft, application: event.currentTarget.value })
          }
        />
        {service.fields.map((field) => (
          <TextInput
            key={field.key}
            label={field.label}
            type={field.kind === "email" ? "email" : "text"}
            required
            error={errors[field.key]}
            value={draft.details[field.key] ?? ""}
            onChange={(event) =>
              setDraft({
                ...draft,
                details: {
                  ...draft.details,
                  [field.key]: event.currentTarget.value,
                },
              })
            }
          />
        ))}
        <Textarea
          label="Business justification"
          description="Explain why your team needs this service. At least 15 characters."
          required
          minRows={3}
          error={errors.justification}
          value={draft.justification}
          onChange={(event) =>
            setDraft({ ...draft, justification: event.currentTarget.value })
          }
        />
        <Group justify="flex-end">
          <Button type="submit" variant="filled">
            Submit demo request
          </Button>
        </Group>
      </Stack>
    </form>
  );
}
