import type { DetailsFieldDef, DetailsReadoutRow } from "@/lib/form-details";

import type { SupportContext } from "./fixtures";
import {
  impactScopeLabels,
  impactScopes,
  urgencyLabels,
  urgencies,
} from "./priority";
import type { RequestType } from "./request-catalog";

export type IntakeFieldKey = keyof Omit<SupportContext, "attachments">;

export const misrouteTargets = ["feedback", "ideas", "uat"] as const;
export type MisrouteTarget = (typeof misrouteTargets)[number];

export const misrouteTargetLabels: Record<MisrouteTarget, string> = {
  feedback: "Feedback",
  ideas: "Ideas",
  uat: "UAT",
};

export type IntakeTemplate = {
  fields: DetailsFieldDef<IntakeFieldKey>[];
};

/** Type-aware field descriptors for create, review, and detail readout. */
export function intakeTemplate(type: RequestType): IntakeTemplate {
  switch (type) {
    case "broken":
      return {
        fields: intakeFields({
          situationLabel: "What happened",
          situationPlaceholder: "What you were doing when it failed.",
          expectedVisible: true,
          expectedRequired: true,
          reproVisible: true,
          reproRequired: true,
          correlationVisible: true,
          environmentRequired: true,
          impactRequired: true,
        }),
      };
    case "question":
      return {
        fields: intakeFields({
          situationLabel: "Goal and what you already tried",
          situationPlaceholder:
            "What you want to accomplish, and which docs or menus you already checked.",
          expectedVisible: false,
          expectedRequired: false,
          reproVisible: false,
          reproRequired: false,
          correlationVisible: false,
          environmentRequired: false,
          impactRequired: false,
        }),
      };
    case "access":
      return {
        fields: intakeFields({
          situationLabel: "Access needed and business reason",
          situationPlaceholder:
            "Which system or role you need, and why. Do not paste passwords or tokens.",
          expectedVisible: false,
          expectedRequired: false,
          reproVisible: false,
          reproRequired: false,
          correlationVisible: false,
          environmentRequired: false,
          impactRequired: false,
        }),
      };
    case "general":
      return {
        fields: intakeFields({
          situationLabel: "Situation",
          situationPlaceholder: "Describe the help you need.",
          expectedVisible: true,
          expectedRequired: false,
          reproVisible: false,
          reproRequired: false,
          correlationVisible: false,
          environmentRequired: false,
          impactRequired: false,
        }),
      };
    default: {
      const _exhaustive: never = type;
      return _exhaustive;
    }
  }
}

type IntakeVisibility = {
  situationLabel: string;
  situationPlaceholder: string;
  expectedVisible: boolean;
  expectedRequired: boolean;
  reproVisible: boolean;
  reproRequired: boolean;
  correlationVisible: boolean;
  environmentRequired: boolean;
  impactRequired: boolean;
};

function intakeFields(
  flags: IntakeVisibility,
): DetailsFieldDef<IntakeFieldKey>[] {
  return [
    {
      key: "summary",
      control: "text",
      label: "Brief summary",
      required: true,
      visible: true,
    },
    {
      key: "situation",
      control: "textarea",
      label: flags.situationLabel,
      placeholder: flags.situationPlaceholder,
      rows: 4,
      required: true,
      visible: true,
    },
    {
      key: "expected",
      control: "textarea",
      label: "Expected behavior",
      placeholder: "What should have happened instead?",
      rows: 2,
      required: flags.expectedRequired,
      visible: flags.expectedVisible,
    },
    {
      key: "reproSteps",
      control: "textarea",
      label: "Steps to reproduce",
      placeholder: "1. … 2. … 3. …",
      rows: 4,
      required: flags.reproRequired,
      visible: flags.reproVisible,
    },
    {
      key: "correlationId",
      control: "text",
      label: "Correlation / error ID",
      placeholder: "Request ID, error code, or job ID",
      required: false,
      visible: flags.correlationVisible,
    },
    {
      key: "impactScope",
      control: "select",
      label: "Who is affected",
      required: flags.impactRequired,
      visible: true,
      clearable: true,
      options: impactScopes.map((value) => ({
        value,
        label: impactScopeLabels[value],
      })),
      section: flags.impactRequired ? "Impact and urgency" : undefined,
      sectionDescription: flags.impactRequired
        ? "Handlers use these to set priority. You do not pick a priority."
        : undefined,
    },
    {
      key: "urgency",
      control: "select",
      label: "How soon is work blocked",
      required: flags.impactRequired,
      visible: true,
      clearable: true,
      options: urgencies.map((value) => ({
        value,
        label: urgencyLabels[value],
      })),
    },
    {
      key: "impact",
      control: "textarea",
      label: "Impact detail",
      placeholder: "Workaround, deadline, or headcount if you know them.",
      rows: 2,
      required: false,
      visible: true,
    },
    {
      key: "environment",
      control: "text",
      label: "Version or environment",
      placeholder: flags.environmentRequired
        ? "prod · Chrome 129 · when it started"
        : "Optional: prod · Chrome 129 · when it occurred",
      required: flags.environmentRequired,
      visible: true,
    },
  ];
}

