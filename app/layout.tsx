import "@mantine/core/styles.css";

import {
  ColorSchemeScript,
  MantineProvider,
  mantineHtmlProps,
} from "@mantine/core";
import type { Metadata } from "next";

import { theme } from "@/theme";
import { AppProviders } from "./providers";

export const metadata: Metadata = {
  title: "Next.js FE",
  description: "Next.js frontend template",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript defaultColorScheme="light" />
      </head>
      <body>
        <MantineProvider theme={theme} defaultColorScheme="light">
          <AppProviders>{children}</AppProviders>
        </MantineProvider>
      </body>
    </html>
  );
}
