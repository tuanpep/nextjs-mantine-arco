import { Suspense } from "react";
import { SupportCollection } from "@/modules/support/components/support-collection";

export default async function SupportPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  return (
    <Suspense fallback={<p>Loading support...</p>}>
      <SupportCollection projectId={projectId} />
    </Suspense>
  );
}
