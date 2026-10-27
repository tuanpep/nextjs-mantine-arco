export const articles = [
  {
    id: "request",
    title: "Write a support request that can be reproduced",
    category: "Support",
    minutes: 4,
    summary:
      "Give the support team enough context to investigate without a follow-up meeting.",
    sections: [
      {
        title: "Start with the outcome",
        body: "Use a short summary that names the action and the failure, such as 'Invoice export stops after selecting a date range'. In the situation, explain what you were trying to finish and who is affected. Say whether work is blocked or whether a workaround exists.",
      },
      {
        title: "Record the steps and evidence",
        body: "List the page, the action you took, the expected result, and the actual result. Include the time and time zone, browser, environment, and a safe example record identifier. Remove passwords, access tokens, customer details, and personal data from screenshots before sharing them.",
      },
      {
        title: "Follow the request",
        body: "Check the request timeline for clarification questions. Reply in the existing request rather than opening a duplicate. After a fix is ready, repeat the original steps and report what you observed before confirming that the issue is resolved.",
      },
    ],
  },
  {
    id: "uat",
    title: "Run your first acceptance test",
    category: "Testing",
    minutes: 5,
    summary:
      "Turn a business requirement into a result the release team can use.",
    sections: [
      {
        title: "Prepare a safe test",
        body: "Read the scenario and expected result before starting. Use the agreed test environment and sample data, never live customer records. Check that the build and your role match the campaign. If access or test data is missing, record Blocked instead of guessing a result.",
      },
      {
        title: "Record the result",
        body: "Perform each step in order. Choose Pass only when the observed result matches the expected outcome. Choose Fail when the application behaves incorrectly, and add a defect with reproduction steps, expected behavior, and actual behavior. Not run means there is no test evidence yet.",
      },
      {
        title: "Retest before acceptance",
        body: "After a fix, start a retest and repeat the same scenario on the updated build. A proposed fix is not proof that a defect is resolved. Record a passing result, close the defect after verification, and accept the campaign only when every scenario passes and no defects remain open.",
      },
    ],
  },
  {
    id: "access",
    title: "Check your workspace and access",
    category: "Getting started",
    minutes: 3,
    summary:
      "Find the right project and understand what to do when a permission is missing.",
    sections: [
      {
        title: "Choose the right project",
        body: "Open the project directory and check the project name and owner before working. Read its overview for scope and contacts. Similar project names do not imply the same data or permissions. Confirm the environment before changing a record.",
      },
      {
        title: "Ask for the least access you need",
        body: "If an action is unavailable, note the project, page, and task you need to complete. Ask the project owner to confirm the required role through your organization's access process. Never borrow another person's account or share credentials to work around a restriction.",
      },
      {
        title: "Understand this demo",
        body: "This portal demonstrates workflows with sample records. Learning progress, feedback, and acceptance results on these pages live only in memory while the page is open. They are not access approvals, saved training records, or production release sign-offs. Reloading the page resets them.",
      },
    ],
  },
  {
    id: "triage",
    title: "Triage requests as a project coordinator",
    category: "Support",
    minutes: 4,
    summary: "Separate urgency from severity and keep the next action clear.",
    sections: [
      {
        title: "Assess impact",
        body: "Read the request before assigning it. Identify the affected workflow, number of people affected, and any workaround. A cosmetic problem and a blocked business process need different responses. If there is a suspected security incident, follow your organization's incident process rather than sharing sensitive evidence in a general request.",
      },
      {
        title: "Make ownership explicit",
        body: "Assign a handler who can investigate and record the next action. If information is missing, ask a specific question that the requester can answer, such as the time of failure or the steps taken. Keep decisions and updates in the request timeline so another handler can continue the work.",
      },
      {
        title: "Confirm the outcome",
        body: "When a change is ready, explain what changed and how to verify it. Ask the requester to repeat the original workflow. Do not treat a proposed solution as confirmed resolution, and do not promise response times that your team's agreement does not support.",
      },
    ],
  },
];

export const onboarding: Record<string, string[]> = {
  Requester: [
    "Read the workspace and access guide",
    "Find your project and its owner",
    "Read how to write a support request",
    "Identify the next action in a sample request",
  ],
  Tester: [
    "Read the first acceptance test guide",
    "Confirm the test environment and sample data",
    "Run a scenario in the UAT demo",
    "Practice recording and retesting a defect",
  ],
  Coordinator: [
    "Read the request triage guide",
    "Review project scope and contacts",
    "Identify a handler and the next action",
    "Review the acceptance criteria with testers",
  ],
};
