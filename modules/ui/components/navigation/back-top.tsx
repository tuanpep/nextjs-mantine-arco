"use client";

import { ActionIcon, Affix } from "@mantine/core";
import { useReducedMotion, useWindowScroll } from "@mantine/hooks";
import { IconArrowUp } from "@tabler/icons-react";

type BackTopProps = {
  label: string;
  threshold?: number;
  focusTargetId?: string;
};

export function BackTop({
  label,
  threshold = 400,
  focusTargetId,
}: BackTopProps) {
  const [{ y }] = useWindowScroll();
  const reducedMotion = useReducedMotion();
  if (y < threshold) return null;

  return (
    <Affix position={{ bottom: 24, right: 24 }}>
      <ActionIcon
        size="lg"
        aria-label={label}
        onClick={() => {
          if (focusTargetId)
            document
              .getElementById(focusTargetId)
              ?.focus({ preventScroll: true });
          window.scrollTo({
            top: 0,
            behavior: reducedMotion ? "instant" : "smooth",
          });
        }}
      >
        <IconArrowUp size={18} aria-hidden />
      </ActionIcon>
    </Affix>
  );
}
