import type { DetailsFieldDef } from "@/lib/form-details";

export type IdeaIntakeKey =
  "title" | "problem" | "outcome" | "suggestedChange" | "sponsorCandidate";

export const ideaRequiredFields: DetailsFieldDef<IdeaIntakeKey>[] = [
  {
    key: "title",
    control: "text",
    label: "Title",
    required: true,
    visible: true,
  },
  {
    key: "problem",
    control: "textarea",
    label: "Problem",
    placeholder: "What is hard today, and for whom.",
    rows: 3,
    required: true,
    visible: true,
  },
  {
    key: "outcome",
    control: "textarea",
    label: "Desired outcome",
    placeholder: "What good looks like if this idea is pursued.",
    rows: 2,
    required: true,
    visible: true,
  },
];

export const ideaOptionalFields: DetailsFieldDef<IdeaIntakeKey>[] = [
  {
    key: "suggestedChange",
    control: "textarea",
    label: "Suggested change",
    rows: 2,
    required: false,
    visible: true,
  },
  {
    key: "sponsorCandidate",
    control: "text",
    label: "Sponsor candidate",
    placeholder:
      "Naming a person does not make them approve or fund this idea.",
    required: false,
    visible: true,
  },
];

/** @deprecated Prefer ideaRequiredFields + ideaOptionalFields */
export const ideaIntakeFields: DetailsFieldDef<IdeaIntakeKey>[] = [
  ...ideaRequiredFields,
  ...ideaOptionalFields,
];
