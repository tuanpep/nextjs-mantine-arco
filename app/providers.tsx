"use client";

import { MantineProvider } from "@mantine/core";
import { QueryClientProvider } from "@tanstack/react-query";
import NextTopLoader from "nextjs-toploader";
import type { ReactNode } from "react";

import { getQueryClient } from "@/lib/query/get-query-client";
import { cssVariablesResolver, theme } from "@/theme";

export function AppProviders({ children }: { children: ReactNode }) {
  const queryClient = getQueryClient();

  return (
    <MantineProvider
      theme={theme}
      cssVariablesResolver={cssVariablesResolver}
      defaultColorScheme="light"
    >
      <NextTopLoader
        color="var(--gl-loader-color)"
        height={2}
        shadow={false}
        showSpinner={false}
        showForHashAnchor={false}
      />
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </MantineProvider>
  );
}
