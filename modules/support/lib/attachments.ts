export const evidenceStatuses = [
  "Selected",
  "Uploading",
  "Scanning",
  "Ready",
  "Rejected",
  "Failed",
] as const;
export type EvidenceStatus = (typeof evidenceStatuses)[number];

export const evidenceStatusLabels: Record<EvidenceStatus, string> = {
  Selected: "Đã chọn",
  Uploading: "Đang tải lên",
  Scanning: "Đang quét",
  Ready: "Sẵn sàng",
  Rejected: "Bị từ chối",
  Failed: "Thất bại",
};

export type EvidenceAttachment = {
  id: string;
  name: string;
  sizeLabel: string;
  status: EvidenceStatus;
  error?: string;
};

export const evidencePolicy =
  "PNG, JPG hoặc PDF · tối đa 5 tệp · mỗi tệp tối đa 10 MB · được quét trước khi tải xuống.";

const allowedExtensions = [".png", ".jpg", ".jpeg", ".pdf"];

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function validateEvidenceFile(file: File): string | null {
  const lower = file.name.toLowerCase();
  if (!allowedExtensions.some((ext) => lower.endsWith(ext))) {
    return "Chỉ chấp nhận tệp PNG, JPG hoặc PDF.";
  }
  if (file.size > 10 * 1024 * 1024) {
    return "Mỗi tệp không được vượt quá 10 MB.";
  }
  return null;
}

/** Demo-only: advances Selected → Uploading → Scanning → Ready without a backend. */
export function advanceEvidenceStatus(status: EvidenceStatus): EvidenceStatus {
  switch (status) {
    case "Selected":
      return "Uploading";
    case "Uploading":
      return "Scanning";
    case "Scanning":
      return "Ready";
    case "Ready":
    case "Rejected":
    case "Failed":
      return status;
    default: {
      const _exhaustive: never = status;
      return _exhaustive;
    }
  }
}
