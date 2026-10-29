import { Suspense } from "react";

import { SupportDetails } from "@/modules/support/components/support-details";
import { DetailPageSkeleton } from "@/modules/ui/components/page-skeletons";

export default function SupportDetailsPage({
  params,
}: {
  params: Promise<{ projectId: string; supportId: string }>;
}) {
  return (
    <Suspense fallback={<DetailPageSkeleton />}>
      <SupportDetailsContent params={params} />
    </Suspense>
  );
}

async function SupportDetailsContent({
  params,
}: {
  params: Promise<{ projectId: string; supportId: string }>;
}) {
  const { projectId, supportId } = await params;
  return <SupportDetails projectId={projectId} supportId={supportId} />;
}
