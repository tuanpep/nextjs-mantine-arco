import { describe, expect, it, vi } from "vitest";

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
