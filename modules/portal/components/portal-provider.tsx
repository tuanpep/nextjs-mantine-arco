"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";

import {
  addBugMessage,
  applyBugTransition,
  createBugReport,
  type BugDraft,
  type BugReport,
  type BugTransition,
} from "@/modules/bug-reports/lib/state";
import {
  addDiscussionReply,
  createDiscussionThread,
  DEMO_AUTHOR,
  type DiscussionDraft,
  type DiscussionThread,
} from "@/modules/discussions/lib/state";
import {
  applyFeatureTransition,
  createFeatureRequest,
  type FeatureDraft,
  type FeatureRequest,
  type FeatureTransition,
} from "@/modules/feature-requests/lib/state";
import {
  applyFeedbackReview,
  createFeedbackItem,
  type FeedbackDraft,
  type FeedbackItem,
} from "@/modules/feedback/lib/state";
import {
  createGuideArticle,
  type GuideArticle,
  type GuideDraft,
} from "@/modules/guides/lib/state";
import {
  applyHelpTransition,
  createHelpRequest,
  type HelpDraft,
  type HelpRequest,
  type HelpTransition,
} from "@/modules/help/lib/state";

import { nextId } from "../lib/ids";
import {
  buildSequences,
  seedPortal,
  type PortalSequences,
  type PortalState,
} from "../lib/seed";

type PortalContextValue = PortalState & {
  createBug: (draft: BugDraft) => BugReport | null;
  transitionBug: (projectId: string, id: string, action: BugTransition) => void;
  addBugMessage: (projectId: string, id: string, text: string) => void;
  createHelp: (draft: HelpDraft) => HelpRequest | null;
  transitionHelp: (
    projectId: string,
    id: string,
    action: HelpTransition,
  ) => void;
  createFeature: (draft: FeatureDraft) => FeatureRequest | null;
  transitionFeature: (
    projectId: string,
    id: string,
    action: FeatureTransition,
  ) => void;
  createFeedback: (draft: FeedbackDraft) => FeedbackItem | null;
  reviewFeedback: (projectId: string, id: string, note: string) => void;
  createGuide: (draft: GuideDraft) => GuideArticle | null;
  createDiscussion: (draft: DiscussionDraft) => DiscussionThread | null;
  replyToDiscussion: (projectId: string, id: string, text: string) => void;
};

const PortalContext = createContext<PortalContextValue | null>(null);

