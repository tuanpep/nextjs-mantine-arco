import { Suspense } from "react";

import { FeedbackDetail } from "@/modules/feedback/components/feedback-detail";
import { DetailPageSkeleton } from "@/modules/ui/components/page-skeletons";

export default function Page({
  params,
}: {
  params: Promise<{ projectId: string; feedbackId: string }>;
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
  params: Promise<{ projectId: string; feedbackId: string }>;
}) {
  const { projectId, feedbackId } = await params;
  return <FeedbackDetail projectId={projectId} feedbackId={feedbackId} />;
}
