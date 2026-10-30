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
import {
  campaignReducer,
  defectStatusLabels,
  initialCampaign,
  isResult,
  resultLabels,
  severityOptions,
} from "../model";

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
          title="Kiểm thử nghiệm thu"
          breadcrumbs={[
            ...(projectId
              ? [{ title: "Tổng quan", href: `/projects/${projectId}` }]
              : []),
            {
              title: "Kiểm thử nghiệm thu",
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
                ? `Tiếp tục ${firstPending.id}`
                : "Đã ghi nhận tất cả kịch bản"}
            </Button>
          }
        />
      }
    >
      <Stack gap="lg">
        <Alert color="blue">
          Tiến độ kiểm thử không phải là phê duyệt phát hành. Kết quả sẽ đặt lại
          khi tải lại trang.
        </Alert>

        <Stack gap="sm">
          <Group justify="space-between" align="flex-start">
            <div>
              <Text size="sm" c="dimmed">
                ĐỢT KIỂM THỬ · UAT-2026-04
              </Text>
              <Title order={2} size="h3">
                Mức độ sẵn sàng của Beacon Portal
              </Title>
            </div>
            <Badge color="orange">Đang thực hiện</Badge>
          </Group>
          <Text size="sm" c="dimmed">
            Phiên bản: Beacon Portal thử nghiệm 1.0 · Thời gian kiểm thử: từ
            ngày 26 đến ngày 30 tháng 10 năm 2026 · Người điều phối bản mẫu: Hoa
            Nguyen · Bản mẫu chạy cục bộ
          </Text>
          <Group gap="xl">
            <Text size="sm">
              <Text span fw={600}>
                Đạt
              </Text>{" "}
              {passed} / {campaign.scenarios.length}
            </Text>
            <Text size="sm">
              <Text span fw={600}>
                Lỗi chưa xử lý
              </Text>{" "}
              {unresolved}
            </Text>
            <Text size="sm">
              <Text span fw={600}>
                Không đạt hoặc bị chặn
              </Text>{" "}
              {failed}
            </Text>
          </Group>
          <Progress
            value={(passed / campaign.scenarios.length) * 100}
            aria-label="Kịch bản đạt"
          />
        </Stack>

        <Divider />

        <Stack gap="sm">
          <Title order={2} size="h3">
            Thực hiện kịch bản
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
                      {resultLabels[scenario.result]}
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
                      Kết quả mong đợi
                    </Text>
                    <Text size="sm">{scenario.expected}</Text>
                  </div>
                  <Select
                    mt="auto"
                    disabled={!mounted}
                    label="Kết quả"
                    aria-label={`Kết quả của ${scenario.id}`}
                    value={scenario.result}
                    allowDeselect={false}
                    data={Object.entries(resultLabels).map(
                      ([value, label]) => ({ value, label }),
                    )}
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
                      Ghi nhận lỗi tại thẻ Ghi nhận lỗi bên dưới.
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
          <Tabs.List aria-label="Chế độ xem lỗi UAT">
            <Tabs.Tab value="record">Ghi nhận lỗi</Tabs.Tab>
            <Tabs.Tab value="log">
              Nhật ký lỗi
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
                setNotice("Đã thêm lỗi.");
                void setSecondaryTab("log");
              })}
            >
              <Stack maw={560}>
                <Select
                  disabled={!mounted}
                  label="Kịch bản bị ảnh hưởng"
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
                  label="Mức độ nghiêm trọng"
                  value={severity}
                  allowDeselect={false}
                  onChange={(value) => {
                    if (value) setSeverity(value);
                  }}
                  data={severityOptions}
                />
                <Button type="submit" variant="filled" disabled={!mounted}>
                  Thêm lỗi
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
                  <Text fw={600}>Chưa ghi nhận lỗi</Text>
                  <Text c="dimmed" size="sm">
                    Ghi nhận bằng chứng tại thẻ Ghi nhận lỗi khi kịch bản không
                    đạt.
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
                        {defectStatusLabels[defect.status]}
                      </Badge>
                    </Group>
                    <Text size="sm" c="dimmed">
                      {defect.scenarioId} ·{" "}
                      {severityOptions.find(
                        (option) => option.value === defect.severity,
                      )?.label ?? "Chưa xác định"}
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
                        Bắt đầu kiểm thử lại
                      </Button>
                    )}
                    {defect.status === "Retesting" && (
                      <>
                        <Text size="sm">
                          Chạy lại kịch bản liên kết và ghi nhận kết quả Đạt
                          trước khi xác nhận đã xử lý.
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
                          Xác nhận đã xử lý sau kiểm thử lại
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
            Tiến độ đợt kiểm thử
          </Title>
          <Text size="sm">
            Đạt: {passed}. Không đạt hoặc bị chặn: {failed}. Lỗi chưa xử lý:{" "}
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
            Đặt lại đợt kiểm thử
          </Button>
        </Stack>
      </Stack>
    </PageFrame>
  );
}
