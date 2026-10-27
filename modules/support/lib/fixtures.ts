export const supportProjectId = "beacon-portal";
export const sender = "Jo Lee";
export const supportStatuses = [
  "Unclaimed",
  "Handling",
  "Waiting for sender",
  "Waiting for retest",
  "Resolved",
] as const;
export type SupportStatus = (typeof supportStatuses)[number];

export type SupportContext = {
  summary: string;
  situation: string;
  expected: string;
  impact: string;
  environment: string;
};
export type Outcome = {
  summary: string;
  work: string;
  limitations: string;
  superseded: boolean;
};
export type SupportRequest = SupportContext & {
  applicationId: string | null;
  responsibleTeam: string;
  id: string;
  sender: typeof sender;
  status: SupportStatus;
  handler: string | null;
  nextActor: "Sender" | "Handler" | "Responsible team";
  nextAction: string;
  conversation: { author: string; text: string }[];
  outcomes: Outcome[];
};

const context: SupportContext = {
  summary: "Help with the monthly report export",
  situation:
    "I opened the monthly report and selected Export. The file did not include the final row.",
  expected: "All visible rows should appear in the exported file.",
  impact: "I need to compare the totals before sharing the report.",
  environment: "Beacon Portal demo, desktop browser",
};

export const supportFixtures: SupportRequest[] = [
  {
    ...context,
    applicationId: "beacon-portal",
    responsibleTeam: "Product Services",
    id: "SUP112",
    sender,
    status: "Waiting for sender",
    handler: "Mai Tran",
    nextActor: "Sender",
    nextAction:
      "Which report period did you select, and did you apply a filter?",
    conversation: [
      {
        author: "Mai Tran",
        text: "Which report period did you select, and did you apply a filter? Please describe the settings without sharing report data.",
      },
    ],
    outcomes: [],
  },
  {
    ...context,
    applicationId: "beacon-portal",
    responsibleTeam: "Product Services",
    id: "SUP113",
    summary: "Retest the report export",
    sender,
    status: "Waiting for retest",
    handler: "Mai Tran",
    nextActor: "Sender",
    nextAction:
      "The export row selection was corrected in the demo. Open the monthly report in the demo environment, choose the same period, export again and compare the row count. Do not upload the file.",
    conversation: [
      {
        author: "Mai Tran",
        text: "The demo export row selection has been corrected. Please try the export again using the same period and compare the row count.",
      },
    ],
    outcomes: [],
  },
  {
    ...context,
    applicationId: "beacon-portal",
    responsibleTeam: "Product Services",
    id: "SUP114",
    summary: "Report totals display correctly again",
    sender,
    status: "Resolved",
    handler: "Mai Tran",
    nextActor: "Sender",
    nextAction:
      "Read the outcome. If the same issue returns, explain why you need to reopen it.",
    conversation: [
      { author: sender, text: "The totals now match in the demo." },
    ],
    outcomes: [
      {
        summary: "Report totals corrected",
        work: "Updated the demo report calculation and checked the example totals.",
        limitations:
          "Checked with fictional demo data only. This is not UAT approval.",
        superseded: false,
      },
    ],
  },
  {
    ...context,
    applicationId: "beacon-portal",
    responsibleTeam: "Product Services",
    id: "SUP115",
    summary: "Where can I find report guidance?",
    sender,
    status: "Unclaimed",
    handler: null,
    nextActor: "Responsible team",
    nextAction:
      "An eligible handler needs to review this request and take responsibility.",
    conversation: [],
    outcomes: [],
  },
  {
    ...context,
    applicationId: "beacon-portal",
    responsibleTeam: "Product Services",
    id: "SUP116",
    summary: "Report filters reset on navigation",
    sender,
    status: "Handling",
    handler: "Sam Rivera",
    nextActor: "Handler",
    nextAction:
      "Sam Rivera will investigate the filter reset and share the next step.",
    conversation: [
      {
        author: "Sam Rivera",
        text: "I am checking the navigation behavior in the demo.",
      },
    ],
    outcomes: [],
  },
  {
    ...context,
    applicationId: "orchid-reports",
    responsibleTeam: "Business Analytics",
    id: "SUP201",
    summary: "Scheduled report did not arrive",
    situation: "The fictional weekly report is missing from the demo inbox.",
    environment: "Orchid Reports demo",
    sender,
    status: "Unclaimed",
    handler: null,
    nextActor: "Responsible team",
    nextAction: "Business Analytics needs to review the scheduled delivery.",
    conversation: [],
    outcomes: [],
  },
];

export const supportStatusColor: Record<SupportStatus, string> = {
  Unclaimed: "gray",
  Handling: "blue",
  "Waiting for sender": "orange",
  "Waiting for retest": "violet",
  Resolved: "teal",
};
