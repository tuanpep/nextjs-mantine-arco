import { describe, expect, it } from "vitest";

import {
  SILENT_CHECK_SSO_PATH,
  keycloakInitOptions,
  sameOriginRedirectUri,
  silentCheckSsoRedirectUri,
} from "./keycloak";

describe("keycloakInitOptions", () => {
  it("uses silent check-sso with PKCE instead of a full login redirect on load", () => {
    expect(keycloakInitOptions.onLoad).toBe("check-sso");
    expect(keycloakInitOptions.pkceMethod).toBe("S256");
    expect(keycloakInitOptions.checkLoginIframe).toBe(false);
    expect(keycloakInitOptions.silentCheckSsoFallback).toBe(true);
    expect(keycloakInitOptions.useNonce).toBe(true);
  });
});

describe("silentCheckSsoRedirectUri", () => {
  it("points at the static silent-check page on this origin", () => {
    expect(silentCheckSsoRedirectUri()).toBe(
      `${window.location.origin}${SILENT_CHECK_SSO_PATH}`,
    );
  });
});

describe("sameOriginRedirectUri", () => {
  it("keeps same-origin redirect targets", () => {
    expect(
      sameOriginRedirectUri(
        `${window.location.origin}/projects/beacon-portal/support`,
        () => window.location.origin,
      ),
    ).toBe(`${window.location.origin}/projects/beacon-portal/support`);
  });

  it("falls back when the candidate is a different origin", () => {
    expect(
      sameOriginRedirectUri("https://evil.example/phish", () =>
        window.location.origin,
      ),
    ).toBe(window.location.origin);
  });
});
