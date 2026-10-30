"use client";

import {
  Accordion,
  ActionIcon,
  Alert,
  Anchor,
  Button,
  FileButton,
  Group,
  Select,
  Stack,
  Stepper,
  Text,
  Title,
  Tooltip,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useMounted } from "@mantine/hooks";
import { IconCheck, IconPaperclip, IconTrash } from "@tabler/icons-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { DetailsFormFields, DetailsReadout } from "@/lib/form-details";
import { getApplication } from "@/modules/projects/lib/applications";
import { PageFrame } from "@/modules/ui/components/page-frame";
import { PageHeader } from "@/modules/ui/components/page-header";

import {
  advanceEvidenceStatus,
  evidencePolicy,
  evidenceStatusLabels,
  formatFileSize,
  validateEvidenceFile,
  type EvidenceAttachment,
} from "../lib/attachments";
import { type SupportContext } from "../lib/fixtures";
import {
  intakeCopy,
  intakeFormSections,
  intakeHint,
  intakeReadoutRows,
  validateIntake,
} from "../lib/intake-fields";
import { calculatePriority, priorityLabels } from "../lib/priority";
import {
  parseRequestType,
  requestTypeLabels,
  type RequestType,
} from "../lib/request-catalog";
import { SupportUnavailable, supportPath } from "./support-common";
import { useSupport } from "./support-provider";

