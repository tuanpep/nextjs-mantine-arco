"use client";

import { useUnsavedDraft } from "@/modules/ui/components/use-unsaved-draft";

export function useDiscussionDraft(dirty: boolean, message: string) {
  useUnsavedDraft(dirty, message);
}
