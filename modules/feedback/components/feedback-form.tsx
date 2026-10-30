"use client";

import { Alert, Button, Group, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useMounted } from "@mantine/hooks";
import { useRouter } from "nextjs-toploader/app";
import { useState } from "react";

import { DetailsFormFields } from "@/lib/form-details";
import { getApplication } from "@/modules/projects/lib/applications";
import { DestinationUnavailable } from "@/modules/ui/components/destination-unavailable";
import { PageFrame } from "@/modules/ui/components/page-frame";
import { PageHeader } from "@/modules/ui/components/page-header";

import { feedbackIntakeFields } from "../lib/intake-fields";

export function FeedbackForm({ projectId }: { projectId: string }) {
  const mounted = useMounted();
  const router = useRouter();
  const application = getApplication(projectId);
  const [notice, setNotice] = useState("");
  const form = useForm({
    initialValues: {
      title: "",
      observation: "",
      context: "",
    },
    validate: {
      title: (value) => (value.trim() ? null : "Nhập tiêu đề ngắn."),
      observation: (value) =>
        value.trim() ? null : "Mô tả điều bạn quan sát được.",
    },
  });

  if (!application) {
    return (
      <PageFrame>
        <DestinationUnavailable
          backHref="/"
          backLabel="Quay lại danh sách dự án"
        />
      </PageFrame>
    );
  }

  return (
    <PageFrame
      header={
        <PageHeader
          title="Chia sẻ phản hồi"
          breadcrumbs={[
            { title: "Phản hồi", href: `/projects/${projectId}/feedback` },
            { title: "Phản hồi mới" },
          ]}
        />
      }
    >
      <Stack gap="md">
        <Alert color="blue" title="Không cam kết thay đổi sản phẩm">
          Ghi nhận phản hồi không đồng nghĩa với cam kết thay đổi.
        </Alert>
        {notice && (
          <Alert role="status" color="teal">
            {notice}
          </Alert>
        )}
        <form
          onSubmit={form.onSubmit(() => {
            setNotice("Đã lưu phản hồi FB-DEMO. Lan Vo sẽ xem xét tiếp theo.");
            router.push(`/projects/${projectId}/feedback`);
          })}
        >
          <Stack gap="md">
            <DetailsFormFields
              fields={feedbackIntakeFields}
              disabled={!mounted}
              getInputProps={(key) => form.getInputProps(key)}
            />
            <Group justify="flex-end">
              <Button type="submit" disabled={!mounted}>
                Gửi phản hồi
              </Button>
            </Group>
          </Stack>
        </form>
      </Stack>
    </PageFrame>
  );
}
