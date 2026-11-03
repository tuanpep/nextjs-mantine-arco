export function includesQuery(
  query: string,
  values: readonly string[],
): boolean {
  const needle = query.trim().toLocaleLowerCase();
  if (!needle) return true;
  return values.some((value) => value.toLocaleLowerCase().includes(needle));
}

export function forProject<T extends { projectId: string }>(
  items: readonly T[],
  projectId: string,
): T[] {
  return items.filter((item) => item.projectId === projectId);
}
