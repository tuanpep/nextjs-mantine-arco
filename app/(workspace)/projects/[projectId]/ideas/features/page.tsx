import { Suspense } from "react";

import { FeatureList } from "@/modules/feature-requests/components/feature-list";
import { CollectionPageSkeleton } from "@/modules/ui/components/page-skeletons";

export default function Page({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  return (
    <Suspense fallback={<CollectionPageSkeleton />}>
      <Content params={params} />
    </Suspense>
  );
}

async function Content({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  return <FeatureList projectId={projectId} />;
}
