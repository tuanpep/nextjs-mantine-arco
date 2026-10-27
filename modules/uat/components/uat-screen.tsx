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
  Textarea,
  TextInput,
  Title,
} from "@mantine/core";
import { IconClipboardCheck } from "@tabler/icons-react";
import {
  campaignReducer,
  canAccept,
  initialCampaign,
  isResult,
} from "../model";

export function UatScreen() {
  const [campaign, dispatch] = useReducer(campaignReducer, initialCampaign);
  const [scenarioId, setScenarioId] = useState("UAT-01");
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [severity, setSeverity] = useState("Major");
  const [attempted, setAttempted] = useState(false);
  const [notice, setNotice] = useState("");
  const passed = campaign.scenarios.filter(
    (scenario) => scenario.result === "Pass",
  ).length;
  const unresolved = campaign.defects.filter(
    (defect) => defect.status !== "Resolved",
  ).length;
  const ready = canAccept(campaign);

  return (
    <Stack gap="lg">
      <Group gap="sm">
        <IconClipboardCheck size={28} aria-hidden />
        <div>
          <Title order={1}>User acceptance testing</Title>
          <Text c="dimmed">
            Run scenarios, track defects, and verify readiness.
          </Text>
        </div>
      </Group>
      <Alert title="Demo session only" color="blue">
        All results and defects are sample data in page memory. Leaving or
        reloading resets this campaign. Acceptance here does not approve a real
        release or notify anyone.
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
            <Badge color={campaign.accepted ? "green" : "orange"}>
              {campaign.accepted ? "Accepted in demo" : "In progress"}
            </Badge>
          </Group>
          <Text>
            Scope: project discovery, support intake, and self-service learning.
            Run against the demo portal with sample records only.
          </Text>
          <Text size="sm" c="dimmed">
            Release: Beacon Portal pilot 1.0 · Module: employee self-service ·
            Test window: October 26–30, 2026 · Demo coordinator: Product
            Services · Business acceptance role: department representative
          </Text>
          <Text size="sm">
            Entry criteria: the sample build is available and testers can open
            the portal. Exit criteria: every scenario passes and all recorded
            defects are resolved after retesting. This demo does not record
            formal business sign-off or deployment approval.
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
            noValidate
            onSubmit={(event) => {
              event.preventDefault();
              setAttempted(true);
              setNotice("");
              if (!title.trim() || !details.trim()) return;
              dispatch({
                type: "defect",
                scenarioId,
                title,
                details,
                severity,
              });
              setTitle("");
              setDetails("");
              setAttempted(false);
              setNotice("Defect added to this demo campaign.");
            }}
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
              <TextInput
                label="Defect summary"
                required
                maxLength={160}
                value={title}
                onChange={(event) => setTitle(event.currentTarget.value)}
                error={
                  attempted && !title.trim()
                    ? "Enter a defect summary."
                    : undefined
                }
              />
              <Textarea
                label="Steps and actual behavior"
                description="Include reproduction steps, expected outcome, and what happened. Use sample data, not personal information."
                required
                minRows={4}
                maxLength={4000}
                value={details}
                onChange={(event) => setDetails(event.currentTarget.value)}
                error={
                  attempted && !details.trim()
                    ? "Describe the steps and actual behavior."
                    : undefined
                }
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
                    <Text
                      size="sm"
                      style={{
                        whiteSpace: "pre-wrap",
                        overflowWrap: "anywhere",
                      }}
                    >
                      {defect.details}
                    </Text>
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
          <Title order={2}>Acceptance decision</Title>
          <Text>
            Every scenario must pass and every defect must be resolved after
            retesting. Any later change to results or defects clears acceptance.
          </Text>
          <Text role="status">
            {campaign.accepted
              ? "Campaign accepted in this demo. No real release approval was created."
              : ready
                ? "Ready for demo acceptance."
                : `Not ready: ${campaign.scenarios.length - passed} scenarios still need a passing result; ${unresolved} unresolved defects.`}
          </Text>
          <Group>
            <Button
              variant="filled"
              disabled={!ready || campaign.accepted}
              onClick={() => dispatch({ type: "accept" })}
            >
              Accept campaign in demo
            </Button>
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
