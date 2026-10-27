export const evidenceStatuses = [
  "Selected",
  "Uploading",
  "Scanning",
  "Ready",
  "Rejected",
  "Failed",
] as const;
export type EvidenceStatus = (typeof evidenceStatuses)[number];

export type EvidenceAttachment = {
  id: string;
  name: string;
  sizeLabel: string;
  status: EvidenceStatus;
};

export const evidencePolicy =
  "PNG, JPG, or PDF · up to 5 files · 10 MB each · scanned before anyone can download.";

const allowedExtensions = [".png", ".jpg", ".jpeg", ".pdf"];

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function validateEvidenceFile(file: File): string | null {
  const lower = file.name.toLowerCase();
  if (!allowedExtensions.some((ext) => lower.endsWith(ext))) {
    return "Use PNG, JPG, or PDF only.";
  }
  if (file.size > 10 * 1024 * 1024) {
    return "Each file must be 10 MB or smaller.";
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