export function SupportForm({ projectId }: { projectId: string }) {
  const mounted = useMounted();
  const searchParams = useSearchParams();
  const { create } = useSupport();
  const [step, setStep] = useState<"write" | "review" | "created">("write");
  const [createdId, setCreatedId] = useState("");
  const [attachments, setAttachments] = useState<EvidenceAttachment[]>([]);
  const application = getApplication(projectId);
  const basePath = supportPath(projectId);
  const initialType = parseRequestType(searchParams.get("type"));
  const form = useForm<Omit<SupportContext, "attachments">>({
    initialValues: {
      summary: "",
      situation: "",
      expected: "",
      impact: "",
      environment: "",
      reproSteps: "",
      correlationId: "",
      requestType: initialType,
      impactScope: "",
      urgency: "",
    },
    validate: (values) => validateIntake(values),
  });

  useEffect(() => {
    form.setFieldValue("requestType", initialType);
    // Intentionally sync catalog deep-link only when the query type changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- form identity is stable enough for this demo sync
  }, [initialType]);

  if (!application) {
    return (
      <PageFrame>
        <SupportUnavailable />
      </PageFrame>
    );
  }

  const copy = intakeCopy(form.values.requestType);
  const sections = intakeFormSections(form.values.requestType);
  const suggestedPriority = calculatePriority(
    form.values.impactScope,
    form.values.urgency,
  );
  const title = requestTypeLabels[form.values.requestType];
  const hint = intakeHint(form.values.requestType);
  const contextValues = (): SupportContext => ({
    ...form.values,
    expected: copy.expectedVisible ? form.values.expected : "",
    reproSteps: copy.reproVisible ? form.values.reproSteps : "",
    correlationId: copy.correlationVisible ? form.values.correlationId : "",
    attachments,
  });

  function bumpAttachment(id: string) {
    setAttachments((current) =>
      current.map((file) =>
        file.id === id
          ? { ...file, status: advanceEvidenceStatus(file.status) }
          : file,
      ),
    );
  }

  function addFiles(files: File[]) {
    setAttachments((current) => {
      const room = 5 - current.length;
      if (room <= 0) return current;
      const next: EvidenceAttachment[] = [];
      for (const file of files.slice(0, room)) {
        const error = validateEvidenceFile(file);
        const attachment: EvidenceAttachment = {
          id: crypto.randomUUID(),
          name: file.name,
          sizeLabel: formatFileSize(file.size),
          status: error ? "Rejected" : "Selected",
          ...(error ? { error } : {}),
        };
        next.push(attachment);
        if (!error) {
          window.setTimeout(() => bumpAttachment(attachment.id), 400);
          window.setTimeout(() => bumpAttachment(attachment.id), 900);
          window.setTimeout(() => bumpAttachment(attachment.id), 1400);
        }
      }
      return [...current, ...next];
    });
  }

  function setRequestType(type: RequestType) {
    form.setFieldValue("requestType", type);
    form.clearErrors();
  }

  const reviewRows = [
    ...intakeReadoutRows(form.values, { includeSummary: true }),
    {
      label: "Mức ưu tiên đề xuất",
      value: priorityLabels[suggestedPriority],
    },
    {
      label: "Minh chứng",
      value:
        attachments.length === 0
          ? "Không có"
          : attachments
              .map(
                (file) =>
                  `${file.name} · ${evidenceStatusLabels[file.status]}${file.error ? ` · ${file.error}` : ""}`,
              )
              .join("\n"),
    },
  ];

  return (
    <PageFrame
      header={
        <PageHeader
          title={title}
          description={`${application.name} · ${hint}`}
          breadcrumbs={[
            { title: "Hỗ trợ", href: basePath },
            { title: "Tạo yêu cầu" },
          ]}
        />
      }
    >
      <Stack gap="md">
        <Alert color="blue">
          Chỉ dùng dữ liệu hư cấu, không cung cấp mật khẩu hoặc dữ liệu mật.
          Thay đổi chỉ được giữ trong phiên minh họa và sẽ mất khi tải lại ứng
          dụng. Không có yêu cầu hoặc thông báo thực được gửi.
        </Alert>
        {form.values.requestType === "access" && (
          <Alert color="orange">
            Gửi yêu cầu không đồng nghĩa với được cấp quyền. Bạn vẫn cần thực
            hiện quy trình cấp quyền đã được phê duyệt.
          </Alert>
        )}
        {form.values.requestType === "general" && (
          <Accordion variant="contained">
            <Accordion.Item value="wrong-place">
              <Accordion.Control>Chưa đúng nơi?</Accordion.Control>
              <Accordion.Panel>
                <Text size="sm">
                  Gửi đề xuất sản phẩm đến mục{" "}
                  <Anchor
                    component={Link}
                    href={`/projects/${projectId}/ideas`}
                  >
                    Ý tưởng
                  </Anchor>
                  . Gửi lời khen hoặc khó khăn không liên quan đến lỗi đến mục{" "}
                  <Anchor
                    component={Link}
                    href={`/projects/${projectId}/feedback`}
                  >
                    Phản hồi
                  </Anchor>
                  . Gửi lỗi trước khi phát hành đến mục{" "}
                  <Anchor component={Link} href={`/projects/${projectId}/uat`}>
                    UAT
                  </Anchor>
                  .
                </Text>
              </Accordion.Panel>
            </Accordion.Item>
          </Accordion>
        )}
        <Stepper
          active={step === "write" ? 0 : step === "review" ? 1 : 2}
          size="sm"
        >
          <Stepper.Step label="Mô tả" />
          <Stepper.Step label="Xem lại" />
          <Stepper.Step label="Hoàn tất" />
        </Stepper>
        {step === "created" ? (
          <Stack gap="md">
            <Group>
              <IconCheck size={24} aria-hidden />
              <Title order={2}>Đã tạo yêu cầu</Title>
            </Group>
            <Text size="sm">
              Nhóm phụ trách: {application.owner} · Người xử lý: Chưa tiếp nhận
              · Mức ưu tiên: {priorityLabels[suggestedPriority]}
            </Text>
            <Text fw={600}>{form.values.summary}</Text>
            <Text size="sm">
              Dự án: {application.name} · {createdId}
            </Text>
            <Text size="sm">
              Bước tiếp theo: nhóm phụ trách tiếp nhận trong quy trình minh họa.
              Yêu cầu chỉ được ghi nhận trong phiên này, không phải gửi đến dịch
              vụ thực.
            </Text>
            <Button
              component={Link}
              href={`${basePath}/${createdId}`}
              style={{ alignSelf: "flex-start" }}
            >
              Xem yêu cầu
            </Button>
            <Button
              component={Link}
              href={basePath}
              variant="default"
              style={{ alignSelf: "flex-start" }}
            >
              Quay lại Hỗ trợ
            </Button>
          </Stack>
        ) : step === "review" ? (
          <Stack gap="lg">
            <Title order={2}>Xem lại yêu cầu</Title>
            <Text size="sm" c="dimmed">
              Dự án: {application.name} · Người gửi: Jo Lee · Loại:{" "}
              {requestTypeLabels[form.values.requestType]}
            </Text>
            <DetailsReadout rows={reviewRows} />
            <Group justify="space-between">
              <Button variant="default" onClick={() => setStep("write")}>
                Quay lại chỉnh sửa
              </Button>
              <Button
                onClick={() => {
                  setCreatedId(create(contextValues(), projectId));
                  setStep("created");
                }}
              >
                Xác nhận tạo yêu cầu
              </Button>
            </Group>
          </Stack>
        ) : (
          <form onSubmit={form.onSubmit(() => setStep("review"))}>
            <Stack gap="md">
              <Select
                disabled={!mounted}
                label="Loại yêu cầu"
                data={(
                  Object.entries(requestTypeLabels) as [RequestType, string][]
                ).map(([value, label]) => ({ value, label }))}
                value={form.values.requestType}
                allowDeselect={false}
                onChange={(value) => setRequestType(parseRequestType(value))}
              />
              <DetailsFormFields
                fields={sections.primary}
                disabled={!mounted}
                getInputProps={(key) => form.getInputProps(key)}
                getSelectValue={(key) => {
                  const value = form.values[key];
                  return typeof value === "string" && value ? value : null;
                }}
                onSelectChange={(key, value) =>
                  form.setFieldValue(key, value as SupportContext[typeof key])
                }
                afterField={(key) =>
                  key === "urgency" ? (
                    <Text size="sm" mt="xs" c="dimmed">
                      Mức ưu tiên đề xuất:{" "}
                      <Text span fw={600} c="var(--mantine-color-text)">
                        {priorityLabels[suggestedPriority]}
                      </Text>
                    </Text>
                  ) : null
                }
              />
              <Accordion variant="contained" multiple defaultValue={[]}>
                <Accordion.Item value="optional">
                  <Accordion.Control>
                    Chi tiết không bắt buộc
                    {attachments.length > 0
                      ? ` · ${attachments.length} tệp`
                      : ""}
                  </Accordion.Control>
                  <Accordion.Panel>
                    <Stack gap="md">
                      {sections.optional.length > 0 ? (
                        <DetailsFormFields
                          fields={sections.optional}
                          disabled={!mounted}
                          getInputProps={(key) => form.getInputProps(key)}
                          getSelectValue={(key) => {
                            const value = form.values[key];
                            return typeof value === "string" && value
                              ? value
                              : null;
                          }}
                          onSelectChange={(key, value) =>
                            form.setFieldValue(
                              key,
                              value as SupportContext[typeof key],
                            )
                          }
                        />
                      ) : null}
                      <Stack gap="xs">
                        <Text size="sm" fw={600}>
                          Minh chứng
                        </Text>
                        <Group gap="xs">
                          <FileButton
                            disabled={!mounted || attachments.length >= 5}
                            multiple
                            accept="image/png,image/jpeg,application/pdf"
                            onChange={(files) => addFiles(files)}
                          >
                            {(props) => (
                              <Tooltip label={evidencePolicy}>
                                <Button
                                  {...props}
                                  variant="light"
                                  disabled={!mounted}
                                  leftSection={
                                    <IconPaperclip size={16} aria-hidden />
                                  }
                                >
                                  Chọn tệp
                                </Button>
                              </Tooltip>
                            )}
                          </FileButton>
                        </Group>
                        {attachments.map((file) => (
                          <Group key={file.id} justify="space-between">
                            <Text size="sm">
                              {file.name} · {file.sizeLabel} ·{" "}
                              {evidenceStatusLabels[file.status]}
                              {file.error ? ` · ${file.error}` : ""}
                            </Text>
                            <ActionIcon
                              variant="subtle"
                              color="red"
                              aria-label={`Xóa ${file.name}`}
                              onClick={() =>
                                setAttachments((current) =>
                                  current.filter((item) => item.id !== file.id),
                                )
                              }
                            >
                              <IconTrash size={16} />
                            </ActionIcon>
                          </Group>
                        ))}
                      </Stack>
                    </Stack>
                  </Accordion.Panel>
                </Accordion.Item>
              </Accordion>
              <Group justify="flex-end">
                <Button type="submit" disabled={!mounted}>
                  Xem lại yêu cầu
                </Button>
              </Group>
            </Stack>
          </form>
        )}
      </Stack>
    </PageFrame>
  );
}
