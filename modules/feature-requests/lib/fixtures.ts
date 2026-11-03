import type { FeatureRequest } from "./state";

export function featureFixtures(): FeatureRequest[] {
  return [
    {
      id: "FEAT-1",
      projectId: "beacon-portal",
      title: "Saved views for each team",
      problem: "Teams rebuild the same filters.",
      outcome: "A team can reopen a named view.",
      status: "Submitted",
      notes: [],
    },
    {
      id: "FEAT-2",
      projectId: "beacon-portal",
      title: "Dark charts for long sessions",
      problem: "Bright charts are hard to read for a long time.",
      outcome: "Charts can use a darker palette.",
      status: "Accepted",
      notes: [
        {
          action: "accept",
          text: "Accepted for a later review. No ship date.",
        },
      ],
    },
    {
      id: "FEAT-3",
      projectId: "orchid-reports",
      title: "Bulk export for a folder",
      problem: "Each report is exported one at a time.",
      outcome: "A folder can be exported together.",
      status: "Submitted",
      notes: [],
    },
    {
      id: "FEAT-4",
      projectId: "orchid-reports",
      title: "Remove the date column",
      problem: "The date column takes space.",
      outcome: "Reports can hide the date column.",
      status: "Declined",
      notes: [
        {
          action: "decline",
          text: "The date column is required for this report.",
        },
      ],
    },
  ];
}
