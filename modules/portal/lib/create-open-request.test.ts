import { describe, expect, it, vi } from "vitest";

import {
  createBugReport,
  type BugDraft,
} from "@/modules/bug-reports/lib/state";

import {
  createOpenRequest,
  type OpenRequestValues,
} from "./create-open-request";

const baseValues: OpenRequestValues = {
  projectId: "orchid-reports",
  kind: "help",
  title: "",
  happened: "",
  steps: "",
  reproduction: "known",
  expected: "",
  environment: "",
  pageUrl: "",
  correlationId: "",
  impactDetail: "",
  impactScope: "",
  urgency: "",
  question: "How do I export?",
  tried: "Checked the guide",
  problem: "",
  outcome: "",
  observation: "",
};

describe("createOpenRequest", () => {
  it("creates an unknown-reproduction bug without environment or hidden steps", () => {
    const createBug = vi.fn((draft: BugDraft) =>
      createBugReport("BUG-5", draft),
    );
    const record = createOpenRequest(
      {
        ...baseValues,
        kind: "bug",
        title: "Intermittent failure",
        happened: "Sometimes fails",
        expected: "Always saves",
        reproduction: "unknown",
        steps: "Hidden steps",
        impactScope: "unsure",
        urgency: "unsure",
      },
      [],
      {
        createBug,
        createHelp: vi.fn(),
        createFeature: vi.fn(),
        createFeedback: vi.fn(),
      },
    );
    expect(createBug.mock.results[0].value).toMatchObject({
      reproduction: "unknown",
      steps: "",
      environment: "",
    });
    expect(record?.href).toBe("/projects/orchid-reports/support/bugs/BUG-5");
  });

  it("maps a help draft to the help detail URL", () => {
    const createHelp = vi.fn(() => ({
      id: "help-1",
      question: "How do I export?",
    }));
    const record = createOpenRequest(baseValues, [], {
      createBug: vi.fn(),
      createHelp,
      createFeature: vi.fn(),
      createFeedback: vi.fn(),
    });
    expect(createHelp).toHaveBeenCalledOnce();
    expect(record).toEqual({
      id: "help-1",
      title: "How do I export?",
      href: "/projects/orchid-reports/support/help/help-1",
    });
  });
});
