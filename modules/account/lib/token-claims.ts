import type { CurrentUser } from "./session";

export type KeycloakTokenClaims = {
  sub?: string;
  preferred_username?: string;
  name?: string;
  email?: string;
  locale?: string;
  zoneinfo?: string;
};

/** Build a minimal CurrentUser from Keycloak ID/access token claims when profile API fails. */
export function userFromTokenClaims(
  claims: KeycloakTokenClaims | undefined,
  subject?: string | null,
): CurrentUser {
  const userName = claims?.preferred_username?.trim() ?? "";
  const displayName =
    claims?.name?.trim() || userName || claims?.email?.trim() || "Signed-in user";

  return {
    id: subject?.trim() || claims?.sub?.trim() || "unknown",
    userName,
    displayName,
    email: claims?.email?.trim() ?? "",
    locale: claims?.locale?.trim() || null,
    timezone: claims?.zoneinfo?.trim() || null,
    preferences: {},
  };
}
