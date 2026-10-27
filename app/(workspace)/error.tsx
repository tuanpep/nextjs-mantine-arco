"use client";

import { Alert, Button, Stack } from "@mantine/core";
import Link from "next/link";

export default function WorkspaceError({ reset }: { reset: () => void }) {
  return (
    <Stack align="flex-start">
      <Alert color="red" title="The workspace could not be loaded">
        This is a loading failure, not an empty collection. Try loading this
        view again.
      </Alert>
      <Button onClick={reset}>Try again</Button>
      <Button component={Link} href="/projects" variant="subtle">
        Back to Projects
      </Button>
    </Stack>
  );
}
