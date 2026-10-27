import { Suspense } from "react";
import { notFound, redirect } from "next/navigation";

import {
  getApplication,
  projectSupportPath,
} from "@/modules/projects/lib/applications";

export default function ProjectPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  return (
    <Suspense fallback={<p>Loading project...</p>}>
      <ProjectRedirect params={params} />
    </Suspense>
  );
}

async function ProjectRedirect({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  if (!getApplication(projectId)) notFound();
  redirect(projectSupportPath(projectId));
  return null;
}
