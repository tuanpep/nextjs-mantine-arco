"use client";

import {
  Alert,
  Avatar,
  Badge,
  Button,
  Divider,
  Group,
  Select,
  Stack,
  Text,
  Textarea,
  Title,
} from "@mantine/core";
import { IconMessageCircle } from "@tabler/icons-react";
import { useRef, useState } from "react";
import { useMounted } from "@mantine/hooks";
import Link from "next/link";

import { DetailsReadout } from "@/lib/form-details";
import { PageFrame } from "@/modules/ui/components/page-frame";
import { PageHeader } from "@/modules/ui/components/page-header";
import {
  nextActorLabels,
  retestResultLabels,
  triageDispositionLabels,
  type SupportRequest,
} from "../lib/fixtures";
import { evidenceStatusLabels } from "../lib/attachments";
import { intakeReadoutRows, misrouteTargetLabels } from "../lib/intake-fields";
import { priorities, priorityLabels, type Priority } from "../lib/priority";
import { requestTypeLabels } from "../lib/request-catalog";
import { getApplication } from "@/modules/projects/lib/applications";
import {
  SupportStatusBadge,
  SupportUnavailable,
  supportPath,
} from "./support-common";
import { SupportHandlerTriage } from "./support-handler-triage";
import { useSupport } from "./support-provider";

export function SupportDetails({
  projectId,
  supportId,
}: {
  projectId?: string;
  supportId: string;
}) {
  const { requests } = useSupport();
  if (projectId && !getApplication(projectId)) {
    return (
      <PageFrame>
        <SupportUnavailable />
      </PageFrame>
    );
  }
  const item = requests.find(
    (request) =>
      request.id === supportId &&
      (!projectId || request.applicationId === projectId),
  );
  if (!item) {
    return (
      <PageFrame>
        <SupportUnavailable />
      </PageFrame>
    );
  }
  return <SupportDetailContent key={item.id} item={item} />;
}