export function PortalProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState(seedPortal);
  const sequences = useRef<PortalSequences | null>(null);
  if (sequences.current === null) {
    sequences.current = buildSequences(seedPortal());
  }

  const createBug = useCallback((draft: BugDraft) => {
    const current = sequences.current;
    if (!current) return null;
    const record = createBugReport(nextId("BUG", current.BUG), draft);
    if (!record) return null;
    current.BUG += 1;
    setState((previous) => ({
      ...previous,
      bugs: [record, ...previous.bugs],
    }));
    return record;
  }, []);

  const postBugMessage = useCallback(
    (projectId: string, id: string, text: string) => {
      const message = text.trim();
      const current = sequences.current;
      if (!current || !message) return;
      const messageId = nextId("MSG", current.MSG);
      current.MSG += 1;
      setState((previous) => ({
        ...previous,
        bugs: previous.bugs.map((item) => {
          if (item.id !== id || item.projectId !== projectId) return item;
          return addBugMessage(item, messageId, message) ?? item;
        }),
      }));
    },
    [],
  );

  const transitionBug = useCallback(
    (projectId: string, id: string, action: BugTransition) => {
      setState((previous) => ({
        ...previous,
        bugs: previous.bugs.map((item) => {
          if (item.id !== id || item.projectId !== projectId) return item;
          return applyBugTransition(item, action) ?? item;
        }),
      }));
    },
    [],
  );

  const createHelp = useCallback((draft: HelpDraft) => {
    const current = sequences.current;
    if (!current) return null;
    const record = createHelpRequest(nextId("HELP", current.HELP), draft);
    if (!record) return null;
    current.HELP += 1;
    setState((previous) => ({
      ...previous,
      help: [record, ...previous.help],
    }));
    return record;
  }, []);

  const transitionHelp = useCallback(
    (projectId: string, id: string, action: HelpTransition) => {
      setState((previous) => ({
        ...previous,
        help: previous.help.map((item) => {
          if (item.id !== id || item.projectId !== projectId) return item;
          return applyHelpTransition(item, action) ?? item;
        }),
      }));
    },
    [],
  );

  const createFeature = useCallback((draft: FeatureDraft) => {
    const current = sequences.current;
    if (!current) return null;
    const record = createFeatureRequest(nextId("FEAT", current.FEAT), draft);
    if (!record) return null;
    current.FEAT += 1;
    setState((previous) => ({
      ...previous,
      features: [record, ...previous.features],
    }));
    return record;
  }, []);

  const transitionFeature = useCallback(
    (projectId: string, id: string, action: FeatureTransition) => {
      setState((previous) => ({
        ...previous,
        features: previous.features.map((item) => {
          if (item.id !== id || item.projectId !== projectId) return item;
          return applyFeatureTransition(item, action) ?? item;
        }),
      }));
    },
    [],
  );

  const createFeedback = useCallback((draft: FeedbackDraft) => {
    const current = sequences.current;
    if (!current) return null;
    const record = createFeedbackItem(nextId("FB", current.FB), draft);
    if (!record) return null;
    current.FB += 1;
    setState((previous) => ({
      ...previous,
      feedback: [record, ...previous.feedback],
    }));
    return record;
  }, []);

  const reviewFeedback = useCallback(
    (projectId: string, id: string, note: string) => {
      setState((previous) => ({
        ...previous,
        feedback: previous.feedback.map((item) => {
          if (item.id !== id || item.projectId !== projectId) return item;
          return applyFeedbackReview(item, note) ?? item;
        }),
      }));
    },
    [],
  );

  const createGuide = useCallback((draft: GuideDraft) => {
    const current = sequences.current;
    if (!current) return null;
    const record = createGuideArticle(nextId("GUIDE", current.GUIDE), draft);
    if (!record) return null;
    current.GUIDE += 1;
    setState((previous) => ({
      ...previous,
      guides: [record, ...previous.guides],
    }));
    return record;
  }, []);

  const createDiscussion = useCallback((draft: DiscussionDraft) => {
    const current = sequences.current;
    if (!current) return null;
    const record = createDiscussionThread(nextId("DISC", current.DISC), draft);
    if (!record) return null;
    current.DISC += 1;
    setState((previous) => ({
      ...previous,
      discussions: [record, ...previous.discussions],
    }));
    return record;
  }, []);

  const replyToDiscussion = useCallback(
    (projectId: string, id: string, text: string) => {
      const current = sequences.current;
      const reply = text.trim();
      if (!current || !reply) return;
      const replyId = nextId("REPLY", current.REPLY);
      current.REPLY += 1;
      setState((previous) => ({
        ...previous,
        discussions: previous.discussions.map((item) => {
          if (item.id !== id || item.projectId !== projectId) return item;
          return addDiscussionReply(item, replyId, DEMO_AUTHOR, reply) ?? item;
        }),
      }));
    },
    [],
  );

  return (
    <PortalContext.Provider
      value={{
        ...state,
        createBug,
        transitionBug,
        addBugMessage: postBugMessage,
        createHelp,
        transitionHelp,
        createFeature,
        transitionFeature,
        createFeedback,
        reviewFeedback,
        createGuide,
        createDiscussion,
        replyToDiscussion,
      }}
    >
      {children}
    </PortalContext.Provider>
  );
}

export function usePortal() {
  const value = useContext(PortalContext);
  if (!value) throw new Error("PortalProvider is missing");
  return value;
}
