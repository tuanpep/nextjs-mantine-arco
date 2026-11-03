import { Suspense } from "react";

import { HelpDetail } from "@/modules/help/components/help-detail";
import { DetailPageSkeleton } from "@/modules/ui/components/page-skeletons";

export default function Page({
  params,
}: {
  params: Promise<{ projectId: string; helpId: string }>;
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
  params: Promise<{ projectId: string; helpId: string }>;
}) {
  const { projectId, helpId } = await params;
  return <HelpDetail projectId={projectId} helpId={helpId} />;
}
