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
  accepted: boolean;
};

export const initialCampaign: Campaign = {
  accepted: false,
  defects: [],
  scenarios: [
    {
      id: "UAT-01",
      title: "Find the right project",
      steps: [
        "Open the project directory.",
        "Search for Beacon Portal.",
        "Open the matching project and review its owner.",
      ],
      expected: "The matching project opens and displays its scope and owner.",
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
      title: "Find a learning guide",
      steps: [
        "Open the learning center.",
        "Search for acceptance and expand the matching guide.",
        "Read the guide and mark it helpful.",
      ],
      expected:
        "The guide is readable and the page acknowledges your feedback.",
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
  | { type: "accept" }
  | { type: "reset" };

export function canAccept(campaign: Campaign) {
  return (
    campaign.scenarios.length > 0 &&
    campaign.scenarios.every((scenario) => scenario.result === "Pass") &&
    campaign.defects.every((defect) => defect.status === "Resolved")
  );
}

export function campaignReducer(
  state: Campaign,
  action: CampaignAction,
): Campaign {
  switch (action.type) {
    case "result":
      return {
        ...state,
        accepted: false,
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
        accepted: false,
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
        accepted: false,
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
        accepted: false,
        defects: state.defects.map((item) =>
          item.id === defect.id ? { ...item, status: "Resolved" } : item,
        ),
      };
    }
    case "accept":
      return canAccept(state) ? { ...state, accepted: true } : state;
    case "reset":
      return initialCampaign;
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
