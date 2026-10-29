import { Suspense } from "react";
import { notFound } from "next/navigation";

import { ProjectHub } from "@/modules/projects/components/project-hub";
import { getApplication } from "@/modules/projects/lib/applications";
import { OverviewPageSkeleton } from "@/modules/ui/components/page-skeletons";

export default function ProjectPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  return (
    <Suspense fallback={<OverviewPageSkeleton />}>
      <ProjectOverview params={params} />
    </Suspense>
  );
}

async function ProjectOverview({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  if (!getApplication(projectId)) notFound();
  return <ProjectHub projectId={projectId} />;
}
