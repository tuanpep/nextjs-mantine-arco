export type Idea = {
  id: string;
  title: string;
  problem: string;
  outcome: string;
  suggestedChange: string;
  sponsorCandidate: string;
  votes: number;
  votedByMe: boolean;
  position: string;
  next: string;
};

export const seedIdeas: Idea[] = [
  {
    id: "IDE-024",
    title: "Remember my last workspace",
    problem: "After signing in I land on a generic page instead of my project.",
    outcome: "Return to the workspace I used most recently after signing in.",
    suggestedChange: "Store last project per account in the shell.",
    sponsorCandidate: "",
    votes: 12,
    votedByMe: false,
    position: "Under review",
    next: "Lan Vo to record a decision reason.",
  },
  {
    id: "IDE-019",
    title: "Make product links easier to find",
    problem:
      "Frequently used product links are hard to reach from the workspace.",
    outcome:
      "Group frequently used product links inside the project workspace.",
    suggestedChange: "",
    sponsorCandidate: "Khoa Dang",
    votes: 3,
    votedByMe: false,
    position: "Received",
    next: "Lan Vo to review the suggestion.",
  },
];
