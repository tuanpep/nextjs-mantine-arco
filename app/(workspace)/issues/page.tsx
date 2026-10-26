import type { Metadata } from "next";

import { IssueListScreen } from "@/modules/issues/components/issue-list-screen";
import { loadIssues } from "@/modules/issues/lib/load";
import { loadIssueSearchParams } from "@/modules/issues/lib/search-params";

export const metadata: Metadata = {
  title: "Issues",
};

export default async function IssuesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { q } = await loadIssueSearchParams(searchParams);

  return <IssueListScreen issues={loadIssues(q)} />;
}
