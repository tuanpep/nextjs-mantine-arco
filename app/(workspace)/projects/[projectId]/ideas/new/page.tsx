import { Suspense } from "react";
import { notFound } from "next/navigation";

import { IdeasForm } from "@/modules/projects/components/ideas-form";
import { getApplication } from "@/modules/projects/lib/applications";
import { FormPageSkeleton } from "@/modules/ui/components/page-skeletons";

export default function NewIdeaPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  return (
    <Suspense fallback={<FormPageSkeleton fields={4} />}>
      <NewIdeaContent params={params} />
    </Suspense>
  );
}

async function NewIdeaContent({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  if (!getApplication(projectId)) notFound();
  return <IdeasForm projectId={projectId} />;
}
