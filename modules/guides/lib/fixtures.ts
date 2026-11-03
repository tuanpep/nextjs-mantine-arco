import type { GuideArticle } from "./state";

export function guideFixtures(): GuideArticle[] {
  return [
    {
      id: "GUIDE-1",
      projectId: "beacon-portal",
      title: "Export a saved view",
      summary: "Download the current view.",
      body: "Open the view, then choose Export. This article does not grant access.",
    },
    {
      id: "GUIDE-2",
      projectId: "beacon-portal",
      title: "Reset a filter",
      summary: "Return a view to its saved filters.",
      body: "Open the view menu and choose Reset filters.",
    },
    {
      id: "GUIDE-3",
      projectId: "orchid-reports",
      title: "Schedule a report",
      summary: "Run a report on a repeating schedule.",
      body: "Open the report, choose Schedule, and pick a cadence.",
    },
    {
      id: "GUIDE-4",
      projectId: "orchid-reports",
      title: "Read a chart legend",
      summary: "Match each series to its label.",
      body: "The legend lists each series in the same order as the chart.",
    },
  ];
}
