"use client";

import { useEffect, useRef, useState } from "react";
import { Button, FileInput, Group, Progress, Stack, Text } from "@mantine/core";

export interface UploadProps {
  label: string;
  onUpload: (
    file: File,
    options: { signal: AbortSignal; onProgress: (percent: number) => void },
  ) => Promise<void>;
  multiple?: boolean;
  accept?: string;
  disabled?: boolean;
  labels?: {
    cancel: string;
    retry: string;
    remove: string;
    progress: (name: string) => string;
    status: Record<UploadItem["status"], string>;
  };
}

type UploadItem = {
  id: number;
  file: File;
  status: "uploading" | "success" | "error" | "cancelled";
  progress: number;
};

/** Uploads only through the caller's onUpload implementation. Progress is a percentage. */
export function Upload({
  label,
  onUpload,
  multiple = false,
  accept,
  disabled,
  labels = {
    cancel: "Cancel",
    retry: "Retry",
    remove: "Remove",
    progress: (name) => `Upload progress for ${name}`,
    status: {
      uploading: "Uploading",
      success: "Complete",
      error: "Failed",
      cancelled: "Cancelled",
    },
  },
}: UploadProps) {
  const [items, setItems] = useState<UploadItem[]>([]);
  const nextId = useRef(0);
  const active = useRef(new Map<number, AbortController>());
  const resetPicker = useRef<() => void>(null);

  useEffect(() => {
    const controllers = active.current;
    return () => {
      controllers.forEach((controller) => controller.abort());
      controllers.clear();
    };
  }, []);

  function start(id: number, file: File) {
    const controller = new AbortController();
    active.current.set(id, controller);
    setItems((current) =>
      current.map((item) =>
        item.id === id ? { ...item, status: "uploading", progress: 0 } : item,
      ),
    );
    const update = (patch: Partial<UploadItem>) => {
      if (active.current.get(id) !== controller) return;
      setItems((current) =>
        current.map((item) => (item.id === id ? { ...item, ...patch } : item)),
      );
    };
    void Promise.resolve()
      .then(() => {
        if (controller.signal.aborted) return;
        return onUpload(file, {
          signal: controller.signal,
          onProgress: (percent) => {
            if (Number.isFinite(percent))
              update({ progress: Math.max(0, Math.min(100, percent)) });
          },
        });
      })
      .then(
        () => {
          update({ status: "success", progress: 100 });
        },
        () => {
          update({ status: "error" });
        },
      )
      .finally(() => {
        if (active.current.get(id) === controller) active.current.delete(id);
      });
  }

  function stop(id: number) {
    const controller = active.current.get(id);
    active.current.delete(id);
    controller?.abort();
  }

  return (
    <Stack gap="sm">
      <FileInput<boolean>
        label={label}
        placeholder={label}
        resetRef={resetPicker}
        fileInputProps={{ "aria-label": label }}
        multiple={multiple}
        value={multiple ? [] : null}
        accept={accept}
        disabled={disabled}
        onChange={(value) => {
          const files = Array.isArray(value) ? value : value ? [value] : [];
          resetPicker.current?.();
          const added: UploadItem[] = files.map((file) => ({
            id: nextId.current++,
            file,
            status: "uploading",
            progress: 0,
          }));
          setItems((current) => [...current, ...added]);
          added.forEach(({ id, file }) => start(id, file));
        }}
      />
      {items.map((item) => (
        <Stack key={item.id} gap="xs">
          <Group justify="space-between">
            <Text>
              {item.file.name} — {labels.status[item.status]}
            </Text>
            <Group gap="xs">
              {item.status === "uploading" && (
                <Button
                  size="xs"
                  variant="subtle"
                  aria-label={`${labels.cancel}: ${item.file.name}`}
                  onClick={() => {
                    stop(item.id);
                    setItems((current) =>
                      current.map((entry) =>
                        entry.id === item.id
                          ? { ...entry, status: "cancelled" }
                          : entry,
                      ),
                    );
                  }}
                >
                  {labels.cancel}
                </Button>
              )}
              {(item.status === "error" || item.status === "cancelled") && (
                <Button
                  size="xs"
                  variant="subtle"
                  disabled={disabled}
                  aria-label={`${labels.retry}: ${item.file.name}`}
                  onClick={() => start(item.id, item.file)}
                >
                  {labels.retry}
                </Button>
              )}
              <Button
                size="xs"
                variant="subtle"
                aria-label={`${labels.remove}: ${item.file.name}`}
                onClick={() => {
                  stop(item.id);
                  setItems((current) =>
                    current.filter((entry) => entry.id !== item.id),
                  );
                }}
              >
                {labels.remove}
              </Button>
            </Group>
          </Group>
          <Progress
            value={item.progress}
            aria-label={labels.progress(item.file.name)}
          />
        </Stack>
      ))}
    </Stack>
  );
}
