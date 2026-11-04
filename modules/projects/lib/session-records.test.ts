import { expect, test } from "vitest";

import { seedPortal } from "@/modules/portal/lib/seed";
import {
  sessionRows,
  type SessionRow,
} from "@/modules/portal/lib/session-rows";

import { applications } from "./applications";
import {
  workspaceSearchParams,
  type SessionRecordQuery,
} from "./search-params";
import { selectSessionRecords } from "./session-records";

const defaults: SessionRecordQuery = {
  recordsQ: "",
  recordsProject: "all",
  recordsKind: "all",
  recordsPage: 1,
};
const rows = applications.flatMap((project) =>
  sessionRows(project.id, seedPortal()),
);

test("combines trimmed case-insensitive title/id search with project and kind", () => {
  const row = rows.find((item) => item.kind === "help");
  if (!row) throw new Error("Missing help fixture");
  const result = selectSessionRecords(
    rows,
    {
      ...defaults,
      recordsQ: `  ${row.id.toLowerCase()}  `,
      recordsProject: row.projectId,
      recordsKind: row.kind,
    },
    "en",
  );
  expect(result.rows).toEqual([row]);
  expect(
    selectSessionRecords(
      rows,
      { ...defaults, recordsQ: row.title.toUpperCase() },
      "en",
    ).rows,
  ).toContainEqual(row);
  expect(
    selectSessionRecords(rows, { ...defaults, recordsProject: "missing" }, "en")
      .project,
  ).toBe("all");
});

test("sorts deterministically, paginates and clamps invalid pages", () => {
  const records: SessionRow[] = Array.from({ length: 23 }, (_, index) => ({
    kind: "guide",
    id: String(index).padStart(2, "0"),
    projectId: "beacon-portal",
    title: "Same title",
    href: `/guides/${index}`,
  }));
  const first = selectSessionRecords(records.toReversed(), defaults, "vi");
  expect(first.rows.map((row) => row.id)).toEqual(
    records.slice(0, 10).map((row) => row.id),
  );
  const last = selectSessionRecords(
    records,
    { ...defaults, recordsPage: 999 },
    "vi",
  );
  expect(last).toMatchObject({ count: 23, pages: 3, page: 3 });
  expect(last.rows).toHaveLength(3);
  expect(
    selectSessionRecords(records, { ...defaults, recordsPage: -2 }, "en").page,
  ).toBe(1);
  expect(
    selectSessionRecords(
      records,
      { ...defaults, recordsQ: "absent", recordsPage: 3 },
      "en",
    ),
  ).toMatchObject({ rows: [], count: 0, page: 1, pages: 1 });
});

test("unknown URL kind and missing page fall back to defaults", () => {
  expect(workspaceSearchParams.recordsKind.parse("unknown")).toBeNull();
  expect(workspaceSearchParams.recordsPage.defaultValue).toBe(1);
});
