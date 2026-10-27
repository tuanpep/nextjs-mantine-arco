"use client";

import { Box, Button, Drawer, Group, Stack } from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import type { ReactNode } from "react";

/** Matches Mantine `lg` / Pajamas nav breakpoint (~1200px). */
const NARROW_QUERY = "(max-width: 74.99em)";
const SMALLEST_QUERY = "(max-width: 47.99em)";

export type PageFrameProps = {
  header?: ReactNode;
  children: ReactNode;
  pane?: ReactNode;
  paneLabel?: string;
  panePosition?: "start" | "end";
  /** stack: pane below on narrow. sheet: Details drawer on narrow. index: parent–detail. */
  paneNarrow?: "stack" | "sheet" | "index";
  /** For index mode: detail is open on narrow viewports. */
  paneIndexOpen?: boolean;
  fullBleed?: boolean;
  footer?: ReactNode;
};

export function PageFrame({
  header,
  children,
  pane,
  paneLabel = "Details",
  panePosition = "end",
  paneNarrow = "stack",
  paneIndexOpen = false,
  fullBleed = false,
  footer,
}: PageFrameProps) {
  const [sheetOpened, { open: openSheet, close: closeSheet }] =
    useDisclosure(false);
  const isNarrow = useMediaQuery(NARROW_QUERY, false, {
    getInitialValueInEffect: true,
  });
  const isSmallest = useMediaQuery(SMALLEST_QUERY, false, {
    getInitialValueInEffect: true,
  });
  const hasPane = Boolean(pane);

  if (!hasPane) {
    return (
      <Box
        px={fullBleed ? undefined : { base: "md", sm: "xl" }}
        py={fullBleed ? undefined : "lg"}
        maw={fullBleed ? undefined : 1280}
        mx={fullBleed ? undefined : "auto"}
        style={{ minWidth: 0 }}
      >
        {header}
        {children}
        {footer}
      </Box>
    );
  }

  if (paneNarrow === "index") {
    const showIndexOnly = Boolean(isNarrow && !paneIndexOpen);
    const showDetailOnly = Boolean(isNarrow && paneIndexOpen);

    return (
      <Box style={{ minWidth: 0 }}>
        <Group align="flex-start" gap={0} wrap="nowrap" style={{ minWidth: 0 }}>
          {(!showDetailOnly || !isNarrow) && (
            <Box
              component="aside"
              aria-label={paneLabel}
              w={showIndexOnly ? "100%" : { base: "100%", sm: 260 }}
              px={{ base: "md", sm: "md" }}
              py="lg"
              style={{
                flexShrink: 0,
                borderInlineEnd: showIndexOnly
                  ? undefined
                  : "1px solid var(--mantine-color-default-border)",
                alignSelf: "stretch",
                position: isNarrow ? "static" : "sticky",
                top: 0,
                maxHeight: isNarrow ? undefined : "calc(100vh - 48px)",
                overflowY: "auto",
                display: showDetailOnly ? "none" : undefined,
              }}
            >
              {showIndexOnly ? header : null}
              {pane}
            </Box>
          )}
          {!showIndexOnly && (
            <Box
              style={{ flex: 1, minWidth: 0 }}
              px={{ base: "md", sm: "xl" }}
              py="lg"
              maw={960}
            >
              {header}
              {children}
            </Box>
          )}
        </Group>
        {footer}
      </Box>
    );
  }

  const contentColumn = (
    <Box style={{ flex: 1, minWidth: 0 }}>
      {header}
      {paneNarrow === "sheet" && isNarrow ? (
        <Group mb="md">
          <Button variant="default" size="compact-sm" onClick={openSheet}>
            {paneLabel}
          </Button>
        </Group>
      ) : null}
      {children}
      {paneNarrow === "stack" && isNarrow ? (
        <Box component="aside" aria-label={paneLabel} mt="md">
          {pane}
        </Box>
      ) : null}
    </Box>
  );

  const sidePane = !isNarrow ? (
    <Box
      component="aside"
      aria-label={paneLabel}
      w={280}
      maw={320}
      style={{
        flexShrink: 0,
        alignSelf: "flex-start",
        position: "sticky",
        top: 16,
      }}
    >
      {pane}
    </Box>
  ) : null;

  return (
    <Box
      px={{ base: "md", sm: "xl" }}
      py="lg"
      maw={fullBleed ? undefined : 1280}
      mx={fullBleed ? undefined : "auto"}
      style={{ minWidth: 0 }}
    >
      {isNarrow ? (
        <Stack gap={0}>{contentColumn}</Stack>
      ) : (
        <Group
          align="flex-start"
          gap="xl"
          wrap="nowrap"
          style={{ minWidth: 0 }}
        >
          {panePosition === "start" ? sidePane : null}
          {contentColumn}
          {panePosition === "end" ? sidePane : null}
        </Group>
      )}
      {paneNarrow === "sheet" ? (
        <Drawer
          opened={sheetOpened}
          onClose={closeSheet}
          position="right"
          title={paneLabel}
          size={isSmallest ? "100%" : 400}
        >
          {pane}
        </Drawer>
      ) : null}
      {footer}
    </Box>
  );
}
