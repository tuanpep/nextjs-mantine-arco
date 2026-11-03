import { Suspense } from "react";

import { GuideDetail } from "@/modules/guides/components/guide-detail";
import { DetailPageSkeleton } from "@/modules/ui/components/page-skeletons";

export default function Page({
  params,
}: {
  params: Promise<{ projectId: string; guideId: string }>;
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
  params: Promise<{ projectId: string; guideId: string }>;
}) {
  const { projectId, guideId } = await params;
  return <GuideDetail projectId={projectId} guideId={guideId} />;
}
