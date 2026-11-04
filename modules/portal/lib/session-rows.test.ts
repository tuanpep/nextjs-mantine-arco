import { expect, test } from "vitest";

import { seedPortal } from "./seed";
import { sessionKinds, sessionRows } from "./session-rows";

test("projects all six collections into canonical links and normalizes help titles", () => {
  const state = seedPortal();
  const rows = sessionRows("beacon-portal", state);
  expect(new Set(rows.map((row) => row.kind))).toEqual(new Set(sessionKinds));
  for (const row of rows) {
    expect(row.projectId).toBe("beacon-portal");
    expect(row.href).toMatch(/^\/projects\/beacon-portal\//);
    expect(row.href.endsWith(`/${row.id}`)).toBe(true);
  }
  const help = state.help.find((item) => item.projectId === "beacon-portal");
  expect(
    rows.find((row) => row.kind === "help" && row.id === help?.id)?.title,
  ).toBe(help?.question);
  expect(sessionRows("missing", state)).toEqual([]);
});

test("only workflow kinds carry actual status and lifecycle-derived active flags", () => {
  const state = seedPortal();
  const bug = state.bugs[0];
  if (!bug) throw new Error("Missing bug fixture");
  state.bugs = [
    { ...bug, status: "Waiting for reporter" },
    { ...bug, id: "BUG-resolved", status: "Resolved" },
  ];
  const rows = sessionRows(bug.projectId, state);
  expect(
    rows.find((row) => row.id === bug.id && row.kind === "bug"),
  ).toMatchObject({ status: "Waiting for reporter", active: true });
  expect(rows.find((row) => row.id === "BUG-resolved")).toMatchObject({
    status: "Resolved",
    active: false,
  });
  for (const row of rows.filter(
    (row) => row.kind === "guide" || row.kind === "discussion",
  )) {
    expect(row).not.toHaveProperty("status");
    expect(row).not.toHaveProperty("active");
  }
});
