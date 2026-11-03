export type GuideArticle = {
  id: string;
  projectId: string;
  title: string;
  summary: string;
  body: string;
};

export type GuideDraft = {
  projectId: string;
  title: string;
  summary: string;
  body: string;
};

export function createGuideArticle(
  id: string,
  draft: GuideDraft,
): GuideArticle | null {
  const title = draft.title.trim();
  const summary = draft.summary.trim();
  const body = draft.body.trim();
  if (!title || !summary || !body) return null;
  return { id, projectId: draft.projectId, title, summary, body };
}
