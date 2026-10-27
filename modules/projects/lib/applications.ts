export type Application = {
  id: string;
  name: string;
  initials: string;
  owner: string;
  description: string;
};

export const DEFAULT_PROJECT_ID = "beacon-portal";

export const applications: Application[] = [
  {
    id: "beacon-portal",
    name: "Beacon Portal",
    initials: "BP",
    owner: "Product Services",
    description: "Internal product access",
  },
  {
    id: "orchid-reports",
    name: "Orchid Reports",
    initials: "OR",
    owner: "Business Analytics",
    description: "Reporting and scheduled exports",
  },
];

const PROJECT_SECTIONS = [
  "support",
  "feedback",
  "ideas",
  "uat",
  "settings",
] as const;

export type ProjectSection = (typeof PROJECT_SECTIONS)[number];

export function getApplication(id: string): Application | undefined {
  return applications.find((application) => application.id === id);
}

export function applicationPath(id: string): string {
  return `/projects/${id}`;
}

export function projectSupportPath(id: string): string {
  return `/projects/${id}/support`;
}

export function projectSectionFromPath(pathname: string): ProjectSection {
  const match = pathname.match(/^\/projects\/[^/]+\/([^/]+)/);
  const section = match?.[1];
  if (
    section &&
    (PROJECT_SECTIONS as readonly string[]).includes(section)
  ) {
    return section as ProjectSection;
  }
  return "support";
}

export function projectSectionPath(id: string, pathname: string): string {
  const section = projectSectionFromPath(pathname);
  return `/projects/${id}/${section}`;
}
