"use client";

import { Button, Drawer } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useTranslations } from "next-intl";

import { OpenRequestForm, type ProjectOption } from "./open-request-form";

export function OpenRequestControl({
  projectId,
  projectOptions,
  fullWidth = false,
}: {
  projectId: string | null;
  projectOptions: ProjectOption[];
  fullWidth?: boolean;
}) {
  const portal = useTranslations("Portal");
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Button
        type="button"
        variant="default"
        fullWidth={fullWidth}
        onClick={open}
      >
        {portal("openRequest")}
      </Button>
      <Drawer
        opened={opened}
        onClose={close}
        position="left"
        title={portal("openRequest")}
        size={400}
        closeButtonProps={{ "aria-label": portal("close") }}
      >
        {opened ? (
          <OpenRequestForm
            key={projectId ?? "home"}
            defaultProjectId={projectId ?? ""}
            projectOptions={projectOptions}
            onClose={close}
          />
        ) : null}
      </Drawer>
    </>
  );
}
