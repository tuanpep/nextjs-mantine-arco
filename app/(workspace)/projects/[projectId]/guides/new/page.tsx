import { Suspense } from "react";

import { GuideForm } from "@/modules/guides/components/guide-form";
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
  return <GuideForm projectId={projectId} />;
}
