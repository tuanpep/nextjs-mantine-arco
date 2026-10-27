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

export const priorities = ["Low", "Medium", "High", "Critical"] as const;
export type Priority = (typeof priorities)[number];

export const priorityColor: Record<Priority, string> = {
  Low: "gray",
  Medium: "blue",
  High: "orange",
  Critical: "red",
};

export const impactScopeLabels: Record<ImpactScope, string> = {
  "only-me": "Only me",
  "my-team": "My team",
  "several-teams": "Several teams",
  "whole-project": "Whole project",
  unsure: "I'm not sure",
};

export const urgencyLabels: Record<Urgency, string> = {
  "can-wait": "Can wait",
  "this-week": "Needed this week",
  today: "Needed today",
  "stopped-now": "Work stopped now",
  unsure: "I'm not sure",
};

/** Proposed demo matrix. Owner must confirm for production SLAs. */
export function calculatePriority(
  impactScope: ImpactScope | "",
  urgency: Urgency | "",
): Priority {
  if (urgency === "stopped-now") {
    if (impactScope === "several-teams" || impactScope === "whole-project") {
      return "Critical";
    }
    return "High";
  }
  if (urgency === "today") {
    if (impactScope === "whole-project" || impactScope === "several-teams") {
      return "Critical";
    }
    if (impactScope === "my-team") return "High";
    return "Medium";
  }
  if (urgency === "this-week") {
    if (impactScope === "whole-project") return "High";
    return "Medium";
  }
  if (urgency === "can-wait") return "Low";
  return "Medium";
}
