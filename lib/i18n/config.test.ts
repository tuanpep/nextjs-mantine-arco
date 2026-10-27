import { describe, expect, it } from "vitest";

import en from "@/messages/en.json";
import vi from "@/messages/vi.json";
import { isLocale, resolveLocale } from "./config";

describe("locale configuration", () => {
  it("defaults missing and unsupported preferences to Vietnamese", () => {
    for (const value of [undefined, "", "fr", "../../en", null]) {
      expect(resolveLocale(value)).toBe("vi");
      expect(isLocale(value)).toBe(false);
    }
  });

  it("preserves supported preferences", () => {
    expect(resolveLocale("en")).toBe("en");
    expect(resolveLocale("vi")).toBe("vi");
  });

  it("keeps both workspace catalogs complete", () => {
    expect(Object.keys(vi.Workspace).sort()).toEqual(
      Object.keys(en.Workspace).sort(),
    );
    for (const value of Object.values(vi.Workspace)) {
      expect(value.trim()).not.toBe("");
    }
  });
});