function SupportDetailContent({ item }: { item: SupportRequest }) {
  const mounted = useMounted();
  const { respond, handle } = useSupport();
  const [text, setText] = useState("");
  const [result, setResult] = useState<"Pass" | "Fail" | "Unable">("Pass");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [reopening, setReopening] = useState(false);
  const responseHeading = useRef<HTMLHeadingElement>(null);
  const needsResponse =
    item.status === "Waiting for sender" ||
    item.status === "Waiting for retest";
  const actionTitle =
    item.status === "Waiting for retest"
      ? "Báo kết quả kiểm tra lại"
      : item.status === "Resolved"
        ? "Cần mở lại yêu cầu này?"
        : item.status === "Waiting for sender"
          ? "Phản hồi cho nhóm"
          : "Thêm cập nhật";

  function submitResponse(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (
      !text.trim() &&
      (item.status !== "Waiting for retest" || result !== "Pass")
    ) {
      setError(
        item.status === "Resolved"
          ? "Giải thích lý do cần mở lại yêu cầu này."
          : "Thêm ghi chú trước khi xác nhận.",
      );
      return;
    }
    if (item.status === "Resolved") {
      respond(item.id, { kind: "reopen", text });
      setNotice(
        `Đã mở lại. Kết quả chính thức trước đó được giữ bên dưới. ${item.handler} sẽ xem xét lý do của bạn.`,
      );
    } else if (item.status === "Waiting for retest") {
      respond(item.id, { kind: "retest", result, text });
      setNotice(
        "Đã ghi nhận kết quả kiểm tra lại. Người xử lý sẽ thực hiện bước tiếp theo. Việc này không giải quyết yêu cầu hoặc phê duyệt UAT.",
      );
    } else if (item.status === "Waiting for sender") {
      respond(item.id, { kind: "reply", text });
      setNotice(
        "Đã thêm phản hồi. Người xử lý sẽ thực hiện bước tiếp theo. Phản hồi của bạn không phải kết quả giải quyết.",
      );
    } else {
      respond(item.id, { kind: "comment", text });
      setNotice("Đã thêm cập nhật. Trách nhiệm hiện tại không thay đổi.");
    }
    setText("");
    setError("");
    setReopening(false);
  }

  const metadataPane = (
    <Stack gap="lg">
      <Stack gap="sm">
        <SupportStatusBadge status={item.status} />
        <Group gap="xs">
          <Badge variant="light">{requestTypeLabels[item.requestType]}</Badge>
          <Badge variant="light" color="grape">
            Mức ưu tiên {priorityLabels[item.priority]}
          </Badge>
          {item.lastDisposition && (
            <Badge variant="outline">
              {triageDispositionLabels[item.lastDisposition]}
            </Badge>
          )}
          {item.autoClosePaused && (
            <Badge variant="outline" color="orange">
              Đã tạm dừng tự động đóng
            </Badge>
          )}
        </Group>
      </Stack>
      <Divider />
      <Stack gap="sm">
        <Title order={2} size="h4">
          Trách nhiệm hiện tại
        </Title>
        <div>
          <Text size="sm" c="dimmed">
            Nhóm phụ trách
          </Text>
          <Text fw={600} size="sm">
            {item.responsibleTeam}
          </Text>
        </div>
        <div>
          <Text size="sm" c="dimmed">
            Người xử lý
          </Text>
          <Text fw={600} size="sm">
            {item.handler ?? "Chưa tiếp nhận"}
          </Text>
        </div>
        <div>
          <Text size="sm" c="dimmed">
            Bên thực hiện tiếp theo
          </Text>
          <Text fw={600} size="sm">
            {nextActorLabels[item.nextActor]}
          </Text>
        </div>
        {item.engTrackerId && (
          <div>
            <Text size="sm" c="dimmed">
              Công việc kỹ thuật
            </Text>
            <Text fw={600} size="sm">
              {item.engTrackerId}
            </Text>
          </div>
        )}
        {item.relatedRequestId && (
          <div>
            <Text size="sm" c="dimmed">
              Yêu cầu liên quan
            </Text>
            <Text fw={600} size="sm">
              {item.relatedRequestId}
            </Text>
          </div>
        )}
        {item.misrouteTarget && (
          <div>
            <Text size="sm" c="dimmed">
              Đã chuyển đến
            </Text>
            <Text fw={600} size="sm">
              {misrouteTargetLabels[item.misrouteTarget]}
            </Text>
          </div>
        )}
        <div>
          <Text size="sm" fw={600}>
            Bước tiếp theo
          </Text>
          <Text size="sm">{item.nextAction}</Text>
        </div>
        {item.status !== "Resolved" && (
          <Select
            disabled={!mounted}
            label="Điều chỉnh mức ưu tiên"
            data={priorities.map((value) => ({
              value,
              label: priorityLabels[value],
            }))}
            value={item.priority}
            allowDeselect={false}
            onChange={(value) => {
              if (!value) return;
              handle(item.id, {
                kind: "set-priority",
                priority: value as Priority,
              });
              setNotice(
                `Đã đặt mức ưu tiên: ${priorityLabels[value as Priority]}.`,
              );
            }}
          />
        )}
      </Stack>
    </Stack>
  );

  return (
    <PageFrame
      pane={metadataPane}
      paneLabel="Chi tiết yêu cầu"
      paneNarrow="sheet"
      header={
        <PageHeader
          title={item.summary}
          description={`${item.id} · Người gửi: ${item.sender}`}
          breadcrumbs={[
            { title: "Hỗ trợ", href: supportPath(item.applicationId) },
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
        <Stack
          component="section"
          aria-label="Bước tiếp theo của yêu cầu"
          gap="sm"
        >
          <Title order={2} size="h3">
            {item.status === "Resolved"
              ? "Yêu cầu đã có kết quả"
              : needsResponse
                ? "Bạn cần thực hiện bước tiếp theo"
                : "Bên thực hiện tiếp theo: " + nextActorLabels[item.nextActor]}
          </Title>
          <Text>
            {item.status === "Resolved"
              ? "Bạn không cần phản hồi thêm. Nếu vấn đề vẫn còn, hãy mở lại yêu cầu và nêu lý do."
              : item.nextAction}
          </Text>
          {needsResponse && (
            <Button
              variant="light"
              style={{ alignSelf: "flex-start" }}
              onClick={() => responseHeading.current?.focus()}
            >
              {item.status === "Waiting for retest"
                ? "Đến phần kiểm tra lại"
                : "Đến phần phản hồi"}
            </Button>
          )}
          {item.status === "Resolved" && !reopening && (
            <Button
              variant="light"
              disabled={!mounted}
              style={{ alignSelf: "flex-start" }}
              onClick={() => setReopening(true)}
            >
              Mở lại yêu cầu
            </Button>
          )}
          <Text size="sm" c="dimmed">
            Đây là dữ liệu minh họa trong phiên hiện tại. Không có thông báo
            thực được gửi; tải lại ứng dụng sẽ đặt lại thay đổi.
          </Text>
        </Stack>
        {(item.status !== "Resolved" || reopening) && (
          <form onSubmit={submitResponse}>
            <Stack>
              <Title ref={responseHeading} tabIndex={-1} order={2} size="h3">
                {actionTitle}
              </Title>
              <Text size="sm" c="dimmed">
                {item.status === "Resolved"
                  ? "Mở lại sẽ chuyển bước tiếp theo cho người xử lý và giữ kết quả trước đó trong lịch sử."
                  : item.status === "Waiting for retest"
                    ? "Ghi nhận kết quả để người xử lý xem xét. Kết quả đạt không tự giải quyết yêu cầu."
                    : item.status === "Waiting for sender"
                      ? "Gửi thông tin được yêu cầu sẽ chuyển bước tiếp theo cho người xử lý."
                      : "Cập nhật chỉ bổ sung ngữ cảnh, không thay đổi trạng thái hoặc bên thực hiện tiếp theo."}
              </Text>
              <Text size="sm" c="dimmed">
                Chỉ dùng nội dung hư cấu. Phần trao đổi dành cho người tham gia
                yêu cầu theo phạm vi được phép, không phải ghi chú riêng tư. Tên
                minh họa không xác nhận danh tính hoặc quyền truy cập.
              </Text>
              {item.status === "Waiting for retest" && (
                <Select
                  disabled={!mounted}
                  label="Kết quả kiểm tra lại"
                  allowDeselect={false}
                  data={Object.entries(retestResultLabels).map(
                    ([value, label]) => ({ value, label }),
                  )}
                  value={result}
                  onChange={(value) => {
                    if (
                      value === "Pass" ||
                      value === "Fail" ||
                      value === "Unable"
                    )
                      setResult(value);
                  }}
                />
              )}
              <Textarea
                disabled={!mounted}
                autoFocus={reopening}
                label={
                  item.status === "Resolved"
                    ? "Lý do mở lại"
                    : item.status === "Waiting for retest"
                      ? "Ghi chú kiểm tra lại"
                      : item.status === "Waiting for sender"
                        ? "Phản hồi của bạn"
                        : "Cập nhật của bạn"
                }
                required={
                  item.status !== "Waiting for retest" || result !== "Pass"
                }
                rows={3}
                value={text}
                onChange={(event) => {
                  setText(event.currentTarget.value);
                  setError("");
                }}
                error={error}
              />
              <Group>
                <Button type="submit" disabled={!mounted}>
                  {item.status === "Resolved"
                    ? "Mở lại"
                    : item.status === "Waiting for retest"
                      ? "Xác nhận kiểm tra lại"
                      : item.status === "Waiting for sender"
                        ? "Gửi phản hồi"
                        : "Thêm cập nhật"}
                </Button>
                {reopening && (
                  <Button
                    variant="default"
                    onClick={() => {
                      setReopening(false);
                      setError("");
                    }}
                  >
                    Hủy mở lại
                  </Button>
                )}
              </Group>
            </Stack>
          </form>
        )}
        {item.status === "Resolved" && (
          <Text size="sm" c="dimmed">
            Trao đổi chỉ đọc khi yêu cầu đã giải quyết. Cần mở lại rõ ràng trước
            khi tiếp tục xử lý. Hủy mở lại giữ lý do chưa gửi trong trang này.
          </Text>
        )}
        <SupportHandlerTriage item={item} onNotice={setNotice} />
        <Stack gap="md">
          <Title order={2} size="h3">
            Thông tin ban đầu
          </Title>
          <DetailsReadout rows={intakeReadoutRows(item)} />
          <div>
            <Text fw={600} size="sm">
              Minh chứng
            </Text>
            {item.attachments.length === 0 ? (
              <Text size="sm" c="dimmed">
                Không có tệp đính kèm
              </Text>
            ) : (
              item.attachments.map((file) => (
                <Text key={file.id} size="sm">
                  {file.name} · {file.sizeLabel} ·{" "}
                  {evidenceStatusLabels[file.status]}
                  {file.status !== "Ready" ? " · chưa thể tải xuống" : ""}
                  {file.error ? ` · ${file.error}` : ""}
                </Text>
              ))
            )}
          </div>
        </Stack>
        {item.status === "Resolved" && (
          <>
            <Divider />
            <Stack gap="sm">
              <Title order={2} size="h3">
                Đánh giá
              </Title>
              {item.csat === null ? (
                <Group>
                  {[1, 2, 3, 4, 5].map((score) => (
                    <Button
                      key={score}
                      variant="light"
                      disabled={!mounted}
                      onClick={() => {
                        respond(item.id, { kind: "csat", score });
                        setNotice(`Cảm ơn bạn. Đã lưu điểm ${score}.`);
                      }}
                    >
                      {score}
                    </Button>
                  ))}
                </Group>
              ) : (
                <Text size="sm">Bạn đã đánh giá {item.csat} trên 5 điểm.</Text>
              )}
            </Stack>
          </>
        )}
        <Divider />
        <Stack gap="sm">
          <Title order={2} size="h3">
            Kết quả chính thức
          </Title>
          {item.outcomes.length === 0 ? (
            <Text c="dimmed" size="sm">
              Chưa ghi nhận kết quả chính thức.
            </Text>
          ) : (
            item.outcomes.map((outcome, index) => (
              <Stack key={index} gap="sm">
                <Text fw={600}>
                  {outcome.superseded
                    ? "Kết quả trước đó · đã được thay thế khi mở lại"
                    : "Kết quả chính thức hiện tại"}
                </Text>
                <Text>{outcome.summary}</Text>
                <div>
                  <Text size="sm" fw={600}>
                    Công việc đã thực hiện
                  </Text>
                  <Text size="sm">{outcome.work}</Text>
                </div>
                <div>
                  <Text size="sm" fw={600}>
                    Giới hạn
                  </Text>
                  <Text size="sm">{outcome.limitations}</Text>
                </div>
              </Stack>
            ))
          )}
        </Stack>
        <Divider />
        <Stack gap="sm">
          <Group>
            <IconMessageCircle size={20} />
            <Title order={2} size="h3">
              Trao đổi
            </Title>
          </Group>
          {item.conversation.length === 0 ? (
            <Text c="dimmed">Chưa có phản hồi.</Text>
          ) : (
            item.conversation.map((message, index) => (
              <Stack key={index} gap="xs">
                <Divider />
                <Group gap="sm">
                  <Avatar
                    size="sm"
                    color={message.author === "Jo Lee" ? "blue" : "teal"}
                  >
                    {message.author
                      .split(" ")
                      .map((part) => part[0])
                      .join("")}
                  </Avatar>
                  <Text size="sm" fw={600}>
                    {message.author}
                  </Text>
                </Group>
                <Text
                  size="sm"
                  style={{
                    whiteSpace: "pre-wrap",
                    overflowWrap: "anywhere",
                  }}
                >
                  {message.text}
                </Text>
              </Stack>
            ))
          )}
        </Stack>
        <Divider />
        <Button
          component={Link}
          href={supportPath(item.applicationId)}
          variant="default"
          style={{ alignSelf: "flex-start" }}
        >
          Quay lại Hỗ trợ
        </Button>
      </Stack>
    </PageFrame>
  );
}
