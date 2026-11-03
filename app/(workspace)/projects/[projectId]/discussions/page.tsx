import { Suspense } from "react";

import { DiscussionList } from "@/modules/discussions/components/discussion-list";
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
  return <DiscussionList projectId={projectId} />;
}
