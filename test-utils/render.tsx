import { MantineProvider } from "@mantine/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NuqsTestingAdapter } from "nuqs/adapters/testing";
import { render as testingLibraryRender } from "@testing-library/react";
import type { ReactNode } from "react";

import { theme } from "@/theme";

export function render(ui: ReactNode) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return testingLibraryRender(ui, {
    wrapper: ({ children }) => (
      <MantineProvider theme={theme} defaultColorScheme="light">
        <QueryClientProvider client={queryClient}>
          <NuqsTestingAdapter>{children}</NuqsTestingAdapter>
        </QueryClientProvider>
      </MantineProvider>
    ),
  });
}
