import { bugFixtures } from "@/modules/bug-reports/lib/fixtures";
import type { BugReport } from "@/modules/bug-reports/lib/state";
import { discussionFixtures } from "@/modules/discussions/lib/fixtures";
import type { DiscussionThread } from "@/modules/discussions/lib/state";
import { featureFixtures } from "@/modules/feature-requests/lib/fixtures";
import type { FeatureRequest } from "@/modules/feature-requests/lib/state";
import { feedbackFixtures } from "@/modules/feedback/lib/fixtures";
import type { FeedbackItem } from "@/modules/feedback/lib/state";
import { guideFixtures } from "@/modules/guides/lib/fixtures";
import type { GuideArticle } from "@/modules/guides/lib/state";
import { helpFixtures } from "@/modules/help/lib/fixtures";
import type { HelpRequest } from "@/modules/help/lib/state";

import { maxSuffix } from "./ids";

export type PortalState = {
  bugs: BugReport[];
  help: HelpRequest[];
  features: FeatureRequest[];
  feedback: FeedbackItem[];
  guides: GuideArticle[];
  discussions: DiscussionThread[];
};

export type PortalSequences = {
  BUG: number;
  HELP: number;
  FEAT: number;
  FB: number;
  GUIDE: number;
  DISC: number;
  REPLY: number;
  MSG: number;
};

export function seedPortal(): PortalState {
  return {
    bugs: bugFixtures(),
    help: helpFixtures(),
    features: featureFixtures(),
    feedback: feedbackFixtures(),
    guides: guideFixtures(),
    discussions: discussionFixtures(),
  };
}

export function buildSequences(state: PortalState): PortalSequences {
  return {
    BUG: maxSuffix(
      "BUG",
      state.bugs.map((item) => item.id),
    ),
    HELP: maxSuffix(
      "HELP",
      state.help.map((item) => item.id),
    ),
    FEAT: maxSuffix(
      "FEAT",
      state.features.map((item) => item.id),
    ),
    FB: maxSuffix(
      "FB",
      state.feedback.map((item) => item.id),
    ),
    GUIDE: maxSuffix(
      "GUIDE",
      state.guides.map((item) => item.id),
    ),
    DISC: maxSuffix(
      "DISC",
      state.discussions.map((item) => item.id),
    ),
    REPLY: maxSuffix(
      "REPLY",
      state.discussions.flatMap((item) =>
        item.replies.map((reply) => reply.id),
      ),
    ),
    MSG: maxSuffix(
      "MSG",
      state.bugs.flatMap((item) => item.messages.map((message) => message.id)),
    ),
  };
}
