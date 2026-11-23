"use client";

import { Box } from "@mantine/core";
import { useRef, useState, type ReactNode } from "react";

/** Horizontally resizable region; sizes and step are in pixels. */
export function ResizeBox({
  children,
  label,
  defaultSize = 300,
  minSize = 100,
  maxSize = 800,
  step = 10,
  onResize,
}: {
  children: ReactNode;
  label: string;
  defaultSize?: number;
  minSize?: number;
  maxSize?: number;
  step?: number;
  onResize?: (size: number) => void;
}) {
  const min = Number.isFinite(minSize) ? Math.max(0, minSize) : 100;
  const max = Number.isFinite(maxSize)
    ? Math.max(min, maxSize)
    : Math.max(min, 800);
  const increment = Number.isFinite(step) && step > 0 ? step : 10;
  const clamp = (value: number) => Math.min(max, Math.max(min, value));
  const [size, setSize] = useState(() =>
    clamp(Number.isFinite(defaultSize) ? defaultSize : min),
  );
  const currentSize = clamp(size);
  const drag = useRef<{ pointerId: number; x: number; size: number } | null>(
    null,
  );

  function resize(value: number) {
    const next = clamp(value);
    setSize(next);
    onResize?.(next);
  }

  return (
    <Box style={{ display: "flex", width: currentSize, maxWidth: "100%" }}>
      <Box style={{ flex: 1, minWidth: 0 }}>{children}</Box>
      <Box
        role="separator"
        aria-label={label}
        aria-orientation="vertical"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={currentSize}
        tabIndex={0}
        style={{
          width: 12,
          flexShrink: 0,
          cursor: "col-resize",
          touchAction: "none",
          background: "var(--mantine-color-default-border)",
        }}
        onKeyDown={(event) => {
          let next: number;
          switch (event.key) {
            case "ArrowLeft":
              next = currentSize - increment;
              break;
            case "ArrowRight":
              next = currentSize + increment;
              break;
            case "Home":
              next = min;
              break;
            case "End":
              next = max;
              break;
            default:
              return;
          }
          event.preventDefault();
          resize(next);
        }}
        onPointerDown={(event) => {
          if (event.button !== 0) return;
          event.currentTarget.setPointerCapture(event.pointerId);
          drag.current = {
            pointerId: event.pointerId,
            x: event.clientX,
            size: currentSize,
          };
        }}
        onPointerMove={(event) => {
          if (drag.current?.pointerId === event.pointerId) {
            resize(drag.current.size + event.clientX - drag.current.x);
          }
        }}
        onPointerUp={(event) => {
          if (drag.current?.pointerId === event.pointerId) drag.current = null;
        }}
        onPointerCancel={() => {
          drag.current = null;
        }}
        onLostPointerCapture={() => {
          drag.current = null;
        }}
      />
    </Box>
  );
}
