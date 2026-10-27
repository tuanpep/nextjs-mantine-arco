import { Skeleton, Stack } from "@mantine/core";

export default function WorkspaceLoading() {
  return (
    <Stack role="status" aria-label="Loading workspace" gap="lg">
      <Skeleton height={28} width="35%" />
      <Skeleton height={20} width="65%" />
      <Skeleton height={180} />
    </Stack>
  );
}
