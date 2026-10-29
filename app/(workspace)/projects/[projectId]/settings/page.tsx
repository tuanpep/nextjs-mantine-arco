import { Suspense } from "react";
import { notFound } from "next/navigation";

import { ProjectSettings } from "@/modules/projects/components/project-settings";
import { getApplication } from "@/modules/projects/lib/applications";
import { SettingsPageSkeleton } from "@/modules/ui/components/page-skeletons";

export default function ProjectSettingsPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  return (
    <Suspense fallback={<SettingsPageSkeleton />}>
      <SettingsContent params={params} />
    </Suspense>
  );
}

async function SettingsContent({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  if (!getApplication(projectId)) notFound();
  return <ProjectSettings projectId={projectId} />;
}
