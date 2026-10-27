import { SupportForm } from "@/modules/support/components/support-form";

export default async function NewSupportPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  return <SupportForm projectId={projectId} />;
}
