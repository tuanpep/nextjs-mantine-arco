import { Suspense } from "react";
import { notFound } from "next/navigation";

import { getApplication } from "@/modules/projects/lib/applications";
import { UatPageSkeleton } from "@/modules/ui/components/page-skeletons";
import { UatScreen } from "@/modules/uat/components/uat-screen";

export default function ProjectUatPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  return (
    <Suspense fallback={<UatPageSkeleton />}>
      <UatContent params={params} />
    </Suspense>
  );
}

async function UatContent({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  if (!getApplication(projectId)) notFound();
  return <UatScreen projectId={projectId} />;
}
