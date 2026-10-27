import { describe, expect, test } from "vitest";

import { calculatePriority } from "./priority";

describe("calculatePriority", () => {
  test("maps stopped work across teams to Critical", () => {
    expect(calculatePriority("several-teams", "stopped-now")).toBe("Critical");
    expect(calculatePriority("whole-project", "stopped-now")).toBe("Critical");
  });

  test("maps needed today for a team to High", () => {
    expect(calculatePriority("my-team", "today")).toBe("High");
  });

  test("defaults unsure values to Medium", () => {
    expect(calculatePriority("unsure", "unsure")).toBe("Medium");
    expect(calculatePriority("", "")).toBe("Medium");
  });

  test("maps can-wait to Low", () => {
    expect(calculatePriority("only-me", "can-wait")).toBe("Low");
  });
});
