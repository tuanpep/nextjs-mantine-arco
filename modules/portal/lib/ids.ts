export function maxSuffix(prefix: string, ids: readonly string[]): number {
  const pattern = new RegExp(`^${prefix}-(\\d+)$`);
  return ids.reduce((highest, id) => {
    const match = pattern.exec(id);
    if (!match) return highest;
    return Math.max(highest, Number(match[1]));
  }, 0);
}

export function nextId(prefix: string, last: number): string {
  return `${prefix}-${last + 1}`;
}
