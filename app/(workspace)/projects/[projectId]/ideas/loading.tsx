import { CollectionPageSkeleton } from "@/modules/ui/components/page-skeletons";

export default function IdeasLoading() {
  return (
    <CollectionPageSkeleton
      tabCount={3}
      withStatus={false}
      withDescription={false}
    />
  );
}
