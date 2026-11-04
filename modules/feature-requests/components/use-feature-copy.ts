"use client";

import { useTranslations } from "next-intl";
import type { FeatureNoteAction, FeatureStatus } from "../lib/state";

export function useFeatureCopy() {
  const portal = useTranslations("Portal");
  const features = useTranslations("Features");
  return {
    status(status: FeatureStatus) {
      switch (status) {
        case "Submitted":
          return portal("statusSubmitted");
        case "Accepted":
          return portal("statusAccepted");
        case "Declined":
          return portal("statusDeclined");
      }
    },
    action(action: FeatureNoteAction) {
      switch (action) {
        case "comment":
          return features("note");
        case "accept":
          return portal("actionAccept");
        case "decline":
          return portal("actionDecline");
      }
    },
    note: features("note"),
  };
}
