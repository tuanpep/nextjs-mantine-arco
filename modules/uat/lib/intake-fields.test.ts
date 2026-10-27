import { describe, expect, test } from "vitest";

import {
  composeUatDetails,
  parseUatDetails,
  uatDefectReadoutRows,
  validateUatDefectIntake,
} from "./intake-fields";

describe("uat defect intake", () => {
  test("compose and parse round-trip", () => {
    const composed = composeUatDetails({
      reproSteps: "1. Open UAT\n2. Mark Fail",
      expected: "Scenario stays Fail",
      actual: "Result cleared",
    });
    expect(parseUatDetails(composed)).toEqual({
      reproSteps: "1. Open UAT\n2. Mark Fail",
      expected: "Scenario stays Fail",
      actual: "Result cleared",
    });
  });

  test("readout falls back for legacy free-text details", () => {
    expect(uatDefectReadoutRows("Clicked export and nothing happened")).toEqual(
      [
        {
          label: "Steps and actual behavior",
          value: "Clicked export and nothing happened",
        },
      ],
    );
  });

  test("validate requires structured more-details fields", () => {
    expect(
      validateUatDefectIntake({
        title: "",
        reproSteps: "",
        expected: "",
        actual: "",
      }),
    ).toEqual({
      title: "Enter a defect summary.",
      reproSteps: "List the steps to reproduce.",
      expected: "Say what should have happened.",
      actual: "Describe what happened instead.",
    });
  });
});
