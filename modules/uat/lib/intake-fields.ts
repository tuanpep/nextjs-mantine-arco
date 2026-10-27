import type { DetailsFieldDef, DetailsReadoutRow } from "@/lib/form-details";

export type UatDefectIntakeKey = "title" | "reproSteps" | "expected" | "actual";

/** Structured “more details” for UAT defects; joined into `details` on save. */
export const uatDefectIntakeFields: DetailsFieldDef<UatDefectIntakeKey>[] = [
  {
    key: "title",
    control: "text",
    label: "Defect summary",
    required: true,
    visible: true,
  },
  {
    key: "reproSteps",
    control: "textarea",
    label: "Steps to reproduce",
    placeholder: "Numbered steps using sample data, not personal information.",
    rows: 3,
    required: true,
    visible: true,
  },
  {
    key: "expected",
    control: "textarea",
    label: "Expected outcome",
    placeholder: "What should have happened for this scenario.",
    rows: 2,
    required: true,
    visible: true,
  },
  {
    key: "actual",
    control: "textarea",
    label: "What happened",
    placeholder: "What you observed instead.",
    rows: 3,
    required: true,
    visible: true,
  },
];

export function composeUatDetails(values: {
  reproSteps: string;
  expected: string;
  actual: string;
}): string {
  return [
    `Steps:\n${values.reproSteps.trim()}`,
    `Expected:\n${values.expected.trim()}`,
    `Actual:\n${values.actual.trim()}`,
  ].join("\n\n");
}

export function parseUatDetails(details: string): {
  reproSteps: string;
  expected: string;
  actual: string;
} | null {
  const match = details.match(
    /^Steps:\n([\s\S]*?)\n\nExpected:\n([\s\S]*?)\n\nActual:\n([\s\S]*)$/,
  );
  if (!match) return null;
  return {
    reproSteps: match[1] ?? "",
    expected: match[2] ?? "",
    actual: match[3] ?? "",
  };
}

export function uatDefectReadoutRows(details: string): DetailsReadoutRow[] {
  const parsed = parseUatDetails(details);
  if (!parsed) {
    return [{ label: "Steps and actual behavior", value: details }];
  }
  return [
    { label: "Steps to reproduce", value: parsed.reproSteps },
    { label: "Expected outcome", value: parsed.expected },
    { label: "What happened", value: parsed.actual },
  ];
}

export function validateUatDefectIntake(values: {
  title: string;
  reproSteps: string;
  expected: string;
  actual: string;
}): Partial<Record<UatDefectIntakeKey, string>> {
  const errors: Partial<Record<UatDefectIntakeKey, string>> = {};
  if (!values.title.trim()) {
    errors.title = "Enter a defect summary.";
  }
  if (!values.reproSteps.trim()) {
    errors.reproSteps = "List the steps to reproduce.";
  }
  if (!values.expected.trim()) {
    errors.expected = "Say what should have happened.";
  }
  if (!values.actual.trim()) {
    errors.actual = "Describe what happened instead.";
  }
  return errors;
}
