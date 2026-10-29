import { describe, expect, it } from "vitest";

import { ApiError, resolveApiUrl } from "./api-client";

describe("resolveApiUrl", () => {
  it("prefixes relative API paths", () => {
    expect(resolveApiUrl("/kernel/v1/users/current")).toBe(
      "https://api.example.com/api/kernel/v1/users/current",
    );
  });

  it("allows absolute URLs on the configured API origin", () => {
    expect(resolveApiUrl("https://api.example.com/api/kernel/authz")).toBe(
      "https://api.example.com/api/kernel/authz",
    );
  });

  it("rejects other origins so the bearer token is not exfiltrated", () => {
    expect(() => resolveApiUrl("https://evil.example/steal")).toThrow(ApiError);
    expect(() => resolveApiUrl("https://evil.example/steal")).toThrow(
      /untrusted host/,
    );
  });
});
