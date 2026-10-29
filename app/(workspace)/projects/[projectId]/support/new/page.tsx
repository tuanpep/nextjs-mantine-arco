import { Suspense } from "react";

import { SupportForm } from "@/modules/support/components/support-form";
import { FormPageSkeleton } from "@/modules/ui/components/page-skeletons";

export default function NewSupportPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  return (
    <Suspense fallback={<FormPageSkeleton fields={6} />}>
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
