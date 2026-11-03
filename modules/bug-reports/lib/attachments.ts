export const bugAttachmentLimit = 5;
const bugAttachmentBytes = 10 * 1024 * 1024;
const bugAttachmentExtensions = [".png", ".jpg", ".jpeg", ".pdf"] as const;

export type BugAttachment = {
  name: string;
  sizeLabel: string;
  previewUrl?: string;
};

export type BugAttachmentError = "type" | "size" | "count";

export function acceptBugFiles(
  files: File[],
): { attachments: BugAttachment[] } | { error: BugAttachmentError } {
  if (files.length > bugAttachmentLimit) return { error: "count" };
  const attachments: BugAttachment[] = [];
  for (const file of files) {
    const issue = bugFileIssue(file);
    if (issue) return { error: issue };
    attachments.push({
      name: file.name.trim(),
      sizeLabel: formatFileSize(file.size),
    });
  }
  return { attachments };
}

export type BugFileKind = "image" | "pdf";

export function bugFileKind(name: string): BugFileKind | null {
  const lower = name.trim().toLowerCase();
  const extension = bugAttachmentExtensions.find((item) =>
    lower.endsWith(item),
  );
  switch (extension) {
    case ".png":
    case ".jpg":
    case ".jpeg":
      return "image";
    case ".pdf":
      return "pdf";
    case undefined:
      return null;
    default: {
      const neverExtension: never = extension;
      return neverExtension;
    }
  }
}

export function isImagePreviewUrl(value: string): boolean {
  return value.startsWith("blob:") || value.startsWith("data:image/");
}

export function bugFileIssue(file: File): BugAttachmentError | null {
  if (!bugFileKind(file.name)) return "type";
  if (file.size > bugAttachmentBytes) return "size";
  return null;
}

export function partitionBugFiles(
  current: File[],
  incoming: File[],
): { files: File[]; error: BugAttachmentError | null } {
  const files = [...current];
  let error: BugAttachmentError | null = null;
  for (const file of incoming) {
    if (files.length >= bugAttachmentLimit) {
      error ??= "count";
      break;
    }
    const issue = bugFileIssue(file);
    if (issue) {
      error ??= issue;
      continue;
    }
    const duplicate = files.some(
      (item) =>
        item.name === file.name &&
        item.size === file.size &&
        item.lastModified === file.lastModified,
    );
    if (duplicate) continue;
    files.push(file);
  }
  return { files, error };
}

export type BugUploadFile = {
  file: File;
  previewUrl?: string;
};

export function stageBugFiles(
  current: BugUploadFile[],
  incoming: File[],
): { files: BugUploadFile[]; error: BugAttachmentError | null } {
  const next = partitionBugFiles(
    current.map((item) => item.file),
    incoming,
  );
  const files = next.files.map((file) => {
    const existing = current.find((item) => item.file === file);
    if (existing) return existing;
    return {
      file,
      previewUrl:
        bugFileKind(file.name) === "image"
          ? URL.createObjectURL(file)
          : undefined,
    };
  });
  for (const item of current) {
    if (
      !item.previewUrl ||
      files.some((nextFile) => nextFile.file === item.file)
    ) {
      continue;
    }
    URL.revokeObjectURL(item.previewUrl);
  }
  return { files, error: next.error };
}

export function bugAttachmentMessage(
  error: BugAttachmentError,
  copy: { type: string; size: string; count: string },
): string {
  switch (error) {
    case "type":
      return copy.type;
    case "size":
      return copy.size;
    case "count":
      return copy.count;
    default: {
      const neverError: never = error;
      return neverError;
    }
  }
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
