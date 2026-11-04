import type { SessionKind } from "./session-rows";

export type RecordReference = {
  projectId: string;
  kind: SessionKind;
  id: string;
};

export function addRecentRecord(
  records: RecordReference[],
  reference: RecordReference,
): RecordReference[] {
  const sameRecord = (item: RecordReference) =>
    item.projectId === reference.projectId &&
    item.kind === reference.kind &&
    item.id === reference.id;
  if (records[0] && sameRecord(records[0])) return records;
  return [reference, ...records.filter((item) => !sameRecord(item))].slice(
    0,
    10,
  );
}
