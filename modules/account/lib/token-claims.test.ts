import { describe, expect, it } from "vitest";

import { userFromTokenClaims } from "./token-claims";

describe("userFromTokenClaims", () => {
  it("maps Keycloak token claims into a CurrentUser fallback", () => {
    expect(
      userFromTokenClaims(
        {
          sub: "sub-1",
          preferred_username: "jo.lee",
          name: "Jo Lee",
          email: "jo.lee@example.com",
          locale: "vi",
          zoneinfo: "Asia/Ho_Chi_Minh",
        },
        "subject-1",
      ),
    ).toMatchObject({
      id: "subject-1",
      userName: "jo.lee",
      displayName: "Jo Lee",
      email: "jo.lee@example.com",
      locale: "vi",
      timezone: "Asia/Ho_Chi_Minh",
      preferences: {},
    });
  });

  it("falls back when claims are sparse", () => {
    expect(userFromTokenClaims(undefined, null)).toMatchObject({
      id: "unknown",
      displayName: "Signed-in user",
      email: "",
      userName: "",
    });
  });
});