/** Always above the fold when visible — short fields handlers scan first. */
const alwaysPrimaryKeys: IntakeFieldKey[] = [
  "summary",
  "situation",
  "correlationId",
];

/** Required / core fields stay visible; the rest belong behind optional disclosure. */
export function intakeFormSections(type: RequestType): {
  primary: DetailsFieldDef<IntakeFieldKey>[];
  optional: DetailsFieldDef<IntakeFieldKey>[];
} {
  const fields = intakeTemplate(type).fields.filter(
    (field) => field.visible && field.key !== "requestType",
  );
  const primary = fields.filter(
    (field) => field.required || alwaysPrimaryKeys.includes(field.key),
  );
  const optional = fields.filter(
    (field) => !primary.some((item) => item.key === field.key),
  );
  return { primary, optional };
}

export function intakeHint(type: RequestType): string {
  switch (type) {
    case "broken":
      return "Broken reports need repro steps and environment details. You do not set priority.";
    case "question":
      return "Say what you want to do and what you already tried. You do not set priority.";
    case "access":
      return "Describe the access and business reason. Sending does not grant access.";
    case "general":
      return "Describe the help you need. Product wishes, praise, and UAT defects belong elsewhere.";
    default: {
      const _exhaustive: never = type;
      return _exhaustive;
    }
  }
}

/** Compatibility shim for callers that still read visibility flags. */
export function intakeCopy(type: RequestType) {
  const template = intakeTemplate(type);
  const byKey = Object.fromEntries(
    template.fields.map((field) => [field.key, field]),
  ) as Record<IntakeFieldKey, DetailsFieldDef<IntakeFieldKey>>;

  return {
    situationLabel: byKey.situation.label,
    situationPlaceholder: byKey.situation.placeholder ?? "",
    expectedVisible: byKey.expected.visible,
    expectedRequired: byKey.expected.required,
    reproVisible: byKey.reproSteps.visible,
    reproRequired: byKey.reproSteps.required,
    correlationVisible: byKey.correlationId.visible,
    environmentRequired: byKey.environment.required,
    impactRequired: byKey.impactScope.required,
  };
}

export function formatIntakeValue(
  key: IntakeFieldKey,
  values: Omit<SupportContext, "attachments">,
): string {
  switch (key) {
    case "impactScope":
      return values.impactScope ? impactScopeLabels[values.impactScope] : "";
    case "urgency":
      return values.urgency ? urgencyLabels[values.urgency] : "";
    case "requestType":
      return values.requestType;
    case "summary":
    case "situation":
    case "expected":
    case "impact":
    case "environment":
    case "reproSteps":
    case "correlationId":
      return values[key];
    default: {
      const _exhaustive: never = key;
      return _exhaustive;
    }
  }
}

/** Read-only rows for Initial context / review — omits type-hidden fields. */
export function intakeReadoutRows(
  values: Omit<SupportContext, "attachments">,
  options?: { includeSummary?: boolean },
): DetailsReadoutRow[] {
  const template = intakeTemplate(values.requestType);
  return template.fields
    .filter((field) => {
      if (!field.visible) return false;
      if (field.key === "requestType") return false;
      if (field.key === "summary" && !options?.includeSummary) return false;
      return true;
    })
    .map((field) => ({
      label: field.label,
      value: formatIntakeValue(field.key, values),
    }));
}

export function validateIntake(
  values: Omit<SupportContext, "attachments">,
): Partial<Record<IntakeFieldKey, string>> {
  const copy = intakeCopy(values.requestType);
  const errors: Partial<Record<IntakeFieldKey, string>> = {};

  if (!values.summary.trim()) {
    errors.summary = "Enter a brief summary.";
  }
  if (!values.situation.trim()) {
    errors.situation =
      values.requestType === "question"
        ? "Describe your goal and what you already tried."
        : values.requestType === "access"
          ? "Describe the access you need and why."
          : "Describe what you were trying to do and what happened.";
  }
  if (copy.expectedRequired && !values.expected.trim()) {
    errors.expected = "Say what should have happened instead.";
  }
  if (copy.reproRequired && !values.reproSteps.trim()) {
    errors.reproSteps =
      "List numbered steps so a handler can reproduce the failure.";
  }
  if (copy.environmentRequired && !values.environment.trim()) {
    errors.environment =
      "Add version or environment (for example production, browser, when it started).";
  }
  if (copy.impactRequired) {
    if (!values.impactScope) {
      errors.impactScope = "Say who is affected.";
    }
    if (!values.urgency) {
      errors.urgency = "Say how soon work is blocked.";
    }
  }
  return errors;
}
