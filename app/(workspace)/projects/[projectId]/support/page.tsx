import { Suspense } from "react";

import { SupportCollection } from "@/modules/support/components/support-collection";

export default function SupportPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  return (
    <Suspense fallback={<p>Loading support...</p>}>
      <SupportContent params={params} />
    </Suspense>
  );
}

async function SupportContent({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  return <SupportCollection projectId={projectId} />;
}
