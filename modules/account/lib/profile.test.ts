import { describe, expect, it } from "vitest";

import { normalizeCurrentUser } from "./profile";

describe("normalizeCurrentUser", () => {
  it("maps the full kernel current-user payload", () => {
    const user = normalizeCurrentUser({
      id: 42,
      userName: "jo.lee",
      displayName: "Jo Lee",
      email: "jo.lee@example.com",
      avatar: "https://cdn.example/jo.png",
      birthDate: "1990-01-02",
      phone: "+84 90 123 4567",
      locale: "vi",
      timezone: "Asia/Ho_Chi_Minh",
      status: 1,
      authority: { support: { ticket: ["read"] } },
      preferences: { theme: '{"mode":"dark"}', lang: "vi" },
      agentId: 7,
      branchId: "3",
      merchantId: 9,
      impersonator: {
        id: 1,
        userName: "admin",
        emailAddress: "admin@example.com",
        companyId: 10,
      },
    });

    expect(user).toMatchObject({
      id: "42",
      userName: "jo.lee",
      displayName: "Jo Lee",
      email: "jo.lee@example.com",
      avatar: "https://cdn.example/jo.png",
      birthDate: "1990-01-02",
      phone: "+84 90 123 4567",
      locale: "vi",
      timezone: "Asia/Ho_Chi_Minh",
      status: 1,
      agentId: 7,
      branchId: 3,
      merchantId: 9,
      preferences: { theme: { mode: "dark" }, lang: "vi" },
      impersonator: {
        id: "1",
        userName: "admin",
        email: "admin@example.com",
        companyId: 10,
      },
    });
    expect(user.authority?.support?.ticket).toEqual(["read"]);
  });

  it("falls back when the payload is sparse", () => {
    expect(normalizeCurrentUser({})).toMatchObject({
      id: "unknown",
      userName: "",
      displayName: "Signed-in user",
      email: "",
      preferences: {},
      impersonator: null,
    });
  });
});
