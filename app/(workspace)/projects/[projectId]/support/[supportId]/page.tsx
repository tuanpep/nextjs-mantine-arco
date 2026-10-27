import { SupportDetails } from "@/modules/support/components/support-details";

export default async function SupportDetailsPage({
  params,
}: {
  params: Promise<{ projectId: string; supportId: string }>;
}) {
  const { projectId, supportId } = await params;
  return <SupportDetails projectId={projectId} supportId={supportId} />;
}
