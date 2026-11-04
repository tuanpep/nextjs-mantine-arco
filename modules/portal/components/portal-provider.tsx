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
  DISCUSSION_TEXT_LIMIT,
  type DiscussionDraft,
  type DiscussionThread,
} from "@/modules/discussions/lib/state";
import {
  addFeatureNote,
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
import { addRecentRecord, type RecordReference } from "../lib/recent-records";
import {
  buildSequences,
  seedPortal,
  type PortalSequences,
  type PortalState,
} from "../lib/seed";

type PortalContextValue = PortalState & {
  recentRecords: RecordReference[];
  recordVisit: (reference: RecordReference) => void;
  createBug: (draft: BugDraft) => BugReport | null;
  transitionBug: (
    projectId: string,
    id: string,
    action: BugTransition,
  ) => boolean;
  addBugMessage: (projectId: string, id: string, text: string) => boolean;
  createHelp: (draft: HelpDraft) => HelpRequest | null;
  transitionHelp: (
    projectId: string,
    id: string,
    action: HelpTransition,
  ) => boolean;
  createFeature: (draft: FeatureDraft) => FeatureRequest | null;
  transitionFeature: (
    projectId: string,
    id: string,
    action: FeatureTransition,
  ) => boolean;
  addFeatureNote: (projectId: string, id: string, text: string) => boolean;
  createFeedback: (draft: FeedbackDraft) => FeedbackItem | null;
  reviewFeedback: (projectId: string, id: string, note: string) => boolean;
  createGuide: (draft: GuideDraft) => GuideArticle | null;
  createDiscussion: (draft: DiscussionDraft) => DiscussionThread | null;
  replyToDiscussion: (projectId: string, id: string, text: string) => boolean;
};

const PortalContext = createContext<PortalContextValue | null>(null);

export function PortalProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState(seedPortal);
  const [recentRecords, setRecentRecords] = useState<RecordReference[]>([]);
  const recordVisit = useCallback((reference: RecordReference) => {
    setRecentRecords((previous) => addRecentRecord(previous, reference));
  }, []);
  const bugs = useRef(state.bugs);
  const featuresRef = useRef(state.features);
  const feedbackRef = useRef(state.feedback);
  const help = useRef(state.help);
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
    const nextBugs = [record, ...bugs.current];
    bugs.current = nextBugs;
    setState((previous) => ({
      ...previous,
      bugs: nextBugs,
    }));
    return record;
  }, []);

  const postBugMessage = useCallback(
    (projectId: string, id: string, text: string) => {
      const current = sequences.current;
      const item = bugs.current.find(
        (entry) => entry.id === id && entry.projectId === projectId,
      );
      if (!current || !item) return false;
      const messageId = nextId("MSG", current.MSG);
      const updated = addBugMessage(item, messageId, text);
      if (!updated) return false;
      current.MSG += 1;
      const nextBugs = bugs.current.map((entry) =>
        entry === item ? updated : entry,
      );
      bugs.current = nextBugs;
      setState((previous) => ({
        ...previous,
        bugs: nextBugs,
      }));
      return true;
    },
    [],
  );

  const transitionBug = useCallback(
    (projectId: string, id: string, action: BugTransition) => {
      const item = bugs.current.find(
        (entry) => entry.id === id && entry.projectId === projectId,
      );
      if (!item) return false;
      const updated = applyBugTransition(item, action);
      if (!updated) return false;
      const nextBugs = bugs.current.map((entry) =>
        entry === item ? updated : entry,
      );
      bugs.current = nextBugs;
      setState((previous) => ({
        ...previous,
        bugs: nextBugs,
      }));
      return true;
    },
    [],
  );

  const createHelp = useCallback((draft: HelpDraft) => {
    const current = sequences.current;
    if (!current) return null;
    const record = createHelpRequest(nextId("HELP", current.HELP), draft);
    if (!record) return null;
    current.HELP += 1;
    const nextHelp = [record, ...help.current];
    help.current = nextHelp;
    setState((previous) => ({
      ...previous,
      help: nextHelp,
    }));
    return record;
  }, []);

  const transitionHelp = useCallback(
    (projectId: string, id: string, action: HelpTransition) => {
      const item = help.current.find(
        (entry) => entry.id === id && entry.projectId === projectId,
      );
      if (!item) return false;
      const updated = applyHelpTransition(item, action);
      if (!updated) return false;
      const nextHelp = help.current.map((entry) =>
        entry === item ? updated : entry,
      );
      help.current = nextHelp;
      setState((previous) => ({
        ...previous,
        help: nextHelp,
      }));
      return true;
    },
    [],
  );

  const createFeature = useCallback((draft: FeatureDraft) => {
    const current = sequences.current;
    if (!current) return null;
    const record = createFeatureRequest(nextId("FEAT", current.FEAT), draft);
    if (!record) return null;
    current.FEAT += 1;
    featuresRef.current = [record, ...featuresRef.current];
    setState((previous) => ({
      ...previous,
      features: [record, ...previous.features],
    }));
    return record;
  }, []);

  const transitionFeature = useCallback(
    (projectId: string, id: string, action: FeatureTransition) => {
      const item = featuresRef.current.find(
        (entry) => entry.id === id && entry.projectId === projectId,
      );
      if (!item) return false;
      const updated = applyFeatureTransition(item, action);
      if (!updated) return false;
      featuresRef.current = featuresRef.current.map((entry) =>
        entry === item ? updated : entry,
      );
      setState((previous) => ({
        ...previous,
        features: previous.features.map((entry) =>
          entry.id === id && entry.projectId === projectId ? updated : entry,
        ),
      }));
      return true;
    },
    [],
  );

  const postFeatureNote = useCallback(
    (projectId: string, id: string, text: string) => {
      const item = featuresRef.current.find(
        (entry) => entry.id === id && entry.projectId === projectId,
      );
      if (!item) return false;
      const updated = addFeatureNote(item, text);
      if (!updated) return false;
      featuresRef.current = featuresRef.current.map((entry) =>
        entry === item ? updated : entry,
      );
      setState((previous) => ({
        ...previous,
        features: previous.features.map((entry) =>
          entry.id === id && entry.projectId === projectId ? updated : entry,
        ),
      }));
      return true;
    },
    [],
  );

  const createFeedback = useCallback((draft: FeedbackDraft) => {
    const current = sequences.current;
    if (!current) return null;
    const record = createFeedbackItem(nextId("FB", current.FB), draft);
    if (!record) return null;
    current.FB += 1;
    const nextFeedback = [record, ...feedbackRef.current];
    feedbackRef.current = nextFeedback;
    setState((previous) => ({
      ...previous,
      feedback: nextFeedback,
    }));
    return record;
  }, []);

  const reviewFeedback = useCallback(
    (projectId: string, id: string, note: string) => {
      const item = feedbackRef.current.find(
        (entry) => entry.id === id && entry.projectId === projectId,
      );
      if (!item) return false;
      const updated = applyFeedbackReview(item, note);
      if (!updated) return false;
      const nextFeedback = feedbackRef.current.map((entry) =>
        entry === item ? updated : entry,
      );
      feedbackRef.current = nextFeedback;
      setState((previous) => ({ ...previous, feedback: nextFeedback }));
      return true;
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
      if (
        !current ||
        !reply ||
        reply.length > DISCUSSION_TEXT_LIMIT ||
        !state.discussions.some(
          (item) => item.id === id && item.projectId === projectId,
        )
      )
        return false;
      const replyId = nextId("REPLY", current.REPLY);
      current.REPLY += 1;
      setState((previous) => ({
        ...previous,
        discussions: previous.discussions.map((item) => {
          if (item.id !== id || item.projectId !== projectId) return item;
          return addDiscussionReply(item, replyId, DEMO_AUTHOR, reply) ?? item;
        }),
      }));
      return true;
    },
    [state.discussions],
  );

  return (
    <PortalContext.Provider
      value={{
        ...state,
        recentRecords,
        recordVisit,
        createBug,
        transitionBug,
        addBugMessage: postBugMessage,
        createHelp,
        transitionHelp,
        createFeature,
        transitionFeature,
        addFeatureNote: postFeatureNote,
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
