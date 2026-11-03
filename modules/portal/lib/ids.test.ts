import { describe, expect, it } from "vitest";

import { maxSuffix, nextId } from "./ids";

describe("record ids", () => {
  it("continues from the highest matching suffix", () => {
    expect(maxSuffix("BUG", ["BUG-2", "GUIDE-9", "BUG-4"])).toBe(4);
    expect(nextId("BUG", 4)).toBe("BUG-5");
    expect(maxSuffix("REPLY", [])).toBe(0);
  });
});
