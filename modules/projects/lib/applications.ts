export type Application = {
  id: string;
  name: string;
  initials: string;
  owner: string;
  descriptionKey: "beaconDescription" | "orchidDescription";
};

export const DEFAULT_PROJECT_ID = "beacon-portal";

export const applications: Application[] = [
  {
    id: "beacon-portal",
    name: "Beacon Portal",
    initials: "BP",
    owner: "Product Services",
    descriptionKey: "beaconDescription",
  },
  {
    id: "orchid-reports",
    name: "Orchid Reports",
    initials: "OR",
    owner: "Business Analytics",
    descriptionKey: "orchidDescription",
  },
];

const PROJECT_SECTIONS = [
  "support/bugs",
  "support/help",
  "ideas/features",
  "ideas/feedback",
  "guides",
  "discussions",
] as const;

export type ProjectSection = (typeof PROJECT_SECTIONS)[number] | "overview";

export function getApplication(id: string): Application | undefined {
  return applications.find((application) => application.id === id);
}

export function applicationPath(id: string): string {
  return `/projects/${id}`;
}

export function projectSectionFromPath(pathname: string): ProjectSection {
  const match = pathname.match(/^\/projects\/[^/]+(?:\/(.*))?$/);
  const rest = match?.[1];
  if (!rest) return "overview";
  const section = PROJECT_SECTIONS.find(
    (item) => rest === item || rest.startsWith(`${item}/`),
  );
  return section ?? "overview";
}

export function projectSectionPath(id: string, pathname: string): string {
  const section = projectSectionFromPath(pathname);
  if (section === "overview") return applicationPath(id);
  return `/projects/${id}/${section}`;
}
