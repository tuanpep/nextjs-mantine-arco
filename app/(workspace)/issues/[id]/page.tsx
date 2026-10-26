import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { IssueDetailsScreen } from "@/modules/issues/components/issue-details-screen";
import { issues } from "@/modules/issues/lib/fixtures";
import { loadIssue } from "@/modules/issues/lib/load";

export function generateStaticParams() {
  return issues.map((issue) => ({ id: issue.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const issue = loadIssue(id);

  return { title: issue?.title ?? "Issue" };
}

export default async function IssueDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const issue = loadIssue(id);

  if (!issue) {
    notFound();
  }

  return <IssueDetailsScreen issue={issue} />;
}
