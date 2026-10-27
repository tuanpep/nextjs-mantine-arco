import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    exclude: ["e2e/**", "node_modules/**"],
    env: {
      NEXT_PUBLIC_KEYCLOAK_URL: "https://auth.cmctelecom.vn",
      NEXT_PUBLIC_KEYCLOAK_REALM: "rnd2-dev",
      NEXT_PUBLIC_KEYCLOAK_CLIENT_ID: "xspace",
      NEXT_PUBLIC_API_PREFIX: "https://xspace-dev.cmctelecom.vn/api",
      NEXT_PUBLIC_STOMP_URL: "wss://xspace-dev.cmctelecom.vn/api/socket",
      NEXT_PUBLIC_PROFILE_URI: "/kernel/v1/users/current",
      NEXT_PUBLIC_PERMISSION_URI: "/kernel/authz",
      NEXT_PUBLIC_DISPLAY_CACHE_TIME: "300000",
      NEXT_PUBLIC_E2E_AUTH_BYPASS: "1",
    },
  },
});
