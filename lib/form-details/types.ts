export type DetailsControl = "text" | "textarea" | "select";

export type DetailsFieldDef<K extends string = string> = {
  key: K;
  control: DetailsControl;
  label: string;
  placeholder?: string;
  rows?: number;
  required: boolean;
  visible: boolean;
  options?: { value: string; label: string }[];
  clearable?: boolean;
  /** Inserted once before this field when rendering a form. */
  section?: string;
  sectionDescription?: string;
};

export type DetailsReadoutRow = {
  label: string;
  value: string;
};
