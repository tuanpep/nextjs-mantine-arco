import Link from "next/link";

import {
  DEFAULT_PROJECT_ID,
  projectSupportPath,
} from "@/modules/projects/lib/applications";

export default function UnavailablePage() {
  return (
    <section>
      <h1>This destination is not available</h1>
      <p>
        It may not be available to your account. No restricted details are
        shown.
      </p>
      <Link href="/">Back to Home</Link>
      {" · "}
      <Link href={projectSupportPath(DEFAULT_PROJECT_ID)}>Back to Support</Link>
    </section>
  );
}
