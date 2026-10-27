import { notFound, redirect } from "next/navigation";
import { getApplication } from "@/modules/projects/lib/applications";

export default async function IdeasPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  if (!getApplication(projectId)) notFound();
  redirect("/improvements");
}
