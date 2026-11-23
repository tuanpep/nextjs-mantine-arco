"use client";

import { MantineProvider } from "@mantine/core";
import { QueryClientProvider } from "@tanstack/react-query";
import NextTopLoader from "nextjs-toploader";
import type { ReactNode } from "react";

import { getQueryClient } from "@/lib/query/get-query-client";
import {
  arcoCssVariablesResolver,
  arcoTheme,
} from "@/modules/ui/theme/arco-theme";

export function AppProviders({ children }: { children: ReactNode }) {
  const queryClient = getQueryClient();

  return (
    <MantineProvider
      theme={arcoTheme}
      cssVariablesResolver={arcoCssVariablesResolver}
      defaultColorScheme="light"
    >
      <NextTopLoader
        color="var(--mantine-primary-color-filled)"
        height={2}
        shadow={false}
        showSpinner={false}
        showForHashAnchor={false}
      />
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </MantineProvider>
  );
}
