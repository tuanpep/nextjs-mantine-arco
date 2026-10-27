import "@mantine/core/styles.css";
import "@/pajamas.module.css";

import { ColorSchemeScript, mantineHtmlProps } from "@mantine/core";
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale } from "next-intl/server";
import { Suspense, type ReactNode } from "react";

import { fontClassName } from "@/lib/fonts";
import { AppProviders } from "./providers";

export const metadata: Metadata = {
  title: { default: "DX Support", template: "%s | DX Support" },
  description:
    "Project workspace for support, feedback, ideas, and UAT campaigns. Demo only.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <Suspense>
      <LocalizedDocument>{children}</LocalizedDocument>
    </Suspense>
  );
}

async function LocalizedDocument({ children }: { children: ReactNode }) {
  const locale = await getLocale();
  return (
    <html lang={locale} {...mantineHtmlProps} className={fontClassName}>
      <head>
        <ColorSchemeScript defaultColorScheme="light" />
      </head>
      <body>
        <NextIntlClientProvider>
          <AppProviders>{children}</AppProviders>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
