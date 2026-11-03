import type { DiscussionThread } from "./state";

export function discussionFixtures(): DiscussionThread[] {
  return [
    {
      id: "DISC-1",
      projectId: "beacon-portal",
      title: "How should we name saved views?",
      body: "Looking for a short naming pattern.",
      replies: [
        {
          id: "REPLY-1",
          author: "Mina Cho",
          text: "Use the team name, then the purpose.",
        },
      ],
    },
    {
      id: "DISC-2",
      projectId: "beacon-portal",
      title: "Welcome to Beacon discussions",
      body: "Use this space for topics that are not a bug, help request, idea, or guide.",
      replies: [],
    },
    {
      id: "DISC-3",
      projectId: "orchid-reports",
      title: "Which export format do you use?",
      body: "Curious which format is easier to share.",
      replies: [
        {
          id: "REPLY-2",
          author: "Mina Cho",
          text: "Spreadsheet, when the audience will edit it.",
        },
      ],
    },
    {
      id: "DISC-4",
      projectId: "orchid-reports",
      title: "Welcome to Orchid discussions",
      body: "Use this space for topics that are not a bug, help request, idea, or guide.",
      replies: [],
    },
  ];
}
