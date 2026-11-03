import { describe, expect, it } from "vitest";

import { bugSeverity, type ImpactScope, type Urgency } from "./intake";

const cases: [Urgency, ImpactScope, string][] = [
  ["stopped-now", "whole-project", "Critical"],
  ["stopped-now", "several-teams", "Critical"],
  ["stopped-now", "my-team", "High"],
  ["stopped-now", "only-me", "High"],
  ["stopped-now", "unsure", "High"],
  ["today", "whole-project", "Critical"],
  ["today", "several-teams", "Critical"],
  ["today", "my-team", "High"],
  ["today", "only-me", "Medium"],
  ["today", "unsure", "Medium"],
  ["this-week", "whole-project", "High"],
  ["this-week", "my-team", "Medium"],
  ["this-week", "only-me", "Medium"],
  ["can-wait", "whole-project", "Low"],
  ["can-wait", "only-me", "Low"],
  ["unsure", "whole-project", "Medium"],
  ["unsure", "only-me", "Medium"],
];

describe("bug severity", () => {
  it("derives severity from who is affected and how soon", () => {
    for (const [urgency, impactScope, severity] of cases) {
      expect(bugSeverity(impactScope, urgency)).toBe(severity);
    }
  });
});
