"use client";

import {
  Alert,
  Badge,
  Button,
  Divider,
  Group,
  Stack,
  Text,
  Textarea,
  Title,
} from "@mantine/core";
import { useMounted } from "@mantine/hooks";
import { useState } from "react";

import { DetailsReadout } from "@/lib/form-details";
import { getApplication } from "@/modules/projects/lib/applications";
import { DestinationUnavailable } from "@/modules/ui/components/destination-unavailable";
import { PageFrame } from "@/modules/ui/components/page-frame";
import { PageHeader } from "@/modules/ui/components/page-header";

import {
  feedbackDispositionLabels,
  feedbackItems,
  type FeedbackDisposition,
} from "../lib/fixtures";
import { feedbackReadoutRows } from "../lib/intake-fields";

export function FeedbackDetails({
  projectId,
  feedbackId,
}: {
  projectId: string;
  feedbackId: string;
}) {
  const mounted = useMounted();
  const application = getApplication(projectId);
  const item = feedbackItems.find(
    (entry) => entry.id === feedbackId && entry.projectId === projectId,
  );
  const [disposition, setDisposition] = useState<FeedbackDisposition>(
    item?.disposition ?? "Not reviewed",
  );
  const [reason, setReason] = useState(item?.reason ?? "");
  const [notice, setNotice] = useState("");

  if (!application || !item) {
    return (
      <PageFrame>
        <DestinationUnavailable
          backHref={`/projects/${projectId}/feedback`}
          backLabel="Quay lại phản hồi"
        />
      </PageFrame>
    );
  }

  const metadataPane = (
    <Stack gap="sm">
      <Badge variant="light" color="gray" style={{ alignSelf: "flex-start" }}>
        {feedbackDispositionLabels[disposition]}
      </Badge>
      <Text size="sm">Người xử lý tiếp theo: {item.nextActor}</Text>
    </Stack>
  );

  return (
    <PageFrame
      pane={metadataPane}
      paneLabel="Chi tiết phản hồi"
      paneNarrow="sheet"
      header={
        <PageHeader
          title={item.title}
          description={`${item.id} · ${application.name}`}
          breadcrumbs={[
            { title: "Phản hồi", href: `/projects/${projectId}/feedback` },
            { title: item.id },
          ]}
        />
      }
    >
      <Stack gap="lg">
        {notice && (
          <Alert role="status" color="teal">
            {notice}
          </Alert>
        )}
        <DetailsReadout
          rows={feedbackReadoutRows({
            observation: item.observation,
            context: item.context,
            nextActor: item.nextActor,
          })}
        />
        <Divider />
        <Stack gap="md">
          <Title order={2} size="h3">
            Kết quả xem xét
          </Title>
          <Alert color="blue">
            Tiếp nhận phản hồi không đồng nghĩa với cam kết thay đổi sản phẩm.
          </Alert>
          <Group gap="sm">
            {(
              [
                "Acknowledged",
                "Needs clarification",
                "Noted",
              ] as FeedbackDisposition[]
            ).map((value) => (
              <Button
                key={value}
                size="xs"
                variant={disposition === value ? "filled" : "default"}
                disabled={!mounted}
                onClick={() => setDisposition(value)}
              >
                {feedbackDispositionLabels[value]}
              </Button>
            ))}
          </Group>
          <Textarea
            disabled={!mounted}
            label="Lý do hiển thị cho người gửi"
            rows={3}
            value={reason}
            onChange={(event) => setReason(event.currentTarget.value)}
          />
          <Button
            style={{ alignSelf: "flex-start" }}
            disabled={!mounted || !reason.trim()}
            onClick={() =>
              setNotice(
                `Đã ghi nhận kết quả: ${feedbackDispositionLabels[disposition]}.`,
              )
            }
          >
            Ghi nhận kết quả xem xét
          </Button>
        </Stack>
      </Stack>
    </PageFrame>
  );
}
