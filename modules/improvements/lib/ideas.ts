type IdeaBase = {
  id: string;
  title: string;
  pain: string;
  value: string;
  teams: string;
  submitted: string;
};

export type Idea = IdeaBase &
  ({ kind: "enhancement" } | { kind: "demand"; sponsor: string });

export function ideaKind(kind: Idea["kind"]) {
  return kind === "demand"
    ? "Transformation demand"
    : "Application enhancement";
}

export const seedIdeas: Idea[] = [
  {
    id: "IMP-104",
    kind: "enhancement",
    title: "Save report filters in Beacon Portal",
    pain: "Analysts rebuild the same report filters every Monday.",
    value: "Reduce weekly report preparation by 20 minutes per analyst.",
    teams: "Finance, Operations",
    submitted: "2026-10-23T09:00:00Z",
  },
  {
    id: "IMP-103",
    kind: "demand",
    title: "Connect employee onboarding across teams",
    pain: "HR, IT and Facilities track new starters in separate spreadsheets.",
    value:
      "Give each starter one checklist and reduce missed equipment requests.",
    teams: "HR, IT, Facilities",
    sponsor: "People Operations director",
    submitted: "2026-10-22T14:30:00Z",
  },
  {
    id: "IMP-102",
    kind: "enhancement",
    title: "Add CSV export to the support queue",
    pain: "Team leads copy support records into spreadsheets by hand.",
    value: "Remove manual copying from the weekly service review.",
    teams: "Service desk",
    submitted: "2026-10-21T10:15:00Z",
  },
];
