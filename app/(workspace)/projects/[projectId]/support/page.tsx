import { Suspense } from "react";

import { SupportCollection } from "@/modules/support/components/support-collection";
import { CollectionPageSkeleton } from "@/modules/ui/components/page-skeletons";

export default function SupportPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  return (
    <Suspense fallback={<CollectionPageSkeleton />}>
      <SupportContent params={params} />
    </Suspense>
  );
}

async function SupportContent({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  return <SupportCollection projectId={projectId} />;
}
