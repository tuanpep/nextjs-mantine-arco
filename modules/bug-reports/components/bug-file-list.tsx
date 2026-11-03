"use client";

import {
  ActionIcon,
  Group,
  Image,
  Modal,
  Paper,
  Stack,
  Text,
  ThemeIcon,
  UnstyledButton,
} from "@mantine/core";
import {
  IconFile,
  IconFileTypePdf,
  IconPhoto,
  IconX,
} from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { useTranslations } from "next-intl";

import { bugFileKind, type BugFileKind } from "../lib/attachments";

export function BugFileList({
  label,
  files,
}: {
  label: string;
  files: { name: string; sizeLabel: string; previewUrl?: string }[];
}) {
  const t = useTranslations("Bugs");
  if (files.length === 0) return null;
  return (
    <Stack gap="xs">
      <Text size="sm" fw={600}>
        {label}
      </Text>
      {files.map((file) => (
        <BugFileRow
          key={`${file.name}-${file.sizeLabel}`}
          name={file.name}
          sizeLabel={file.sizeLabel}
          kind={bugFileKind(file.name)}
          previewUrl={file.previewUrl}
          previewLabel={t("attachmentPreview", { name: file.name })}
        />
      ))}
    </Stack>
  );
}

export function BugFileRow({
  name,
  sizeLabel,
  kind,
  previewUrl,
  previewLabel,
  onRemove,
  removeLabel,
}: {
  name: string;
  sizeLabel: string;
  kind: BugFileKind | null;
  previewUrl?: string;
  previewLabel?: string;
  onRemove?: () => void;
  removeLabel?: string;
}) {
  return (
    <Paper withBorder radius="md" p="xs">
      <Group wrap="nowrap" justify="space-between" gap="sm">
        <Group wrap="nowrap" gap="sm" style={{ minWidth: 0 }}>
          <FileMark
            kind={kind}
            previewUrl={previewUrl}
            previewLabel={previewLabel}
            name={name}
          />
          <Stack gap={0} style={{ minWidth: 0 }}>
            <Text size="sm" truncate>
              {name}
            </Text>
            <Text size="xs" c="dimmed">
              {sizeLabel}
            </Text>
          </Stack>
        </Group>
        {onRemove ? (
          <ActionIcon
            variant="subtle"
            aria-label={removeLabel}
            onClick={onRemove}
          >
            <IconX size={16} />
          </ActionIcon>
        ) : null}
      </Group>
    </Paper>
  );
}

function FileMark({
  kind,
  previewUrl,
  previewLabel,
  name,
}: {
  kind: BugFileKind | null;
  previewUrl?: string;
  previewLabel?: string;
  name: string;
}) {
  const [opened, { open, close }] = useDisclosure(false);
  if (!previewUrl) {
    return (
      <ThemeIcon variant="light" size="lg">
        {fileIcon(kind)}
      </ThemeIcon>
    );
  }
  return (
    <>
      <UnstyledButton type="button" aria-label={previewLabel} onClick={open}>
        <Image src={previewUrl} w={40} h={40} radius="sm" fit="cover" alt="" />
      </UnstyledButton>
      <Modal opened={opened} onClose={close} title={name} size="lg">
        <Image src={previewUrl} alt={name} />
      </Modal>
    </>
  );
}

function fileIcon(kind: BugFileKind | null) {
  switch (kind) {
    case "image":
      return <IconPhoto size={18} />;
    case "pdf":
      return <IconFileTypePdf size={18} />;
    case null:
      return <IconFile size={18} />;
    default: {
      const neverKind: never = kind;
      return neverKind;
    }
  }
}
