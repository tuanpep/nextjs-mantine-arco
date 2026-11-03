export const helpStatuses = ["Open", "Answered"] as const;
export type HelpStatus = (typeof helpStatuses)[number];
export type HelpNoteAction = "answer" | "reopen";

export type HelpRequest = {
  id: string;
  projectId: string;
  question: string;
  tried: string;
  status: HelpStatus;
  notes: { action: HelpNoteAction; text: string }[];
};

export type HelpDraft = {
  projectId: string;
  question: string;
  tried: string;
};

export type HelpTransition =
  { kind: "answer"; note: string } | { kind: "reopen"; note: string };

export function createHelpRequest(
  id: string,
  draft: HelpDraft,
): HelpRequest | null {
  const question = draft.question.trim();
  const tried = draft.tried.trim();
  if (!question || !tried) return null;
  return {
    id,
    projectId: draft.projectId,
    question,
    tried,
    status: "Open",
    notes: [],
  };
}

export function helpActions(status: HelpStatus): HelpTransition["kind"][] {
  switch (status) {
    case "Open":
      return ["answer"];
    case "Answered":
      return ["reopen"];
    default: {
      const neverStatus: never = status;
      return neverStatus;
    }
  }
}

export function helpInView(
  item: HelpRequest,
  view: "open" | "answered",
): boolean {
  switch (view) {
    case "open":
      return item.status === "Open";
    case "answered":
      return item.status === "Answered";
    default: {
      const neverView: never = view;
      return neverView;
    }
  }
}

export function applyHelpTransition(
  item: HelpRequest,
  action: HelpTransition,
): HelpRequest | null {
  const text = action.note.trim();
  if (!text) return null;
  switch (action.kind) {
    case "answer":
      if (item.status !== "Open") return null;
      return append(item, "Answered", "answer", text);
    case "reopen":
      if (item.status !== "Answered") return null;
      return append(item, "Open", "reopen", text);
    default: {
      const neverAction: never = action;
      return neverAction;
    }
  }
}

function append(
  item: HelpRequest,
  status: HelpStatus,
  action: HelpNoteAction,
  text: string,
): HelpRequest {
  return { ...item, status, notes: [...item.notes, { action, text }] };
}
