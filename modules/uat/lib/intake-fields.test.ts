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

  test("keeps stored detail markers and translates structured readout labels", () => {
    const details = composeUatDetails({
      reproSteps: "Mở UAT",
      expected: "Hiện kết quả",
      actual: "Không có kết quả",
    });
    expect(details).toBe(
      "Steps:\nMở UAT\n\nExpected:\nHiện kết quả\n\nActual:\nKhông có kết quả",
    );
    expect(uatDefectReadoutRows(details)).toEqual([
      { label: "Các bước tái hiện", value: "Mở UAT" },
      { label: "Kết quả mong đợi", value: "Hiện kết quả" },
      { label: "Kết quả thực tế", value: "Không có kết quả" },
    ]);
  });

  test("readout falls back for legacy free-text details", () => {
    expect(uatDefectReadoutRows("Clicked export and nothing happened")).toEqual(
      [
        {
          label: "Các bước và hành vi thực tế",
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
      title: "Nhập tóm tắt lỗi.",
      reproSteps: "Liệt kê các bước tái hiện.",
      expected: "Mô tả kết quả mong đợi.",
      actual: "Mô tả kết quả thực tế.",
    });
  });
});
