import { Suspense } from "react";

import { SupportDetails } from "@/modules/support/components/support-details";

export default function SupportDetailsPage({
  params,
}: {
  params: Promise<{ projectId: string; supportId: string }>;
}) {
  return (
    <Suspense fallback={<p>Loading support...</p>}>
      <SupportDetailsContent params={params} />
    </Suspense>
  );
}

async function SupportDetailsContent({
  params,
}: {
  params: Promise<{ projectId: string; supportId: string }>;
}) {
  const { projectId, supportId } = await params;
  return <SupportDetails projectId={projectId} supportId={supportId} />;
}
