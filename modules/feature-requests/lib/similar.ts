import type { FeatureRequest } from "./state";

function tokens(title: string): Set<string> {
  return new Set(
    title
      .toLowerCase()
      .split(/[^\p{L}\p{N}]+/u)
      .filter((token) => token.length >= 3),
  );
}

export function findSimilarFeatures(
  items: readonly FeatureRequest[],
  projectId: string,
  title: string,
): FeatureRequest[] {
  const target = tokens(title);
  return items
    .filter((item) => item.projectId === projectId)
    .map((item) => ({
      item,
      score: [...tokens(item.title)].filter((token) => target.has(token))
        .length,
    }))
    .filter(({ score }) => score > 0)
    .sort(
      (a, b) =>
        b.score - a.score ||
        a.item.title.localeCompare(b.item.title) ||
        a.item.id.localeCompare(b.item.id, undefined, { numeric: true }) ||
        a.item.id.localeCompare(b.item.id),
    )
    .slice(0, 3)
    .map(({ item }) => item);
}
