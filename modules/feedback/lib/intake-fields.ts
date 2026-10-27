import type { DetailsFieldDef, DetailsReadoutRow } from "@/lib/form-details";

export type FeedbackIntakeKey = "title" | "observation" | "context";

export const feedbackIntakeFields: DetailsFieldDef<FeedbackIntakeKey>[] = [
  {
    key: "title",
    control: "text",
    label: "Short title",
    required: true,
    visible: true,
  },
  {
    key: "observation",
    control: "textarea",
    label: "What you observed",
    placeholder: "Describe the experience in enough detail for a reviewer.",
    rows: 4,
    required: true,
    visible: true,
  },
  {
    key: "context",
    control: "textarea",
    label: "Context",
    placeholder:
      "Where you were, what you were trying to do, or when it happened.",
    rows: 2,
    required: false,
    visible: true,
  },
];

export function feedbackReadoutRows(values: {
  observation: string;
  context: string;
  nextActor: string;
}): DetailsReadoutRow[] {
  return [
    { label: "Observation", value: values.observation },
    { label: "Context", value: values.context },
    { label: "Next actor", value: values.nextActor },
  ];
}
