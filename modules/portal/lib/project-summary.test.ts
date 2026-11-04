import { expect, test } from "vitest";

import { projectAttention, projectSummaries } from "./project-summary";
import { seedPortal } from "./seed";

test("counts only open workflow statuses", () => {
  const source = seedPortal();
  const bug = source.bugs[0];
  const help = source.help[0];
  const feature = source.features[0];
  const feedback = source.feedback[0];
  if (!bug || !help || !feature || !feedback)
    throw new Error("Missing fixtures");
  source.bugs = (
    ["Open", "In progress", "Waiting for reporter", "Resolved"] as const
  ).map((status, i) => ({ ...bug, id: String(i), projectId: "p", status }));
  source.help = (["Open", "Answered"] as const).map((status, i) => ({
    ...help,
    id: String(i),
    projectId: "p",
    status,
  }));
  source.features = (["Submitted", "Accepted", "Declined"] as const).map(
    (status, i) => ({ ...feature, id: String(i), projectId: "p", status }),
  );
  source.feedback = (["New", "Reviewed"] as const).map((status, i) => ({
    ...feedback,
    id: String(i),
    projectId: "p",
    status,
  }));
  expect(
    projectSummaries("p", source, "en")
      .slice(0, 4)
      .map(({ count }) => count),
  ).toEqual([3, 1, 1, 1]);
});

test("summaries select active project rows and follow updates", () => {
  const source = seedPortal();
  const before = projectSummaries("beacon-portal", source, "en");
  const bug = before.find((summary) => summary.kind === "bug");
  expect(bug?.count).toBe(1);
  expect(bug?.href).toBe("/projects/beacon-portal/support/bugs?view=open");
  const changed = {
    ...source,
    bugs: source.bugs.map((item) =>
      item.projectId === "beacon-portal"
        ? { ...item, status: "Resolved" as const }
        : item,
    ),
  };
  expect(
    projectSummaries("beacon-portal", changed, "en").find(
      (summary) => summary.kind === "bug",
    )?.count,
  ).toBe(0);
  expect(
    projectSummaries("missing", source, "en").every(
      (summary) => summary.count === 0 && summary.records.length === 0,
    ),
  ).toBe(true);
});

test("previews are title sorted, capped and include guides and discussions", () => {
  const source = seedPortal();
  const guide = source.guides[0];
  const discussion = source.discussions[0];
  expect(guide).toBeDefined();
  expect(discussion).toBeDefined();
  if (!guide || !discussion) return;
  source.guides = ["z", "a", "a", "b"].map((title, i) => ({
    ...guide,
    id: String(4 - i),
    projectId: "p",
    title,
  }));
  source.discussions = [{ ...discussion, projectId: "p" }];
  const summaries = projectSummaries("p", source, "en");
  const guides = summaries.find((summary) => summary.kind === "guide");
  expect(guides?.count).toBe(4);
  expect(guides?.records.map((row) => row.id)).toEqual(["2", "3", "1"]);
  expect(
    summaries.find((summary) => summary.kind === "discussion")?.records,
  ).toHaveLength(1);
});

test("attention isolates active project records, orders and caps bugs without mutating source", () => {
  const source = seedPortal();
  const [bug] = source.bugs;
  const [help] = source.help;
  const [feature] = source.features;
  const [feedback] = source.feedback;
  if (!bug || !help || !feature || !feedback)
    throw new Error("Missing fixtures");
  source.bugs = [
    {
      ...bug,
      projectId: "p",
      id: "6",
      title: "Z",
      severity: "Low",
      status: "Open",
    },
    {
      ...bug,
      projectId: "p",
      id: "3",
      title: "A",
      severity: "High",
      status: "Waiting for reporter",
    },
    {
      ...bug,
      projectId: "p",
      id: "2",
      title: "A",
      severity: "High",
      status: "In progress",
    },
    {
      ...bug,
      projectId: "p",
      id: "1",
      title: "Z",
      severity: "Critical",
      status: "Open",
    },
    {
      ...bug,
      projectId: "p",
      id: "4",
      title: "B",
      severity: "High",
      status: "Open",
    },
    {
      ...bug,
      projectId: "p",
      id: "5",
      title: "A",
      severity: "Medium",
      status: "Open",
    },
    {
      ...bug,
      projectId: "p",
      id: "resolved",
      severity: "Critical",
      status: "Resolved",
    },
    {
      ...bug,
      projectId: "other",
      id: "other",
      severity: "Critical",
      status: "Open",
    },
  ];
  source.help = [
    { ...help, projectId: "p", status: "Open" },
    { ...help, projectId: "p", status: "Answered" },
    { ...help, projectId: "other", status: "Open" },
  ];
  source.features = [
    { ...feature, projectId: "p", status: "Submitted" },
    { ...feature, projectId: "p", status: "Accepted" },
    { ...feature, projectId: "other", status: "Submitted" },
  ];
  source.feedback = [
    { ...feedback, projectId: "p", status: "New" },
    { ...feedback, projectId: "p", status: "Reviewed" },
    { ...feedback, projectId: "other", status: "New" },
  ];
  const before = structuredClone(source);
  const result = projectAttention("p", source, "en");
  expect(result).toMatchObject({
    bugCount: 6,
    helpCount: 1,
    featureCount: 1,
    feedbackCount: 1,
  });
  expect(result.bugs.map(({ id }) => id)).toEqual(["1", "2", "3", "4", "5"]);
  expect(result.bugs[2]).toEqual({
    id: "3",
    title: "A",
    href: "/projects/p/support/bugs/3",
    severity: "High",
    status: "Waiting for reporter",
  });
  expect(source).toEqual(before);
  expect(projectAttention("missing", source, "en")).toEqual({
    bugs: [],
    bugCount: 0,
    helpCount: 0,
    featureCount: 0,
    feedbackCount: 0,
  });
});
