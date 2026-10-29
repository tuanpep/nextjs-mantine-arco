import { Suspense } from "react";
import { notFound } from "next/navigation";

import { IdeasScreen } from "@/modules/projects/components/ideas-screen";
import { getApplication } from "@/modules/projects/lib/applications";
import { CollectionPageSkeleton } from "@/modules/ui/components/page-skeletons";

export default function IdeasPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  return (
    <Suspense
      fallback={
        <CollectionPageSkeleton
          tabCount={3}
          withStatus={false}
          withDescription={false}
        />
      }
    >
      <IdeasContent params={params} />
    </Suspense>
  );
}

async function IdeasContent({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  if (!getApplication(projectId)) notFound();
  return <IdeasScreen projectId={projectId} />;
}
