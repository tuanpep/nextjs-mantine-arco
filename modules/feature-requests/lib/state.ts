export const featureStatuses = ["Submitted", "Accepted", "Declined"] as const;
export type FeatureStatus = (typeof featureStatuses)[number];
export type FeatureNoteAction = "accept" | "decline";

export type FeatureRequest = {
  id: string;
  projectId: string;
  title: string;
  problem: string;
  outcome: string;
  status: FeatureStatus;
  notes: { action: FeatureNoteAction; text: string }[];
};

export type FeatureDraft = {
  projectId: string;
  title: string;
  problem: string;
  outcome: string;
};

export type FeatureTransition =
  { kind: "accept"; note: string } | { kind: "decline"; note: string };

export function createFeatureRequest(
  id: string,
  draft: FeatureDraft,
): FeatureRequest | null {
  const title = draft.title.trim();
  const problem = draft.problem.trim();
  const outcome = draft.outcome.trim();
  if (!title || !problem || !outcome) return null;
  return {
    id,
    projectId: draft.projectId,
    title,
    problem,
    outcome,
    status: "Submitted",
    notes: [],
  };
}

export function featureActions(
  status: FeatureStatus,
): FeatureTransition["kind"][] {
  switch (status) {
    case "Submitted":
      return ["accept", "decline"];
    case "Accepted":
    case "Declined":
      return [];
    default: {
      const neverStatus: never = status;
      return neverStatus;
    }
  }
}

export function featureInView(
  item: FeatureRequest,
  view: "open" | "closed",
): boolean {
  switch (view) {
    case "open":
      return item.status === "Submitted";
    case "closed":
      return item.status !== "Submitted";
    default: {
      const neverView: never = view;
      return neverView;
    }
  }
}

export function applyFeatureTransition(
  item: FeatureRequest,
  action: FeatureTransition,
): FeatureRequest | null {
  const text = action.note.trim();
  if (!text || item.status !== "Submitted") return null;
  switch (action.kind) {
    case "accept":
      return append(item, "Accepted", "accept", text);
    case "decline":
      return append(item, "Declined", "decline", text);
    default: {
      const neverAction: never = action;
      return neverAction;
    }
  }
}

function append(
  item: FeatureRequest,
  status: FeatureStatus,
  action: FeatureNoteAction,
  text: string,
): FeatureRequest {
  return { ...item, status, notes: [...item.notes, { action, text }] };
}
