import { describe, expect, test } from "vitest";

import {
  intakeCopy,
  intakeReadoutRows,
  intakeTemplate,
  validateIntake,
} from "./intake-fields";

describe("type-specific intake", () => {
  test("broken requires repro, expected, environment, and impact facts", () => {
    const errors = validateIntake({
      summary: "Export fails",
      situation: "Clicked export",
      expected: "",
      impact: "",
      environment: "",
      reproSteps: "",
      correlationId: "",
      requestType: "broken",
      impactScope: "",
      urgency: "",
    });
    expect(errors.expected).toBeTruthy();
    expect(errors.reproSteps).toBeTruthy();
    expect(errors.environment).toBeTruthy();
    expect(errors.impactScope).toBeTruthy();
    expect(errors.urgency).toBeTruthy();
  });

  test("question accepts goal text without expected or repro", () => {
    const errors = validateIntake({
      summary: "Where is the report?",
      situation: "Need the monthly report path after checking Home.",
      expected: "",
      impact: "",
      environment: "",
      reproSteps: "",
      correlationId: "",
      requestType: "question",
      impactScope: "",
      urgency: "",
    });
    expect(errors).toEqual({});
    expect(intakeCopy("question").expectedVisible).toBe(false);
  });

  test("access copy hides expected and correlation fields", () => {
    expect(intakeCopy("access").correlationVisible).toBe(false);
    expect(intakeCopy("access").expectedVisible).toBe(false);
  });

  test("template drives type-specific labels and hides unused fields", () => {
    const broken = intakeTemplate("broken").fields;
    expect(broken.find((field) => field.key === "situation")?.label).toBe(
      "What happened",
    );
    expect(broken.find((field) => field.key === "reproSteps")?.visible).toBe(
      true,
    );

    const questionRows = intakeReadoutRows({
      summary: "Where is the report?",
      situation: "Need the path.",
      expected: "leftover",
      impact: "",
      environment: "",
      reproSteps: "leftover",
      correlationId: "leftover",
      requestType: "question",
      impactScope: "",
      urgency: "",
    });
    expect(questionRows.map((row) => row.label)).toEqual([
      "Goal and what you already tried",
      "Who is affected",
      "How soon is work blocked",
      "Impact detail",
      "Version or environment",
    ]);
    expect(
      questionRows.some((row) => row.label === "Steps to reproduce"),
    ).toBe(false);
  });
});
