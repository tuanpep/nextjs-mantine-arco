import { Suspense } from "react";

import { GuideList } from "@/modules/guides/components/guide-list";
import { CollectionPageSkeleton } from "@/modules/ui/components/page-skeletons";

export default function Page({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  return (
    <Suspense fallback={<CollectionPageSkeleton withTabs={false} />}>
      <Content params={params} />
    </Suspense>
  );
}

async function Content({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  return <GuideList projectId={projectId} />;
}
