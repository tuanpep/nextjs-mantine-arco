import { Suspense } from "react";

import { SupportForm } from "@/modules/support/components/support-form";

export default function NewSupportPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  return (
    <Suspense fallback={<p>Loading support form...</p>}>
      <NewSupportContent params={params} />
    </Suspense>
  );
}

async function NewSupportContent({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  return <SupportForm projectId={projectId} />;
}
