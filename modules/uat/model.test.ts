import { describe, expect, it } from "vitest";
import {
  campaignReducer,
  defectStatusLabels,
  initialCampaign,
  resultLabels,
  severityOptions,
} from "./model";

it("translates display labels without changing internal enum values", () => {
  expect(resultLabels).toEqual({
    "Not run": "Chưa chạy",
    Pass: "Đạt",
    Fail: "Không đạt",
    Blocked: "Bị chặn",
  });
  expect(defectStatusLabels).toEqual({
    Open: "Đang mở",
    Retesting: "Đang kiểm thử lại",
    Resolved: "Đã xử lý",
  });
  expect(severityOptions).toEqual([
    { value: "Critical", label: "Nghiêm trọng" },
    { value: "Major", label: "Cao" },
    { value: "Minor", label: "Thấp" },
  ]);
});

describe("campaign results", () => {
  it("records results without an acceptance decision", () => {
    let state = campaignReducer(initialCampaign, {
      type: "result",
      scenarioId: "UAT-01",
      result: "Pass",
    });
    expect(state.scenarios[0]?.result).toBe("Pass");
    expect(state).not.toHaveProperty("accepted");

    state = campaignReducer(state, {
      type: "result",
      scenarioId: "UAT-01",
      result: "Fail",
    });
    expect(state.scenarios[0]?.result).toBe("Fail");
  });

  it("tracks defects through retest and resolve", () => {
    let state = campaignReducer(initialCampaign, {
      type: "defect",
      scenarioId: "UAT-02",
      title: "Form lost text",
      details: "Summary disappeared after review.",
      severity: "Major",
    });
    expect(state.defects).toHaveLength(1);
    state = campaignReducer(state, { type: "retest", defectId: 1 });
    expect(state.defects[0]?.status).toBe("Retesting");
    state = campaignReducer(state, {
      type: "result",
      scenarioId: "UAT-02",
      result: "Pass",
    });
    state = campaignReducer(state, { type: "resolve", defectId: 1 });
    expect(state.defects[0]?.status).toBe("Resolved");
  });
});
