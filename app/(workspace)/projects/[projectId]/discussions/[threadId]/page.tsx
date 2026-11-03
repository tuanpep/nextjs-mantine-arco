import { Suspense } from "react";

import { DiscussionDetail } from "@/modules/discussions/components/discussion-detail";
import { DetailPageSkeleton } from "@/modules/ui/components/page-skeletons";

export default function Page({
  params,
}: {
  params: Promise<{ projectId: string; threadId: string }>;
}) {
  return (
    <Suspense fallback={<DetailPageSkeleton />}>
      <Content params={params} />
    </Suspense>
  );
}

async function Content({
  params,
}: {
  params: Promise<{ projectId: string; threadId: string }>;
}) {
  const { projectId, threadId } = await params;
  return <DiscussionDetail projectId={projectId} threadId={threadId} />;
}
