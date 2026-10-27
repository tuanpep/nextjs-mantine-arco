export type Application = {
  id: string;
  name: string;
  initials: string;
  owner: string;
  description: string;
};

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

export function getApplication(id: string): Application | undefined {
  return applications.find((application) => application.id === id);
}

export function applicationPath(id: string): string {
  return `/projects/${id}`;
}
