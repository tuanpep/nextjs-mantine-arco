"use client";

import { useReducer, useState } from "react";
import {
  Alert,
  Badge,
  Button,
  Group,
  List,
  NativeSelect,
  Paper,
  Progress,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconClipboardCheck } from "@tabler/icons-react";

import { DetailsFormFields, DetailsReadout } from "@/lib/form-details";

import {
  composeUatDetails,
  uatDefectIntakeFields,
  uatDefectReadoutRows,
  validateUatDefectIntake,
} from "../lib/intake-fields";
import { campaignReducer, initialCampaign, isResult } from "../model";

export function UatScreen({ projectId }: { projectId?: string }) {
  const [campaign, dispatch] = useReducer(campaignReducer, initialCampaign);
  const [scenarioId, setScenarioId] = useState("UAT-01");
  const [severity, setSeverity] = useState("Major");
  const [notice, setNotice] = useState("");
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

  return (
    <Stack gap="lg">
      <Group gap="sm">
        <IconClipboardCheck size={28} aria-hidden />
        <div>
          <Title order={1}>UAT campaigns</Title>
          <Text c="dimmed">
            Run scenarios and track defects. Campaign progress is not release
            approval.
          </Text>
        </div>
      </Group>
      <Alert title="Demo session only" color="blue">
        All results and defects are sample data in page memory. Leaving or
        reloading resets this campaign. Recording a result does not approve a
        release or notify anyone.
        {projectId ? ` Project context: ${projectId}.` : ""}
      </Alert>
      <Paper withBorder p="lg">
        <Stack>
          <Group justify="space-between">
            <div>
              <Text size="sm" c="dimmed">
                CAMPAIGN · UAT-2026-04
              </Text>
              <Title order={2}>Beacon Portal readiness</Title>
            </div>
            <Badge color="orange">In progress</Badge>
          </Group>
          <Text>
            Scope: project switching, support intake, and scenario results. Run
            against the demo portal with sample records only.
          </Text>
          <Text size="sm" c="dimmed">
            Version: Beacon Portal pilot 1.0 · Test window: October 26–30, 2026
            · Demo coordinator: Hoa Nguyen
          </Text>
          <Text size="sm">
            Progress shows evidence only. Failed and blocked scenarios need
            follow-up. This screen does not record release acceptance.
          </Text>
          <SimpleGrid cols={{ base: 1, sm: 3 }}>
            <div>
              <Text fw={600}>Environment</Text>
              <Text>Local demo · sample build</Text>
            </div>
            <div>
              <Text fw={600}>Scenarios passed</Text>
              <Text>
                {passed} of {campaign.scenarios.length}
              </Text>
            </div>
            <div>
              <Text fw={600}>Unresolved defects</Text>
              <Text>{unresolved}</Text>
            </div>
          </SimpleGrid>
          <Progress
            value={(passed / campaign.scenarios.length) * 100}
            aria-label="Scenarios passed"
          />
        </Stack>
      </Paper>
      <Title order={2}>Execute scenarios</Title>
      <Text c="dimmed">
        Perform the steps in another tab, then record the observed result here.
        Blocked means you could not execute the test.
      </Text>
      <SimpleGrid cols={{ base: 1, lg: 3 }}>
        {campaign.scenarios.map((scenario) => (
          <Paper
            component="section"
            aria-label={scenario.id}
            withBorder
            p="lg"
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
              <Title order={3}>{scenario.title}</Title>
              <List type="ordered" spacing="xs">
                {scenario.steps.map((step) => (
                  <List.Item key={step}>{step}</List.Item>
                ))}
              </List>
              <div>
                <Text fw={600}>Expected result</Text>
                <Text size="sm">{scenario.expected}</Text>
              </div>
              <NativeSelect
                mt="auto"
                label={`Result for ${scenario.id}`}
                value={scenario.result}
                data={["Not run", "Pass", "Fail", "Blocked"]}
                onChange={(event) => {
                  const result = event.currentTarget.value;
                  if (isResult(result))
                    dispatch({
                      type: "result",
                      scenarioId: scenario.id,
                      result,
                    });
                }}
              />
              {scenario.result === "Fail" && (
                <Text size="sm" c="red">
                  Record a defect below with the actual behavior.
                </Text>
              )}
            </Stack>
          </Paper>
        ))}
      </SimpleGrid>
      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
        <Paper withBorder p="lg">
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
              setNotice("Defect added to this demo campaign.");
            })}
          >
            <Stack>
              <Title order={2}>Record a defect</Title>
              <NativeSelect
                label="Affected scenario"
                value={scenarioId}
                onChange={(event) => setScenarioId(event.currentTarget.value)}
                data={campaign.scenarios.map((scenario) => ({
                  value: scenario.id,
                  label: `${scenario.id} · ${scenario.title}`,
                }))}
              />
              <DetailsFormFields
                fields={uatDefectIntakeFields}
                getInputProps={(key) => defectForm.getInputProps(key)}
              />
              <NativeSelect
                label="Severity"
                value={severity}
                onChange={(event) => setSeverity(event.currentTarget.value)}
                data={["Critical", "Major", "Minor"]}
              />
              <Button type="submit" variant="filled">
                Add defect in demo
              </Button>
              {notice && (
                <Text role="status" c="green">
                  {notice}
                </Text>
              )}
            </Stack>
          </form>
        </Paper>
        <Paper withBorder p="lg">
          <Stack>
            <Title order={2}>Defect log</Title>
            {campaign.defects.length === 0 ? (
              <Stack gap="xs">
                <Text fw={600}>No defects recorded</Text>
                <Text c="dimmed">
                  If a scenario fails or is blocked by a product issue, record
                  the evidence here. A passing result alone does not close an
                  existing defect.
                </Text>
              </Stack>
            ) : (
              campaign.defects.map((defect) => (
                <Paper withBorder p="md" key={defect.id}>
                  <Stack gap="xs">
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
                    <DetailsReadout rows={uatDefectReadoutRows(defect.details)} />
                    {defect.status === "Open" && (
                      <Button
                        onClick={() =>
                          dispatch({ type: "retest", defectId: defect.id })
                        }
                      >
                        Start retest for DEF-{defect.id}
                      </Button>
                    )}
                    {defect.status === "Retesting" && (
                      <>
                        <Text size="sm">
                          Repeat the linked scenario and record Pass before
                          resolving.
                        </Text>
                        <Button
                          disabled={
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
                          Resolve DEF-{defect.id} after retest
                        </Button>
                      </>
                    )}
                  </Stack>
                </Paper>
              ))
            )}
          </Stack>
        </Paper>
      </SimpleGrid>
      <Paper withBorder p="lg">
        <Stack>
          <Title order={2}>Campaign progress</Title>
          <Text>
            Passed: {passed}. Failed or blocked: {failed}. Unresolved defects:{" "}
            {unresolved}. Not run is not a pass. Progress is evidence, not
            release approval.
          </Text>
          <Group>
            <Button
              onClick={() => {
                dispatch({ type: "reset" });
                setNotice("");
              }}
            >
              Reset campaign
            </Button>
          </Group>
        </Stack>
      </Paper>
    </Stack>
  );
}
