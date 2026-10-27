import { SupportDetails } from "@/modules/support/components/support-details";

export default async function SupportPage({ params }: { params: Promise<{ supportId: string }> }) {
  const { supportId } = await params;
  return <SupportDetails supportId={supportId} />;
}
