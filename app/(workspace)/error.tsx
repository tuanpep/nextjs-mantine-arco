"use client";

import { Alert, Button, Stack } from "@mantine/core";
import Link from "next/link";

import {
  DEFAULT_PROJECT_ID,
  applicationPath,
} from "@/modules/projects/lib/applications";

export default function WorkspaceError({ reset }: { reset: () => void }) {
  return (
    <Stack align="flex-start">
      <Alert color="red" title="Không thể tải không gian làm việc">
        Không thể tải dữ liệu. Vui lòng thử lại.
      </Alert>
      <Button onClick={reset}>Thử lại</Button>
      <Button component={Link} href="/" variant="subtle">
        Về trang chủ
      </Button>
      <Button
        component={Link}
        href={applicationPath(DEFAULT_PROJECT_ID)}
        variant="subtle"
      >
        Về tổng quan
      </Button>
    </Stack>
  );
}
