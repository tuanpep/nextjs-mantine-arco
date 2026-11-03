import type { HelpRequest } from "./state";

export function helpFixtures(): HelpRequest[] {
  return [
    {
      id: "HELP-1",
      projectId: "beacon-portal",
      question: "How do I reset a saved filter?",
      tried: "I looked through the view menu.",
      status: "Open",
      notes: [],
    },
    {
      id: "HELP-2",
      projectId: "beacon-portal",
      question: "Where are last month's files?",
      tried: "I checked the home page.",
      status: "Answered",
      notes: [
        {
          action: "answer",
          text: "Open the archive section and choose the previous month.",
        },
      ],
    },
    {
      id: "HELP-3",
      projectId: "orchid-reports",
      question: "How do I share a report with a teammate?",
      tried: "I could not find a share control.",
      status: "Open",
      notes: [],
    },
    {
      id: "HELP-4",
      projectId: "orchid-reports",
      question: "Can I change the export format?",
      tried: "I opened Export and saw one option.",
      status: "Answered",
      notes: [
        {
          action: "answer",
          text: "CSV and spreadsheet are both available from Export.",
        },
      ],
    },
  ];
}
