import { getApplication } from "./applications";

export const responsibilityFields = [
  { key: "supportHandler", label: "Người xử lý hỗ trợ", module: "Hỗ trợ" },
  {
    key: "feedbackReviewer",
    label: "Người xem xét phản hồi",
    module: "Phản hồi",
  },
  { key: "ideaReviewer", label: "Người xem xét ý tưởng", module: "Ý tưởng" },
  {
    key: "uatCoordinator",
    label: "Người điều phối kiểm thử nghiệm thu",
    module: "Kiểm thử nghiệm thu",
  },
] as const;

export type ResponsibilityReferences = Record<
  (typeof responsibilityFields)[number]["key"],
  string
>;

export function getRegistryReferences(
  projectId: string,
): ResponsibilityReferences | undefined {
  if (!getApplication(projectId)) return undefined;
  return {
    supportHandler: "Minh Pham",
    feedbackReviewer: "Lan Vo",
    ideaReviewer: "Lan Vo",
    uatCoordinator: "Hoa Nguyen",
  };
}

export function referencesEqual(
  left: ResponsibilityReferences,
  right: ResponsibilityReferences,
): boolean {
  return responsibilityFields.every(({ key }) => left[key] === right[key]);
}
