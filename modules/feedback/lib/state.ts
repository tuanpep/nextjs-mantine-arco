export const feedbackStatuses = ["New", "Reviewed"] as const;
export type FeedbackStatus = (typeof feedbackStatuses)[number];

export const FEEDBACK_TITLE_MAX_LENGTH = 160;
export const FEEDBACK_TEXT_MAX_LENGTH = 10000;

export function validateFeedbackText(
  value: string,
  maxLength: number,
): "required" | "tooLong" | null {
  const length = value.trim().length;
  return length === 0 ? "required" : length > maxLength ? "tooLong" : null;
}

export type FeedbackItem = {
  id: string;
  projectId: string;
  title: string;
  observation: string;
  status: FeedbackStatus;
  notes: { action: "review"; text: string }[];
};

export type FeedbackDraft = {
  projectId: string;
  title: string;
  observation: string;
};

export function createFeedbackItem(
  id: string,
  draft: FeedbackDraft,
): FeedbackItem | null {
  const title = draft.title.trim();
  const observation = draft.observation.trim();
  if (
    validateFeedbackText(title, FEEDBACK_TITLE_MAX_LENGTH) ||
    validateFeedbackText(observation, FEEDBACK_TEXT_MAX_LENGTH)
  )
    return null;
  return {
    id,
    projectId: draft.projectId,
    title,
    observation,
    status: "New",
    notes: [],
  };
}

export function feedbackActions(status: FeedbackStatus): "review"[] {
  switch (status) {
    case "New":
      return ["review"];
    case "Reviewed":
      return [];
    default: {
      const neverStatus: never = status;
      return neverStatus;
    }
  }
}

export function feedbackInView(
  item: FeedbackItem,
  view: "open" | "closed" | "all",
): boolean {
  switch (view) {
    case "open":
      return item.status === "New";
    case "closed":
      return item.status === "Reviewed";
    case "all":
      return true;
    default: {
      const neverView: never = view;
      return neverView;
    }
  }
}

export function applyFeedbackReview(
  item: FeedbackItem,
  note: string,
): FeedbackItem | null {
  const text = note.trim();
  if (
    validateFeedbackText(text, FEEDBACK_TEXT_MAX_LENGTH) ||
    item.status !== "New"
  )
    return null;
  return {
    ...item,
    status: "Reviewed",
    notes: [...item.notes, { action: "review", text }],
  };
}
