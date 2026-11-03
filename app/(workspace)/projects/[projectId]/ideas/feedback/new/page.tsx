import { Suspense } from "react";

import { FeedbackForm } from "@/modules/feedback/components/feedback-form";
import { FormPageSkeleton } from "@/modules/ui/components/page-skeletons";

export default function Page({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  return (
    <Suspense fallback={<FormPageSkeleton />}>
      <Content params={params} />
    </Suspense>
  );
}

async function Content({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  return <FeedbackForm projectId={projectId} />;
}
