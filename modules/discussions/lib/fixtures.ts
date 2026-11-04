import type { DiscussionThread } from "./state";

const beaconTopics = [
  [
    "How should we name saved views?",
    "Looking for a short naming pattern for shared team views.",
    "Mina Cho",
    "Use the team name, then the purpose.",
  ],
  [
    "Welcome to Beacon discussions",
    "Share questions and approaches with other Beacon users.",
    "Alex Rivera",
    "",
  ],
  [
    "Organizing a busy dashboard",
    "How do you group panels when several teams share a dashboard?",
    "Priya Shah",
    "We group by workflow rather than by team.",
  ],
  [
    "Weekly review routines",
    "What do you check before your weekly review?",
    "Noah Kim",
    "",
  ],
  [
    "Finding older views",
    "Our collection has grown. How do you keep older views discoverable?",
    "Lena Ortiz",
    "We add a consistent prefix for the owning team.",
  ],
  [
    "Sharing a view with new teammates",
    "What context is useful when introducing a shared view?",
    "Sam Patel",
    "",
  ],
  [
    "Dashboard handover checklist",
    "I am preparing a handover and would appreciate checklist ideas.",
    "Avery Chen",
    "Include the owner and the questions each panel answers.",
  ],
  [
    "Naming conventions for teams",
    "Do you use abbreviations or full team names?",
    "Jordan Lee",
    "",
  ],
  [
    "Preparing for monthly reporting",
    "How far ahead do you prepare your reporting views?",
    "Mina Cho",
    "We review ours during the last week of the month.",
  ],
  [
    "A useful starting layout",
    "Which panels do you put first for a new audience?",
    "Priya Shah",
    "",
  ],
  [
    "Keeping shared views tidy",
    "How often does your team revisit shared views?",
    "Alex Rivera",
    "A quarterly review has worked well for us.",
  ],
  [
    "Collaborating across teams",
    "How do you gather feedback on a view from multiple teams?",
    "Lena Ortiz",
    "",
  ],
  [
    "Documenting dashboard choices",
    "Where do you record the reasoning behind a layout?",
    "Noah Kim",
    "We keep a short note alongside our team documentation.",
  ],
];

export function discussionFixtures(): DiscussionThread[] {
  const beacon = beaconTopics.map(([title, body, author, reply], index) => {
    const createdAt = `2026-01-${String(index + 1).padStart(2, "0")}T09:00:00.000Z`;
    const updatedAt = reply
      ? `2026-02-${String(index + 1).padStart(2, "0")}T10:00:00.000Z`
      : createdAt;
    return {
      id: `DISC-${index + 1}`,
      projectId: "beacon-portal",
      title,
      body,
      author,
      createdAt,
      updatedAt,
      replies: reply
        ? [
            {
              id: `REPLY-${index + 1}`,
              author: "Taylor Nguyen",
              text: reply,
              createdAt: updatedAt,
            },
          ]
        : [],
    };
  });
  return [
    ...beacon,
    {
      id: "ORCHID-1",
      projectId: "orchid-reports",
      title: "Which export format do you use?",
      body: "Curious which format is easier to share.",
      author: "Mina Cho",
      createdAt: "2026-01-03T09:00:00.000Z",
      updatedAt: "2026-01-04T10:00:00.000Z",
      replies: [
        {
          id: "ORCHID-REPLY-1",
          author: "Sam Patel",
          text: "Spreadsheet, when the audience will edit it.",
          createdAt: "2026-01-04T10:00:00.000Z",
        },
      ],
    },
    {
      id: "ORCHID-2",
      projectId: "orchid-reports",
      title: "Welcome to Orchid discussions",
      body: "Share reporting questions with the community.",
      author: "Avery Chen",
      createdAt: "2026-01-05T09:00:00.000Z",
      updatedAt: "2026-01-05T09:00:00.000Z",
      replies: [],
    },
  ];
}
