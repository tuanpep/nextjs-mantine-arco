import { Suspense } from "react";
import { notFound } from "next/navigation";

import { FeedbackDetails } from "@/modules/feedback/components/feedback-details";
import { getApplication } from "@/modules/projects/lib/applications";

export default function FeedbackDetailPage({
  params,
}: {
  params: Promise<{ projectId: string; feedbackId: string }>;
}) {
  return (
    <Suspense fallback={<p>Loading feedback...</p>}>
      <FeedbackDetailContent params={params} />
    </Suspense>
  );
}

async function FeedbackDetailContent({
  params,
}: {
  params: Promise<{ projectId: string; feedbackId: string }>;
}) {
  const { projectId, feedbackId } = await params;
  if (!getApplication(projectId)) notFound();
  return <FeedbackDetails projectId={projectId} feedbackId={feedbackId} />;
}
