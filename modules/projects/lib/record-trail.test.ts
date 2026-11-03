import { expect, test } from "vitest";

import { applications } from "./applications";
import { recordTrail } from "./record-trail";

test("record trail names the project between Projects and the page", () => {
  const project = applications[0];
  expect(project).toBeDefined();
  if (!project) return;
  expect(
    recordTrail(project, "Projects", [
      { title: "Bug Reports", href: "/projects/beacon-portal/support/bugs" },
    ]),
  ).toEqual([
    { title: "Projects", href: "/" },
    { title: "Beacon Portal", href: "/projects/beacon-portal" },
    { title: "Bug Reports", href: "/projects/beacon-portal/support/bugs" },
  ]);
});
