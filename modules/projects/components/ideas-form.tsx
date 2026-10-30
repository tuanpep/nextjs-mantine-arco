"use client";

import { Accordion, Alert, Button, Group, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useMounted } from "@mantine/hooks";
import { useRouter } from "nextjs-toploader/app";
import { useState } from "react";

import { DetailsFormFields } from "@/lib/form-details";
import { getApplication } from "@/modules/projects/lib/applications";
import { DestinationUnavailable } from "@/modules/ui/components/destination-unavailable";
import { PageFrame } from "@/modules/ui/components/page-frame";
import { PageHeader } from "@/modules/ui/components/page-header";

import {
  ideaOptionalFields,
  ideaRequiredFields,
} from "../lib/idea-intake-fields";

export function IdeasForm({ projectId }: { projectId: string }) {
  const mounted = useMounted();
  const router = useRouter();
  const application = getApplication(projectId);
  const [notice, setNotice] = useState("");
  const form = useForm({
    initialValues: {
      title: "",
      problem: "",
      outcome: "",
      suggestedChange: "",
      sponsorCandidate: "",
    },
    validate: {
      title: (value) => (value.trim() ? null : "Nhập tiêu đề ngắn gọn."),
      problem: (value) =>
        value.trim() ? null : "Mô tả vấn đề bằng ngôn ngữ dễ hiểu.",
      outcome: (value) => (value.trim() ? null : "Mô tả kết quả mong muốn."),
    },
  });

  if (!application) {
    return (
      <PageFrame>
        <DestinationUnavailable backHref="/" backLabel="Quay lại dự án" />
      </PageFrame>
    );
  }

  return (
    <PageFrame
      header={
        <PageHeader
          title="Đề xuất ý tưởng"
          breadcrumbs={[
            { title: "Ý tưởng", href: `/projects/${projectId}/ideas` },
            { title: "Ý tưởng mới" },
          ]}
        />
      }
    >
      <Stack gap="md">
        <Alert color="blue" title="Không phải cam kết thực hiện">
          Gửi ý tưởng không đồng nghĩa với việc đưa công việc vào kế hoạch.
        </Alert>
        {notice && (
          <Alert role="status" color="teal">
            {notice}
          </Alert>
        )}
        <form
          onSubmit={form.onSubmit(() => {
            setNotice(
              "Đã lưu IDE-DEMO. Lượt bình chọn của bạn đã được tính một lần.",
            );
            router.push(`/projects/${projectId}/ideas`);
          })}
        >
          <Stack gap="md">
            <DetailsFormFields
              fields={ideaRequiredFields}
              disabled={!mounted}
              getInputProps={(key) => form.getInputProps(key)}
            />
            <Accordion variant="contained">
              <Accordion.Item value="optional">
                <Accordion.Control>Thông tin bổ sung</Accordion.Control>
                <Accordion.Panel>
                  <DetailsFormFields
                    fields={ideaOptionalFields}
                    disabled={!mounted}
                    getInputProps={(key) => form.getInputProps(key)}
                  />
                </Accordion.Panel>
              </Accordion.Item>
            </Accordion>
            <Group justify="flex-end">
              <Button type="submit" disabled={!mounted}>
                Gửi ý tưởng
              </Button>
            </Group>
          </Stack>
        </form>
      </Stack>
    </PageFrame>
  );
}
