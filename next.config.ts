import bundleAnalyzer from "@next/bundle-analyzer";
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

import "./app/env";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});
const withNextIntl = createNextIntlPlugin("./lib/i18n/request.ts");

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  experimental: {
    optimizePackageImports: [
      "@mantine/core",
      "@mantine/form",
      "@mantine/hooks",
      "@tabler/icons-react",
      "@tanstack/react-query",
    ],
  },
};

export default withBundleAnalyzer(withNextIntl(nextConfig));
