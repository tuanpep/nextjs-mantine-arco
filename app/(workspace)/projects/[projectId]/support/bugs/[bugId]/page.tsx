import { Suspense } from "react";

import { BugDetail } from "@/modules/bug-reports/components/bug-detail";
import { DetailPageSkeleton } from "@/modules/ui/components/page-skeletons";

export default function Page({
  params,
}: {
  params: Promise<{ projectId: string; bugId: string }>;
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
  params: Promise<{ projectId: string; bugId: string }>;
}) {
  const { projectId, bugId } = await params;
  return <BugDetail projectId={projectId} bugId={bugId} />;
}
