export type FeedbackDisposition =
  | "Not reviewed"
  | "Acknowledged"
  | "Needs clarification"
  | "Noted";

export type FeedbackItem = {
  id: string;
  projectId: string;
  title: string;
  observation: string;
  context: string;
  disposition: FeedbackDisposition;
  reason: string;
  nextActor: string;
};

export const feedbackItems: FeedbackItem[] = [
  {
    id: "FB-012",
    projectId: "beacon-portal",
    title: "Switching projects felt uncertain",
    observation:
      "I was not sure which project owned the form I was filling in until after I submitted.",
    context: "Mobile browser, morning shift",
    disposition: "Acknowledged",
    reason: "We will keep the project name visible on every working screen.",
    nextActor: "No further action required from sender",
  },
  {
    id: "FB-008",
    projectId: "beacon-portal",
    title: "Support labels were clear",
    observation:
      "The next actor label helped me know whether to wait or reply.",
    context: "Desktop",
    disposition: "Not reviewed",
    reason: "",
    nextActor: "Lan Vo to review",
  },
  {
    id: "FB-003",
    projectId: "orchid-reports",
    title: "Export timing surprised me",
    observation: "The overnight export finished later than the email suggested.",
    context: "Weekly report run",
    disposition: "Needs clarification",
    reason: "Need the export job id and the time window you expected.",
    nextActor: "Mai Tran to reply",
  },
];
