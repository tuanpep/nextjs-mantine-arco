import "@mantine/core/styles.css";
import "@/pajamas.module.css";

import { ColorSchemeScript, mantineHtmlProps } from "@mantine/core";
import type { Metadata } from "next";

import { fontClassName } from "@/lib/fonts";
import { AppProviders } from "./providers";

export const metadata: Metadata = {
  title: "Next.js FE",
  description: "Next.js frontend template",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" {...mantineHtmlProps} className={fontClassName}>
      <head>
        <ColorSchemeScript defaultColorScheme="light" />
      </head>
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
