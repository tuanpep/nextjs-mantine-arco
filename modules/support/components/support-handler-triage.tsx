"use client";

import {
  Alert,
  Button,
  Card,
  Checkbox,
  Group,
  Select,
  Stack,
  Textarea,
  TextInput,
  Title,
} from "@mantine/core";
import { useMounted } from "@mantine/hooks";
import { useState } from "react";

import {
  triageDispositionLabels,
  triageDispositions,
  type SupportRequest,
  type TriageDisposition,
} from "../lib/fixtures";
import {
  misrouteTargetLabels,
  misrouteTargets,
  type MisrouteTarget,
} from "../lib/intake-fields";
import { useSupport } from "./support-provider";

export function SupportHandlerTriage({
  item,
  onNotice,
}: {
  item: SupportRequest;
  onNotice: (message: string) => void;
}) {
  const mounted = useMounted();
  const { handle } = useSupport();
  const [disposition, setDisposition] =
    useState<TriageDisposition>("needs-info");
  const [note, setNote] = useState("");
  const [relatedId, setRelatedId] = useState("");
  const [engId, setEngId] = useState(item.engTrackerId ?? "");
  const [misrouteTarget, setMisrouteTarget] =
    useState<MisrouteTarget>("feedback");
  const [keepOpen, setKeepOpen] = useState(true);
  const [error, setError] = useState("");

  if (item.status === "Resolved") return null;

  function applyTriage() {
    setError("");
    try {
      switch (disposition) {
        case "needs-info":
          handle(item.id, { kind: "needs-info", text: note });
          onNotice(
            "Đã đánh dấu cần thêm thông tin. Người gửi sẽ thực hiện bước tiếp theo.",
          );
          break;
        case "duplicate":
          handle(item.id, {
            kind: "duplicate",
            relatedRequestId: relatedId,
            text: note,
          });
          onNotice(
            `Đã đánh dấu trùng với ${relatedId.trim().toUpperCase()} và giải quyết.`,
          );
          break;
        case "linked-eng":
          handle(item.id, {
            kind: "link-eng",
            engTrackerId: engId,
            text: note,
          });
          onNotice(
            `Đã liên kết ${engId.trim()}. Tạm dừng tự động đóng trong khi theo dõi công việc kỹ thuật.`,
          );
          break;
        case "workaround":
          handle(item.id, {
            kind: "workaround",
            text: note,
            keepOpen,
          });
          onNotice(
            keepOpen
              ? "Đã chia sẻ giải pháp tạm thời. Chờ người gửi phản hồi."
              : "Đã giải quyết bằng giải pháp tạm thời.",
          );
          break;
        case "misroute":
          handle(item.id, {
            kind: "misroute",
            target: misrouteTarget,
            text: note,
          });
          onNotice(
            `Đã chuyển đến ${misrouteTargetLabels[misrouteTarget]} và đóng yêu cầu hỗ trợ này.`,
          );
          break;
        default: {
          const _exhaustive: never = disposition;
          return _exhaustive;
        }
      }
      setNote("");
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Không thể áp dụng phân loại.",
      );
    }
  }

  return (
    <Card withBorder p="md">
      <Stack gap="sm">
        <Title order={2} size="h3">
          Phân loại xử lý
        </Title>
        {!item.handler && (
          <Alert color="blue">
            Áp dụng phân loại sẽ phân công người vận hành DX thử nghiệm trước.
          </Alert>
        )}
        <Select
          disabled={!mounted}
          label="Hướng xử lý"
          allowDeselect={false}
          data={triageDispositions.map((value) => ({
            value,
            label: triageDispositionLabels[value],
          }))}
          value={disposition}
          onChange={(value) => {
            if (
              value === "needs-info" ||
              value === "duplicate" ||
              value === "linked-eng" ||
              value === "workaround" ||
              value === "misroute"
            ) {
              setDisposition(value);
              setError("");
            }
          }}
        />
        {disposition === "duplicate" && (
          <TextInput
            disabled={!mounted}
            label="Mã yêu cầu liên quan"
            placeholder="SUP116"
            value={relatedId}
            onChange={(event) => setRelatedId(event.currentTarget.value)}
          />
        )}
        {disposition === "linked-eng" && (
          <TextInput
            disabled={!mounted}
            label="Mã công việc kỹ thuật"
            placeholder="DEMO-4821"
            value={engId}
            onChange={(event) => setEngId(event.currentTarget.value)}
          />
        )}
        {disposition === "misroute" && (
          <Select
            disabled={!mounted}
            label="Chuyển người gửi đến"
            allowDeselect={false}
            data={misrouteTargets.map((value) => ({
              value,
              label: misrouteTargetLabels[value],
            }))}
            value={misrouteTarget}
            onChange={(value) => {
              if (
                value === "feedback" ||
                value === "ideas" ||
                value === "uat"
              ) {
                setMisrouteTarget(value);
              }
            }}
          />
        )}
        {disposition === "workaround" && (
          <Checkbox
            disabled={!mounted}
            label="Giữ yêu cầu mở và chờ người gửi"
            checked={keepOpen}
            onChange={(event) => setKeepOpen(event.currentTarget.checked)}
          />
        )}
        <Textarea
          disabled={!mounted}
          label={
            disposition === "needs-info"
              ? "Bạn còn cần thông tin gì từ người gửi?"
              : disposition === "workaround"
                ? "Hướng dẫn giải pháp tạm thời"
                : "Ghi chú trao đổi"
          }
          required
          rows={3}
          value={note}
          error={error}
          onChange={(event) => {
            setNote(event.currentTarget.value);
            setError("");
          }}
        />
        <Group>
          <Button disabled={!mounted} onClick={applyTriage}>
            Áp dụng
          </Button>
        </Group>
      </Stack>
    </Card>
  );
}
