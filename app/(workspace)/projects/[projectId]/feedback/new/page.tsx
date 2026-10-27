import { Suspense } from "react";
import { notFound } from "next/navigation";

import { FeedbackForm } from "@/modules/feedback/components/feedback-form";
import { getApplication } from "@/modules/projects/lib/applications";

export default function NewFeedbackPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  return (
    <Suspense fallback={<p>Loading feedback form...</p>}>
      <NewFeedbackContent params={params} />
    </Suspense>
  );
}

async function NewFeedbackContent({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  if (!getApplication(projectId)) notFound();
  return <FeedbackForm projectId={projectId} />;
}
