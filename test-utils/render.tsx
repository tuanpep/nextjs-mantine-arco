import { MantineProvider } from "@mantine/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NuqsTestingAdapter } from "nuqs/adapters/testing";
import { render as testingLibraryRender } from "@testing-library/react";
import type { ReactNode } from "react";

import { AuthProvider } from "@/modules/account/components/auth-provider";
import { cssVariablesResolver, theme } from "@/theme";

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
      <MantineProvider
        theme={theme}
        cssVariablesResolver={cssVariablesResolver}
        defaultColorScheme="light"
      >
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <NuqsTestingAdapter>{children}</NuqsTestingAdapter>
          </AuthProvider>
        </QueryClientProvider>
      </MantineProvider>
    ),
  });
}
