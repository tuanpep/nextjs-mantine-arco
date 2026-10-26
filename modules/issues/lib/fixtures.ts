export type RequestStatus = "Open" | "Waiting" | "Resolved";

export type Issue = {
  id: string;
  title: string;
  project: string;
  status: RequestStatus;
  description: string;
  comments: { author: string; body: string }[];
  activity: string[];
};

export const statusColor: Record<RequestStatus, string> = {
  Open: "blue",
  Waiting: "orange",
  Resolved: "green",
};

export const issues: Issue[] = [
  {
    id: "SUP-1042",
    title: "Login fails after password reset",
    project: "Beacon Portal",
    status: "Open",
    description:
      "Resetting a password returns the user to the login page, and the new password is rejected.",
    comments: [
      {
        author: "Reporter",
        body: "This started after yesterday's release. The old password still works.",
      },
    ],
    activity: ["Issue opened", "Status set to Open"],
  },
  {
    id: "SUP-1038",
    title: "Export skips the last page",
    project: "Beacon Portal",
    status: "Waiting",
    description:
      "A PDF export of a 12-page report stops at page 11. The on-screen report is complete.",
    comments: [
      {
        author: "Handler",
        body: "Asked the reporter for the report id and the browser they used.",
      },
    ],
    activity: ["Issue opened", "Status set to Waiting"],
  },
  {
    id: "SUP-1031",
    title: "Invitation email never arrives",
    project: "Atlas Desk",
    status: "Resolved",
    description:
      "New teammates do not receive the invitation email. Resending from the members page does nothing.",
    comments: [
      {
        author: "Handler",
        body: "The mail provider was rejecting the sender domain. That domain is verified now.",
      },
    ],
    activity: ["Issue opened", "Status set to Resolved"],
  },
];
