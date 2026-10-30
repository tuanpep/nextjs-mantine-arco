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
      "Điều gì đã xảy ra",
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
      "Mục tiêu và những cách đã thử",
      "Đối tượng bị ảnh hưởng",
      "Công việc cần được xử lý sớm đến mức nào",
      "Chi tiết ảnh hưởng",
      "Phiên bản hoặc môi trường",
    ]);
    expect(questionRows.some((row) => row.label === "Các bước tái hiện")).toBe(
      false,
    );
  });
});
