"use client";

import { useReducer, useState } from "react";
import {
  Alert,
  Badge,
  Button,
  Divider,
  Group,
  List,
  Paper,
  Progress,
  Select,
  SimpleGrid,
  Stack,
  Tabs,
  Text,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useMounted } from "@mantine/hooks";
import { parseAsStringLiteral, useQueryState } from "nuqs";

import { DetailsFormFields, DetailsReadout } from "@/lib/form-details";
import { PageFrame } from "@/modules/ui/components/page-frame";
import { PageHeader } from "@/modules/ui/components/page-header";

import {
  composeUatDetails,
  uatDefectIntakeFields,
  uatDefectReadoutRows,
  validateUatDefectIntake,
} from "../lib/intake-fields";
import { campaignReducer, initialCampaign, isResult } from "../model";

const uatDefectTabs = ["record", "log"] as const;

export function UatScreen({ projectId }: { projectId?: string }) {
  const mounted = useMounted();
  const [campaign, dispatch] = useReducer(campaignReducer, initialCampaign);
  const [scenarioId, setScenarioId] = useState("UAT-01");
  const [severity, setSeverity] = useState("Major");
  const [notice, setNotice] = useState("");
  const [secondaryTab, setSecondaryTab] = useQueryState(
    "tab",
    parseAsStringLiteral(uatDefectTabs).withDefault("log"),
  );
  const defectForm = useForm({
    initialValues: {
      title: "",
      reproSteps: "",
      expected: "",
      actual: "",
    },
    validate: validateUatDefectIntake,
  });
  const passed = campaign.scenarios.filter(
    (scenario) => scenario.result === "Pass",
  ).length;
  const unresolved = campaign.defects.filter(
    (defect) => defect.status !== "Resolved",
  ).length;
  const failed = campaign.scenarios.filter(
    (scenario) => scenario.result === "Fail" || scenario.result === "Blocked",
  ).length;
  const firstPending = campaign.scenarios.find(
    (scenario) => scenario.result === "Not run",
  );

  function focusPendingScenario() {
    if (!firstPending) return;
    const node = document.getElementById(`scenario-${firstPending.id}`);
    node?.scrollIntoView({ behavior: "smooth", block: "start" });
    const select = node?.querySelector<HTMLInputElement>(
      'input, [role="textbox"]',
    );
    select?.focus();
  }

  return (
    <PageFrame
      header={
        <PageHeader
          title="UAT"
          breadcrumbs={[
            ...(projectId
              ? [{ title: "Overview", href: `/projects/${projectId}` }]
              : []),
            {
              title: "UAT",
              href: projectId ? `/projects/${projectId}/uat` : "/uat",
            },
          ]}
          actions={
            <Button
              variant="default"
              disabled={!mounted || !firstPending}
              onClick={focusPendingScenario}
            >
              {firstPending
                ? `Continue ${firstPending.id}`
                : "All scenarios recorded"}
            </Button>
          }
        />
      }
    >
      <Stack gap="lg">
        <Alert color="blue">
          Campaign progress is not release approval. Results reset on reload.
        </Alert>

        <Stack gap="sm">
          <Group justify="space-between" align="flex-start">
            <div>
              <Text size="sm" c="dimmed">
                CAMPAIGN · UAT-2026-04
              </Text>
              <Title order={2} size="h3">
                Beacon Portal readiness
              </Title>
            </div>
            <Badge color="orange">In progress</Badge>
          </Group>
          <Text size="sm" c="dimmed">
            Version: Beacon Portal pilot 1.0 · Test window: October 26–30, 2026
            · Demo coordinator: Hoa Nguyen · Local demo
          </Text>
          <Group gap="xl">
            <Text size="sm">
              <Text span fw={600}>
                Passed
              </Text>{" "}
              {passed} of {campaign.scenarios.length}
            </Text>
            <Text size="sm">
              <Text span fw={600}>
                Unresolved defects
              </Text>{" "}
              {unresolved}
            </Text>
            <Text size="sm">
              <Text span fw={600}>
                Failed or blocked
              </Text>{" "}
              {failed}
            </Text>
          </Group>
          <Progress
            value={(passed / campaign.scenarios.length) * 100}
            aria-label="Scenarios passed"
          />
        </Stack>

        <Divider />

        <Stack gap="sm">
          <Title order={2} size="h3">
            Execute scenarios
          </Title>
          <SimpleGrid cols={{ base: 1, lg: 3 }}>
            {campaign.scenarios.map((scenario) => (
              <Paper
                component="section"
                id={`scenario-${scenario.id}`}
                aria-label={scenario.id}
                withBorder
                p="md"
                key={scenario.id}
              >
                <Stack h="100%">
                  <Group justify="space-between">
                    <Text size="sm" c="dimmed">
                      {scenario.id}
                    </Text>
                    <Badge
                      color={
                        scenario.result === "Pass"
                          ? "green"
                          : scenario.result === "Fail"
                            ? "red"
                            : "gray"
                      }
                    >
                      {scenario.result}
                    </Badge>
                  </Group>
                  <Title order={3} size="h4">
                    {scenario.title}
                  </Title>
                  <List type="ordered" spacing="xs" size="sm">
                    {scenario.steps.map((step) => (
                      <List.Item key={step}>{step}</List.Item>
                    ))}
                  </List>
                  <div>
                    <Text fw={600} size="sm">
                      Expected result
                    </Text>
                    <Text size="sm">{scenario.expected}</Text>
                  </div>
                  <Select
                    mt="auto"
                    disabled={!mounted}
                    label="Result"
                    aria-label={`Result for ${scenario.id}`}
                    value={scenario.result}
                    allowDeselect={false}
                    data={["Not run", "Pass", "Fail", "Blocked"]}
                    onChange={(value) => {
                      if (value && isResult(value))
                        dispatch({
                          type: "result",
                          scenarioId: scenario.id,
                          result: value,
                        });
                      if (value === "Fail") void setSecondaryTab("record");
                    }}
                  />
                  {scenario.result === "Fail" && (
                    <Text size="sm" c="red">
                      Record a defect in the Defects tab below.
                    </Text>
                  )}
                </Stack>
              </Paper>
            ))}
          </SimpleGrid>
        </Stack>

        <Tabs
          value={secondaryTab}
          onChange={(value) => {
            if (value === "record" || value === "log") {
              void setSecondaryTab(value);
            }
          }}
        >
          <Tabs.List aria-label="UAT defect views">
            <Tabs.Tab value="record">Record defect</Tabs.Tab>
            <Tabs.Tab value="log">
              Defect log
              {campaign.defects.length > 0
                ? ` (${campaign.defects.length})`
                : ""}
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="record" pt="md">
            <form
              onSubmit={defectForm.onSubmit((values) => {
                setNotice("");
                dispatch({
                  type: "defect",
                  scenarioId,
                  title: values.title.trim().slice(0, 160),
                  details: composeUatDetails(values).slice(0, 4000),
                  severity,
                });
                defectForm.reset();
                setNotice("Defect added.");
                void setSecondaryTab("log");
              })}
            >
              <Stack maw={560}>
                <Select
                  disabled={!mounted}
                  label="Affected scenario"
                  value={scenarioId}
                  allowDeselect={false}
                  onChange={(value) => {
                    if (value) setScenarioId(value);
                  }}
                  data={campaign.scenarios.map((scenario) => ({
                    value: scenario.id,
                    label: `${scenario.id} · ${scenario.title}`,
                  }))}
                />
                <DetailsFormFields
                  fields={uatDefectIntakeFields}
                  disabled={!mounted}
                  getInputProps={(key) => defectForm.getInputProps(key)}
                />
                <Select
                  disabled={!mounted}
                  label="Severity"
                  value={severity}
                  allowDeselect={false}
                  onChange={(value) => {
                    if (value) setSeverity(value);
                  }}
                  data={["Critical", "Major", "Minor"]}
                />
                <Button type="submit" variant="filled" disabled={!mounted}>
                  Add defect
                </Button>
                {notice && (
                  <Text role="status" c="green">
                    {notice}
                  </Text>
                )}
              </Stack>
            </form>
          </Tabs.Panel>

          <Tabs.Panel value="log" pt="md">
            <Stack gap="md">
              {campaign.defects.length === 0 ? (
                <Stack gap="xs">
                  <Text fw={600}>No defects recorded</Text>
                  <Text c="dimmed" size="sm">
                    Record evidence on the Record defect tab when a scenario
                    fails.
                  </Text>
                </Stack>
              ) : (
                campaign.defects.map((defect) => (
                  <Stack
                    key={defect.id}
                    gap="xs"
                    pb="md"
                    style={{
                      borderBottom:
                        "1px solid var(--mantine-color-default-border)",
                    }}
                  >
                    <Group justify="space-between">
                      <Text fw={600}>
                        DEF-{defect.id} · {defect.title}
                      </Text>
                      <Badge
                        color={
                          defect.status === "Resolved" ? "green" : "orange"
                        }
                      >
                        {defect.status}
                      </Badge>
                    </Group>
                    <Text size="sm" c="dimmed">
                      {defect.scenarioId} · {defect.severity}
                    </Text>
                    <DetailsReadout
                      rows={uatDefectReadoutRows(defect.details)}
                    />
                    {defect.status === "Open" && (
                      <Button
                        style={{ alignSelf: "flex-start" }}
                        disabled={!mounted}
                        onClick={() =>
                          dispatch({ type: "retest", defectId: defect.id })
                        }
                      >
                        Start retest
                      </Button>
                    )}
                    {defect.status === "Retesting" && (
                      <>
                        <Text size="sm">
                          Repeat the linked scenario and record Pass before
                          resolving.
                        </Text>
                        <Button
                          style={{ alignSelf: "flex-start" }}
                          disabled={
                            !mounted ||
                            !campaign.scenarios.some(
                              (scenario) =>
                                scenario.id === defect.scenarioId &&
                                scenario.result === "Pass",
                            )
                          }
                          onClick={() =>
                            dispatch({ type: "resolve", defectId: defect.id })
                          }
                        >
                          Resolve after retest
                        </Button>
                      </>
                    )}
                  </Stack>
                ))
              )}
            </Stack>
          </Tabs.Panel>
        </Tabs>

        <Divider />

        <Stack gap="sm">
          <Title order={2} size="h4">
            Campaign progress
          </Title>
          <Text size="sm">
            Passed: {passed}. Failed or blocked: {failed}. Unresolved defects:{" "}
            {unresolved}.
          </Text>
          <Button
            style={{ alignSelf: "flex-start" }}
            variant="default"
            disabled={!mounted}
            onClick={() => {
              dispatch({ type: "reset" });
              setNotice("");
            }}
          >
            Reset campaign
          </Button>
        </Stack>
      </Stack>
    </PageFrame>
  );
}
