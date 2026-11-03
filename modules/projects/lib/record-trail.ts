import { applicationPath, type Application } from "./applications";

export function recordTrail(
  project: Application,
  projectsLabel: string,
  rest: { title: string; href: string }[],
) {
  return [
    { title: projectsLabel, href: "/" },
    { title: project.name, href: applicationPath(project.id) },
    ...rest,
  ];
}
