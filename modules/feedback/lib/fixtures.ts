import type { FeedbackItem } from "./state";

export function feedbackFixtures(): FeedbackItem[] {
  return [
    {
      id: "FB-1",
      projectId: "beacon-portal",
      title: "The export label is easy to miss",
      observation: "The export label sits far from the main action.",
      status: "New",
      notes: [],
    },
    {
      id: "FB-2",
      projectId: "beacon-portal",
      title: "The confirmation copy is clear",
      observation: "The saved-view confirmation is easy to understand.",
      status: "Reviewed",
      notes: [
        {
          action: "review",
          text: "Noted for a future copy pass. This is not a commitment to change it.",
        },
      ],
    },
    {
      id: "FB-3",
      projectId: "orchid-reports",
      title: "The queue page is dense",
      observation: "Too many columns appear before the report name.",
      status: "New",
      notes: [],
    },
    {
      id: "FB-4",
      projectId: "orchid-reports",
      title: "Filters are easy to find",
      observation: "The filter control is where I expected it.",
      status: "Reviewed",
      notes: [
        { action: "review", text: "Reviewed. No product change is promised." },
      ],
    },
  ];
}
