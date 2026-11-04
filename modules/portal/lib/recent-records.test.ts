import { describe, expect, it } from "vitest";

import { addRecentRecord, type RecordReference } from "./recent-records";

describe("recent records", () => {
  it("bounds and deduplicates by the full reference", () => {
    let records: RecordReference[] = [];
    for (let i = 0; i < 11; i++) {
      records = addRecentRecord(records, {
        projectId: "a",
        kind: "bug",
        id: `${i}`,
      });
    }
    expect(records).toHaveLength(10);
    expect(records.at(-1)?.id).toBe("1");
    const ref: RecordReference = { projectId: "a", kind: "bug", id: "1" };
    records = addRecentRecord(records, ref);
    expect(records[0]).toEqual(ref);
    expect(addRecentRecord(records, ref)).toBe(records);
    records = addRecentRecord(records, { ...ref, projectId: "b" });
    records = addRecentRecord(records, { ...ref, kind: "help" });
    expect(records.filter((item) => item.id === "1")).toHaveLength(3);
  });
});
