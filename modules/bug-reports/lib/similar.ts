import type { BugReport } from "./state";

function titleTokens(title: string): Set<string> {
  return new Set(
    title
      .toLowerCase()
      .split(/[^\p{L}\p{N}]+/u)
      .filter((token) => token.length >= 3),
  );
}

export function findSimilarBugs(
  items: readonly BugReport[],
  projectId: string,
  title: string,
): BugReport[] {
  const target = titleTokens(title);
  return items
    .filter((item) => item.projectId === projectId)
    .map((item) => ({
      item,
      score: [...titleTokens(item.title)].filter((token) => target.has(token))
        .length,
    }))
    .filter(({ score }) => score > 0)
    .sort(
      (left, right) =>
        right.score - left.score ||
        left.item.title.localeCompare(right.item.title) ||
        left.item.id.localeCompare(right.item.id, undefined, {
          numeric: true,
        }) ||
        left.item.id.localeCompare(right.item.id),
    )
    .slice(0, 3)
    .map(({ item }) => item);
}
