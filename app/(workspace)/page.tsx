import { redirect } from "next/navigation";

import {
  DEFAULT_PROJECT_ID,
  projectSupportPath,
} from "@/modules/projects/lib/applications";

export default function HomePage() {
  redirect(projectSupportPath(DEFAULT_PROJECT_ID));
}
