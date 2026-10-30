"use client";

import { Anchor, Stack, Text, Title } from "@mantine/core";
import Link from "next/link";

export type DestinationUnavailableProps = {
  title?: string;
  description?: string;
  backHref: string;
  backLabel: string;
};

export function DestinationUnavailable({
  title = "Không thể truy cập trang này",
  description = "Trang có thể không tồn tại hoặc bạn không có quyền truy cập.",
  backHref,
  backLabel,
}: DestinationUnavailableProps) {
  return (
    <Stack align="flex-start" py="xl">
      <Title order={1}>{title}</Title>
      <Text c="dimmed">{description}</Text>
      <Anchor component={Link} href={backHref}>
        {backLabel}
      </Anchor>
    </Stack>
  );
}
