"use client";

import { MantineProvider } from "@mantine/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import NextTopLoader from "nextjs-toploader";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import type { ReactNode } from "react";

import { cssVariablesResolver, theme } from "@/theme";

let browserQueryClient: QueryClient | undefined;

function getQueryClient() {
  if (typeof window === "undefined") {
    return new QueryClient();
  }

  browserQueryClient ??= new QueryClient();
  return browserQueryClient;
}

export function AppProviders({ children }: { children: ReactNode }) {
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
      <QueryClientProvider client={getQueryClient()}>
        <NuqsAdapter>{children}</NuqsAdapter>
      </QueryClientProvider>
    </MantineProvider>
  );
}
