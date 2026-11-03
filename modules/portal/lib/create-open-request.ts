import type { BugAttachment } from "@/modules/bug-reports/lib/attachments";

export const openRequestKinds = ["bug", "help", "feature", "feedback"] as const;
export type OpenRequestKind = (typeof openRequestKinds)[number];

export type OpenRequestValues = {
  projectId: string;
  kind: OpenRequestKind;
  title: string;
  happened: string;
  steps: string;
  expected: string;
  environment: string;
  pageUrl: string;
  correlationId: string;
  impactDetail: string;
  impactScope: string;
  urgency: string;
  question: string;
  tried: string;
  problem: string;
  outcome: string;
  observation: string;
};

export type CreatedOpenRequest = {
  id: string;
  title: string;
  href: string;
};

export function createOpenRequest(
  values: OpenRequestValues,
  attachments: BugAttachment[],
  actions: {
    createBug: (draft: {
      projectId: string;
      title: string;
      happened: string;
      steps: string;
      expected: string;
      environment: string;
      pageUrl: string;
      attachments: BugAttachment[];
      correlationId: string;
      impactDetail: string;
      impactScope: string;
      urgency: string;
    }) => { id: string; title: string } | null;
    createHelp: (draft: {
      projectId: string;
      question: string;
      tried: string;
    }) => { id: string; question: string } | null;
    createFeature: (draft: {
      projectId: string;
      title: string;
      problem: string;
      outcome: string;
    }) => { id: string; title: string } | null;
    createFeedback: (draft: {
      projectId: string;
      title: string;
      observation: string;
    }) => { id: string; title: string } | null;
  },
): CreatedOpenRequest | null {
  const projectId = values.projectId;
  switch (values.kind) {
    case "bug": {
      const record = actions.createBug({
        projectId,
        title: values.title,
        happened: values.happened,
        steps: values.steps,
        expected: values.expected,
        environment: values.environment,
        pageUrl: values.pageUrl,
        attachments,
        correlationId: values.correlationId,
        impactDetail: values.impactDetail,
        impactScope: values.impactScope,
        urgency: values.urgency,
      });
      return record
        ? {
            id: record.id,
            title: record.title,
            href: `/projects/${projectId}/support/bugs/${record.id}`,
          }
        : null;
    }
    case "help": {
      const record = actions.createHelp({
        projectId,
        question: values.question,
        tried: values.tried,
      });
      return record
        ? {
            id: record.id,
            title: record.question,
            href: `/projects/${projectId}/support/help/${record.id}`,
          }
        : null;
    }
    case "feature": {
      const record = actions.createFeature({
        projectId,
        title: values.title,
        problem: values.problem,
        outcome: values.outcome,
      });
      return record
        ? {
            id: record.id,
            title: record.title,
            href: `/projects/${projectId}/ideas/features/${record.id}`,
          }
        : null;
    }
    case "feedback": {
      const record = actions.createFeedback({
        projectId,
        title: values.title,
        observation: values.observation,
      });
      return record
        ? {
            id: record.id,
            title: record.title,
            href: `/projects/${projectId}/ideas/feedback/${record.id}`,
          }
        : null;
    }
    default: {
      const neverKind: never = values.kind;
      return neverKind;
    }
  }
}

export function openRequestUsesTitle(kind: OpenRequestKind) {
  switch (kind) {
    case "bug":
    case "feature":
    case "feedback":
      return true;
    case "help":
      return false;
    default: {
      const neverKind: never = kind;
      return neverKind;
    }
  }
}
