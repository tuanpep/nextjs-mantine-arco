export const records = [
  {
    id: "INC-204",
    category: "incident",
    title: "Beacon Portal report exports delayed",
    service: "Beacon Portal",
    status: "Investigating",
    color: "orange",
    summary: "Large report exports may remain queued for more than 10 minutes.",
    workaround:
      "Use a smaller date range and export one month at a time. Avoid repeatedly submitting the same export.",
    affected: 12,
    updates: [
      {
        at: "2026-10-26T09:30:00Z",
        text: "The service team is checking the export queue. No recovery estimate is available.",
      },
      {
        at: "2026-10-26T09:00:00Z",
        text: "Reports of delayed exports received from Finance. Interactive reports are not affected.",
      },
    ],
  },
  {
    id: "MNT-018",
    category: "maintenance",
    title: "Workspace sign-in maintenance",
    service: "Workspace identity",
    status: "Scheduled",
    color: "blue",
    summary:
      "Planned demo window: 28 October 2026, 18:00 to 18:30 UTC. New sign-ins may be interrupted.",
    workaround:
      "Save your work before the window. If sign-in fails during maintenance, retry after 18:30 UTC.",
    affected: 0,
    updates: [
      {
        at: "2026-10-26T08:00:00Z",
        text: "Maintenance window announced. Existing sessions are expected to remain available.",
      },
    ],
  },
  {
    id: "KI-031",
    category: "known",
    title: "CSV exports omit non-Latin names in older Excel versions",
    service: "Beacon Portal",
    status: "Known issue",
    color: "gray",
    summary:
      "Opening a CSV directly in older Excel versions can display names incorrectly.",
    workaround:
      "In Excel, use Data > From Text/CSV and select UTF-8 as the file encoding.",
    affected: 7,
    updates: [
      {
        at: "2026-10-23T15:00:00Z",
        text: "Encoding workaround documented. No fix date has been committed.",
      },
    ],
  },
];
