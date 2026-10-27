import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod/v4";

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(["development", "test", "production"]),
  },
  client: {
    NEXT_PUBLIC_KEYCLOAK_URL: z.url(),
    NEXT_PUBLIC_KEYCLOAK_REALM: z.string().min(1),
    NEXT_PUBLIC_KEYCLOAK_CLIENT_ID: z.string().min(1),
    NEXT_PUBLIC_API_PREFIX: z.url(),
    NEXT_PUBLIC_STOMP_URL: z.string().min(1),
    NEXT_PUBLIC_PROFILE_URI: z.string().startsWith("/"),
    NEXT_PUBLIC_PERMISSION_URI: z.string().startsWith("/"),
    NEXT_PUBLIC_DISPLAY_CACHE_TIME: z.coerce.number().positive(),
    NEXT_PUBLIC_E2E_AUTH_BYPASS: z.enum(["0", "1"]).optional(),
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_KEYCLOAK_URL: process.env.NEXT_PUBLIC_KEYCLOAK_URL,
    NEXT_PUBLIC_KEYCLOAK_REALM: process.env.NEXT_PUBLIC_KEYCLOAK_REALM,
    NEXT_PUBLIC_KEYCLOAK_CLIENT_ID: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID,
    NEXT_PUBLIC_API_PREFIX: process.env.NEXT_PUBLIC_API_PREFIX,
    NEXT_PUBLIC_STOMP_URL: process.env.NEXT_PUBLIC_STOMP_URL,
    NEXT_PUBLIC_PROFILE_URI: process.env.NEXT_PUBLIC_PROFILE_URI,
    NEXT_PUBLIC_PERMISSION_URI: process.env.NEXT_PUBLIC_PERMISSION_URI,
    NEXT_PUBLIC_DISPLAY_CACHE_TIME: process.env.NEXT_PUBLIC_DISPLAY_CACHE_TIME,
    NEXT_PUBLIC_E2E_AUTH_BYPASS: process.env.NEXT_PUBLIC_E2E_AUTH_BYPASS,
  },
});

/** Playwright-only bypass. Never active in production builds. */
export function isE2eAuthBypass() {
  if (process.env.NODE_ENV === "production") return false;
  return env.NEXT_PUBLIC_E2E_AUTH_BYPASS === "1";
}
