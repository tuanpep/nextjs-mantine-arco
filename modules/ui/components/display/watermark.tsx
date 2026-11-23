import { Box } from "@mantine/core";
import type { ReactNode } from "react";

export function Watermark({
  text,
  children,
}: {
  text: string;
  children: ReactNode;
}) {
  const tile = text.replace(/[<>&"']/g, (char) => `&#${char.charCodeAt(0)};`);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="110"><text x="100" y="55" text-anchor="middle" transform="rotate(-22 100 55)" font-family="sans-serif" font-size="16" fill="gray">${tile}</text></svg>`;

  return (
    <Box pos="relative">
      {children}
      <Box
        aria-hidden
        pos="absolute"
        inset={0}
        style={{
          pointerEvents: "none",
          opacity: 0.22,
          backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(svg)}")`,
        }}
      />
    </Box>
  );
}
