import { issues, type Issue } from "./fixtures";

export function loadIssues(query: string): Issue[] {
  const normalized = query.trim().toLowerCase();

  return issues.filter((issue) =>
    `${issue.id} ${issue.title}`.toLowerCase().includes(normalized),
  );
}

export function loadIssue(id: string): Issue | undefined {
  return issues.find((issue) => issue.id === id);
}
