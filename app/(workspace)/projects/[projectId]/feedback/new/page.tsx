import { Suspense } from "react";
import { notFound } from "next/navigation";

import { FeedbackForm } from "@/modules/feedback/components/feedback-form";
import { getApplication } from "@/modules/projects/lib/applications";
import { FormPageSkeleton } from "@/modules/ui/components/page-skeletons";

export default function NewFeedbackPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  return (
    <Suspense fallback={<FormPageSkeleton fields={3} />}>
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
