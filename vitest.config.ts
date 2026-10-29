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
      NEXT_PUBLIC_KEYCLOAK_URL: "https://auth.example.com",
      NEXT_PUBLIC_KEYCLOAK_REALM: "test-realm",
      NEXT_PUBLIC_KEYCLOAK_CLIENT_ID: "test-client",
      NEXT_PUBLIC_API_PREFIX: "https://api.example.com/api",
      NEXT_PUBLIC_STOMP_URL: "wss://api.example.com/api/socket",
      NEXT_PUBLIC_PROFILE_URI: "/kernel/v1/users/current",
      NEXT_PUBLIC_PERMISSION_URI: "/kernel/authz",
      NEXT_PUBLIC_DISPLAY_CACHE_TIME: "300000",
      NEXT_PUBLIC_E2E_AUTH_BYPASS: "1",
    },
  },
});
