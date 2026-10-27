import { describe, expect, it } from "vitest";

import { isAuthorized, initialsFromDisplayName, isCacheFresh } from "./session";

describe("initialsFromDisplayName", () => {
  it("uses first and last name initials", () => {
    expect(initialsFromDisplayName("Jo Lee")).toBe("JL");
  });

  it("uses up to two characters for a single token", () => {
    expect(initialsFromDisplayName("Beacon")).toBe("BE");
  });
});

describe("isCacheFresh", () => {
  it("is false when missing", () => {
    expect(isCacheFresh(null)).toBe(false);
  });

  it("is true before expiry", () => {
    expect(isCacheFresh(Date.now() + 60_000)).toBe(true);
  });
});

describe("isAuthorized", () => {
  it("checks nested authority actions", () => {
    const authority = {
      support: { ticket: ["read", "write"] },
    };
    expect(isAuthorized(authority, "support", "ticket", "read")).toBe(true);
    expect(isAuthorized(authority, "support", "ticket", "delete")).toBe(false);
    expect(isAuthorized(null, "support", "ticket", "read")).toBe(false);
  });
});
