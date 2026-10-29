import { CollectionPageSkeleton } from "@/modules/ui/components/page-skeletons";

export default function FeedbackLoading() {
  return (
    <CollectionPageSkeleton
      tabCount={3}
      withStatus={false}
      withDescription={false}
    />
  );
}
