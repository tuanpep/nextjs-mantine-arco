"use client";

import { Button, FileButton, Group, Paper, Stack, Text } from "@mantine/core";
import { useTranslations } from "next-intl";
import { useRef, useState, type ReactNode } from "react";

import {
  bugAttachmentLimit,
  bugFileKind,
  formatFileSize,
  stageBugFiles,
  type BugAttachmentError,
  type BugUploadFile,
} from "../lib/attachments";

import { BugFileRow } from "./bug-file-list";

export type { BugUploadFile };

const bugFileAccept = "image/png,image/jpeg,application/pdf";

export function BugUpload({
  files,
  error,
  readOnly = false,
  onChange,
}: {
  files: BugUploadFile[];
  error?: ReactNode;
  readOnly?: boolean;
  onChange?: (files: BugUploadFile[], error: BugAttachmentError | null) => void;
}) {
  const t = useTranslations("Bugs");
  const resetRef = useRef<() => void>(null);
  const [over, setOver] = useState(false);
  const full = files.length >= bugAttachmentLimit;

  function addFiles(incoming: File[]) {
    const next = stageBugFiles(files, incoming);
    onChange?.(next.files, next.error);
    resetRef.current?.();
  }

  function removeFile(index: number) {
    const removed = files[index];
    if (removed?.previewUrl) URL.revokeObjectURL(removed.previewUrl);
    onChange?.(
      files.filter((_, item) => item !== index),
      null,
    );
  }

  return (
    <Stack gap="xs">
      <Text size="sm" fw={600}>
        {t("attachments")}
      </Text>
      {readOnly ? null : (
        <Paper
          withBorder
          radius="md"
          px="sm"
          py="xs"
          onDragEnter={(event) => {
            event.preventDefault();
            setOver(true);
          }}
          onDragOver={(event) => {
            event.preventDefault();
            setOver(true);
          }}
          onDragLeave={(event) => {
            if (event.currentTarget.contains(event.relatedTarget as Node))
              return;
            setOver(false);
          }}
          onDrop={(event) => {
            event.preventDefault();
            setOver(false);
            addFiles([...event.dataTransfer.files]);
          }}
          style={{
            borderStyle: "dashed",
            borderColor: over
              ? "var(--mantine-primary-color-filled)"
              : undefined,
          }}
        >
          <Group justify="space-between" gap="sm">
            <Stack gap={0} style={{ minWidth: 0 }}>
              <Text size="sm">{t("attachmentDrop")}</Text>
              <Text size="xs" c="dimmed">
                {t("attachmentHint")}
              </Text>
            </Stack>
            <FileButton
              multiple
              accept={bugFileAccept}
              resetRef={resetRef}
              disabled={full}
              onChange={addFiles}
            >
              {(props) => (
                <Button
                  {...props}
                  type="button"
                  variant="default"
                  size="compact-sm"
                  disabled={full}
                >
                  {t("attachmentAdd")}
                </Button>
              )}
            </FileButton>
          </Group>
        </Paper>
      )}
      {error ? (
        <Text size="sm" c="var(--mantine-color-error)">
          {error}
        </Text>
      ) : null}
      {files.map((item, index) => (
        <BugFileRow
          key={`${item.file.name}-${item.file.size}-${item.file.lastModified}-${index}`}
          name={item.file.name}
          sizeLabel={formatFileSize(item.file.size)}
          kind={bugFileKind(item.file.name)}
          previewUrl={item.previewUrl}
          previewLabel={t("attachmentPreview", { name: item.file.name })}
          onRemove={
            readOnly
              ? undefined
              : () => {
                  removeFile(index);
                }
          }
          removeLabel={t("attachmentRemove", { name: item.file.name })}
        />
      ))}
    </Stack>
  );
}
