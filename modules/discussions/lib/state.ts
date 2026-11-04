export const DEMO_AUTHOR = "you";
export const DISCUSSION_TITLE_MAX_LENGTH = 160;
export const DISCUSSION_BODY_MAX_LENGTH = 10000;
export const DISCUSSION_REPLY_MAX_LENGTH = 10000;
export const DISCUSSION_TITLE_LIMIT = DISCUSSION_TITLE_MAX_LENGTH;
export const DISCUSSION_TEXT_LIMIT = DISCUSSION_BODY_MAX_LENGTH;

export type DiscussionReply = {
  id: string;
  author: string;
  text: string;
  createdAt: string;
};

export type DiscussionThread = {
  id: string;
  projectId: string;
  title: string;
  body: string;
  author: string;
  createdAt: string;
  updatedAt: string;
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
  now = new Date().toISOString(),
): DiscussionThread | null {
  const title = draft.title.trim();
  const body = draft.body.trim();
  if (
    !title ||
    title.length > DISCUSSION_TITLE_MAX_LENGTH ||
    !body ||
    body.length > DISCUSSION_BODY_MAX_LENGTH
  )
    return null;
  return {
    id,
    projectId: draft.projectId,
    title,
    body,
    author: DEMO_AUTHOR,
    createdAt: now,
    updatedAt: now,
    replies: [],
  };
}

export function addDiscussionReply(
  thread: DiscussionThread,
  id: string,
  author: string,
  text: string,
  now = new Date().toISOString(),
): DiscussionThread | null {
  const reply = text.trim();
  const name = author.trim();
  if (!reply || reply.length > DISCUSSION_REPLY_MAX_LENGTH || !name)
    return null;
  return {
    ...thread,
    updatedAt: now,
    replies: [
      ...thread.replies,
      { id, author: name, text: reply, createdAt: now },
    ],
  };
}
