import { describe, expect, it } from "vitest";
import { campaignReducer, initialCampaign } from "./model";

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
