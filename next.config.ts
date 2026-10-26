import bundleAnalyzer from "@next/bundle-analyzer";
import type { NextConfig } from "next";

import "./app/env";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  experimental: {
    optimizePackageImports: [
      "@mantine/core",
      "@mantine/form",
      "@mantine/hooks",
      "@tanstack/react-query",
    ],
  },
};

export default withBundleAnalyzer(nextConfig);
