type NamedRecord = {
  id: string;
  projectId: string;
  title: string;
};

export const sessionKinds = [
  "bug",
  "help",
  "feature",
  "feedback",
  "guide",
  "discussion",
] as const;

export type SessionKind = (typeof sessionKinds)[number];

export type SessionRow = {
  id: string;
  title: string;
  href: string;
  kind: SessionKind;
};

export function sessionRows(
  projectId: string,
  source: {
    bugs: NamedRecord[];
    help: NamedRecord[];
    features: NamedRecord[];
    feedback: NamedRecord[];
    guides: NamedRecord[];
    discussions: NamedRecord[];
  },
): SessionRow[] {
  return [
    ...rows(source.bugs, projectId, "bug", "support/bugs"),
    ...rows(source.help, projectId, "help", "support/help"),
    ...rows(source.features, projectId, "feature", "ideas/features"),
    ...rows(source.feedback, projectId, "feedback", "ideas/feedback"),
    ...rows(source.guides, projectId, "guide", "guides"),
    ...rows(source.discussions, projectId, "discussion", "discussions"),
  ];
}

function rows(
  items: NamedRecord[],
  projectId: string,
  kind: SessionKind,
  section: string,
): SessionRow[] {
  return items
    .filter((item) => item.projectId === projectId)
    .map((item) => ({
      id: item.id,
      title: item.title,
      href: `/projects/${projectId}/${section}/${item.id}`,
      kind,
    }));
}
