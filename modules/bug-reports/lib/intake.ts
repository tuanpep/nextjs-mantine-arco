import type { BugSeverity } from "./state";

export const impactScopes = [
  "only-me",
  "my-team",
  "several-teams",
  "whole-project",
  "unsure",
] as const;
export type ImpactScope = (typeof impactScopes)[number];

export const urgencies = [
  "can-wait",
  "this-week",
  "today",
  "stopped-now",
  "unsure",
] as const;
export type Urgency = (typeof urgencies)[number];

export function isImpactScope(value: string): value is ImpactScope {
  return (impactScopes as readonly string[]).includes(value);
}

export function isUrgency(value: string): value is Urgency {
  return (urgencies as readonly string[]).includes(value);
}

/** Demo matrix from who is affected and how soon. The reporter does not pick severity. */
export function bugSeverity(
  impactScope: ImpactScope,
  urgency: Urgency,
): BugSeverity {
  switch (urgency) {
    case "stopped-now":
      return wideImpact(impactScope) ? "Critical" : "High";
    case "today":
      if (wideImpact(impactScope)) return "Critical";
      if (impactScope === "my-team") return "High";
      return "Medium";
    case "this-week":
      return impactScope === "whole-project" ? "High" : "Medium";
    case "can-wait":
      return "Low";
    case "unsure":
      return "Medium";
    default: {
      const neverUrgency: never = urgency;
      return neverUrgency;
    }
  }
}

function wideImpact(impactScope: ImpactScope): boolean {
  switch (impactScope) {
    case "several-teams":
    case "whole-project":
      return true;
    case "only-me":
    case "my-team":
    case "unsure":
      return false;
    default: {
      const neverScope: never = impactScope;
      return neverScope;
    }
  }
}
