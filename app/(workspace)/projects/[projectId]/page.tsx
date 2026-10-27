import { notFound } from "next/navigation";
import { ProjectOverview } from "@/modules/projects/components/project-overview";
import { getApplication } from "@/modules/projects/lib/applications";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const application = getApplication(projectId);
  if (!application) notFound();
  return <ProjectOverview application={application} />;
}
