export const DEMO_AUTHOR = "you";

export type DiscussionReply = {
  id: string;
  author: string;
  text: string;
};

export type DiscussionThread = {
  id: string;
  projectId: string;
  title: string;
  body: string;
  replies: DiscussionReply[];
};

export type DiscussionDraft = {
  projectId: string;
  title: string;
  body: string;
};

export function createDiscussionThread(
  id: string,
  draft: DiscussionDraft,
): DiscussionThread | null {
  const title = draft.title.trim();
  const body = draft.body.trim();
  if (!title || !body) return null;
  return { id, projectId: draft.projectId, title, body, replies: [] };
}

export function addDiscussionReply(
  thread: DiscussionThread,
  id: string,
  author: string,
  text: string,
): DiscussionThread | null {
  const reply = text.trim();
  const name = author.trim();
  if (!reply || !name) return null;
  return {
    ...thread,
    replies: [...thread.replies, { id, author: name, text: reply }],
  };
}
