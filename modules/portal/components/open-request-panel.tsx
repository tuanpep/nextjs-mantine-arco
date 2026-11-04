"use client";

import { Button, Drawer } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useTranslations } from "next-intl";
import { useRef } from "react";

import {
  OpenRequestForm,
  type OpenRequestHandle,
  type ProjectOption,
} from "./open-request-form";

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
  const form = useRef<OpenRequestHandle>(null);
  const requestClose = () => {
    if (form.current && !form.current.canClose()) return;
    close();
  };

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
        onClose={requestClose}
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
            ref={form}
          />
        ) : null}
      </Drawer>
    </>
  );
}
