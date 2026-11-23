import { MantineProvider } from "@mantine/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render as testingLibraryRender } from "@testing-library/react";
import type { ReactNode } from "react";

import {
  arcoCssVariablesResolver,
  arcoTheme,
} from "@/modules/ui/theme/arco-theme";

export function render(ui: ReactNode) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return testingLibraryRender(ui, {
    wrapper: ({ children }) => (
      <MantineProvider
        theme={arcoTheme}
        cssVariablesResolver={arcoCssVariablesResolver}
        defaultColorScheme="light"
      >
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </MantineProvider>
    ),
  });
}
