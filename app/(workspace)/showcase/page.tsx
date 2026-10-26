import type { Metadata } from "next";

import { ShowcaseScreen } from "@/modules/showcase/components/showcase-screen";

export const metadata: Metadata = {
  title: "Showcase",
};

export default function ShowcasePage() {
  return <ShowcaseScreen />;
}
