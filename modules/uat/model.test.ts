import { describe, expect, it } from "vitest";
import { campaignReducer, canAccept, initialCampaign } from "./model";

describe("demo acceptance", () => {
  it("requires every scenario to pass and invalidates acceptance on edits", () => {
    expect(campaignReducer(initialCampaign, { type: "accept" }).accepted).toBe(
      false,
    );
    let state = initialCampaign;
    for (const scenario of state.scenarios)
      state = campaignReducer(state, {
        type: "result",
        scenarioId: scenario.id,
        result: "Pass",
      });
    state = campaignReducer(state, { type: "accept" });
    expect(state.accepted).toBe(true);
    expect(
      campaignReducer(state, {
        type: "result",
        scenarioId: "UAT-01",
        result: "Blocked",
      }).accepted,
    ).toBe(false);
  });

  it("requires a fresh passing retest before closing a defect", () => {
    let state = initialCampaign;
    for (const scenario of state.scenarios)
      state = campaignReducer(state, {
        type: "result",
        scenarioId: scenario.id,
        result: "Pass",
      });
    state = campaignReducer(state, {
      type: "defect",
      scenarioId: "UAT-01",
      title: "Search fails",
      details: "Searching returns no matching sample record.",
      severity: "Major",
    });
    expect(canAccept(state)).toBe(false);
    state = campaignReducer(state, { type: "resolve", defectId: 1 });
    expect(state.defects[0].status).toBe("Open");
    state = campaignReducer(state, { type: "retest", defectId: 1 });
    expect(state.scenarios[0].result).toBe("Not run");
    state = campaignReducer(state, { type: "resolve", defectId: 1 });
    expect(state.defects[0].status).toBe("Retesting");
    state = campaignReducer(state, {
      type: "result",
      scenarioId: "UAT-01",
      result: "Pass",
    });
    state = campaignReducer(state, { type: "resolve", defectId: 1 });
    expect(canAccept(state)).toBe(true);
  });

  it("rejects blank defects and unknown scenarios", () => {
    expect(
      campaignReducer(initialCampaign, {
        type: "defect",
        scenarioId: "UAT-01",
        title: " ",
        details: " ",
        severity: "Minor",
      }),
    ).toBe(initialCampaign);
    expect(
      campaignReducer(initialCampaign, {
        type: "defect",
        scenarioId: "missing",
        title: "Issue",
        details: "Evidence",
        severity: "Major",
      }),
    ).toBe(initialCampaign);
  });
});
