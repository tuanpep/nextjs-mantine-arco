import { Suspense } from "react";

import { HomeScreen } from "@/modules/projects/components/home-screen";
import { HomePageSkeleton } from "@/modules/ui/components/page-skeletons";

export default function HomePage() {
  return (
    <Suspense fallback={<HomePageSkeleton />}>
      <HomeScreen />
    </Suspense>
  );
}
