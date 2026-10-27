export type Result = "Not run" | "Pass" | "Fail" | "Blocked";
export type Scenario = {
  id: string;
  title: string;
  steps: string[];
  expected: string;
  result: Result;
};
export type Defect = {
  id: number;
  scenarioId: string;
  title: string;
  details: string;
  severity: string;
  status: "Open" | "Retesting" | "Resolved";
};
export type Campaign = {
  scenarios: Scenario[];
  defects: Defect[];
};

export const initialCampaign: Campaign = {
  defects: [],
  scenarios: [
    {
      id: "UAT-01",
      title: "Find the right project",
      steps: [
        "Confirm the project name in the header switcher.",
        "Switch to Beacon Portal if needed.",
        "Open Support and confirm you are still in Beacon Portal.",
      ],
      expected:
        "The header shows Beacon Portal and Support stays in that project.",
      result: "Not run",
    },
    {
      id: "UAT-02",
      title: "Submit a support request",
      steps: [
        "Open the project's new support request form.",
        "Enter a summary and a reproducible situation using sample data.",
        "Review the request, confirm creation, and open its detail.",
      ],
      expected:
        "The request detail shows the summary and initial status without losing the entered information.",
      result: "Not run",
    },
    {
      id: "UAT-03",
      title: "Record a failed scenario",
      steps: [
        "Open an assigned UAT campaign in this project.",
        "Mark a scenario as Fail with a short note.",
        "Confirm the campaign still shows the fail and does not treat it as a pass.",
      ],
      expected:
        "The fail result remains visible and is not treated as release approval.",
      result: "Not run",
    },
  ],
};

export type CampaignAction =
  | { type: "result"; scenarioId: string; result: Result }
  | {
      type: "defect";
      scenarioId: string;
      title: string;
      details: string;
      severity: string;
    }
  | { type: "retest"; defectId: number }
  | { type: "resolve"; defectId: number }
  | { type: "reset" };

export function campaignReducer(
  state: Campaign,
  action: CampaignAction,
): Campaign {
  switch (action.type) {
    case "result":
      return {
        ...state,
        scenarios: state.scenarios.map((scenario) =>
          scenario.id === action.scenarioId
            ? { ...scenario, result: action.result }
            : scenario,
        ),
      };
    case "defect":
      if (
        !action.title.trim() ||
        !action.details.trim() ||
        !state.scenarios.some((scenario) => scenario.id === action.scenarioId)
      )
        return state;
      return {
        ...state,
        defects: [
          ...state.defects,
          {
            id: state.defects.length + 1,
            scenarioId: action.scenarioId,
            title: action.title.trim(),
            details: action.details.trim(),
            severity: action.severity,
            status: "Open",
          },
        ],
      };
    case "retest": {
      const defect = state.defects.find((item) => item.id === action.defectId);
      if (!defect || defect.status !== "Open") return state;
      return {
        ...state,
        scenarios: state.scenarios.map((scenario) =>
          scenario.id === defect.scenarioId
            ? { ...scenario, result: "Not run" }
            : scenario,
        ),
        defects: state.defects.map((item) =>
          item.id === defect.id ? { ...item, status: "Retesting" } : item,
        ),
      };
    }
    case "resolve": {
      const defect = state.defects.find((item) => item.id === action.defectId);
      if (
        !defect ||
        defect.status !== "Retesting" ||
        !state.scenarios.some(
          (scenario) =>
            scenario.id === defect.scenarioId && scenario.result === "Pass",
        )
      )
        return state;
      return {
        ...state,
        defects: state.defects.map((item) =>
          item.id === defect.id ? { ...item, status: "Resolved" } : item,
        ),
      };
    }
    case "reset":
      return initialCampaign;
    default: {
      const _exhaustive: never = action;
      return _exhaustive;
    }
  }
}

export function isResult(value: string): value is Result {
  return (
    value === "Not run" ||
    value === "Pass" ||
    value === "Fail" ||
    value === "Blocked"
  );
}
