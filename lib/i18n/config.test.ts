import { describe, expect, it } from "vitest";
import { createTranslator } from "next-intl";

import en from "@/messages/en.json";
import vi from "@/messages/vi.json";
import { isLocale, resolveLocale } from "./config";

function catalogKeys(value: unknown, prefix = ""): string[] {
  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([key, child]) =>
      catalogKeys(child, prefix ? `${prefix}.${key}` : key),
    );
  }
  return [prefix];
}

function catalogValues(value: unknown): string[] {
  if (value && typeof value === "object") {
    return Object.values(value).flatMap((child) => catalogValues(child));
  }
  return typeof value === "string" ? [value] : [];
}

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

  it("keeps both message catalogs aligned", () => {
    expect(catalogKeys(vi).sort()).toEqual(catalogKeys(en).sort());
    for (const value of catalogValues(vi)) {
      expect(value.trim()).not.toBe("");
    }
  });

  it("formats every Vietnamese message without losing interpolation values", () => {
    const onError = (error: Error) => {
      throw error;
    };
    const t = createTranslator({ locale: "vi", messages: vi, onError });
    const values = {
      count: 3,
      page: 2,
      pages: 4,
      id: "BUG-123",
      severity: "Cao",
      limit: 160,
      name: "anh-chup.png",
      date: "04/11/2026",
      author: "Nguyễn An",
    };

    for (const message of catalogValues(vi)) {
      const translate = createTranslator({
        locale: "vi",
        messages: { message },
        onError,
      });
      expect(translate("message", values).trim()).not.toBe("");
    }

    expect(t("Portal.savedRecord", values)).toContain(values.id);
    expect(t("Bugs.attachmentRemove", values)).toContain(values.name);
    expect(t("Bugs.tooLong", values)).toContain("160");
    expect(t("Features.resultCount", values)).toBe("3 đề xuất");
    expect(t("Discussions.replyBy", values)).toContain(values.author);
  });
});
