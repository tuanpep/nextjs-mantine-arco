import { Suspense } from "react";
import { notFound } from "next/navigation";

import { FeedbackCollection } from "@/modules/feedback/components/feedback-collection";
import { getApplication } from "@/modules/projects/lib/applications";
import { CollectionPageSkeleton } from "@/modules/ui/components/page-skeletons";

export default function FeedbackPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  return (
    <Suspense
      fallback={
        <CollectionPageSkeleton
          tabCount={3}
          withStatus={false}
          withDescription={false}
        />
      }
    >
      <FeedbackContent params={params} />
    </Suspense>
  );
}

async function FeedbackContent({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  if (!getApplication(projectId)) notFound();
  return <FeedbackCollection projectId={projectId} />;
}
