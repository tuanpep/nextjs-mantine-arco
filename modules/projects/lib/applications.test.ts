import { describe, expect, it } from "vitest";

import {
  applicationPath,
  applications,
  getApplication,
  projectSectionFromPath,
  projectSectionPath,
} from "./applications";

describe("application registry", () => {
  it.each(applications)("resolves $id and its overview path", (application) => {
    expect(getApplication(application.id)).toBe(application);
    expect(applicationPath(application.id)).toBe(`/projects/${application.id}`);
  });

  it("does not resolve unknown applications", () => {
    expect(getApplication("unknown")).toBeUndefined();
  });

  it("keeps the section and drops the record when switching projects", () => {
    expect(
      projectSectionPath(
        "beacon-portal",
        "/projects/orchid-reports/ideas/feedback/FB-1",
      ),
    ).toBe("/projects/beacon-portal/ideas/feedback");
    expect(
      projectSectionPath(
        "orchid-reports",
        "/projects/beacon-portal/support/bugs/new",
      ),
    ).toBe("/projects/orchid-reports/support/bugs");
    expect(projectSectionFromPath("/projects/beacon-portal")).toBe("overview");
    expect(
      projectSectionPath("orchid-reports", "/projects/beacon-portal"),
    ).toBe("/projects/orchid-reports");
    expect(projectSectionFromPath("/")).toBe("overview");
    expect(projectSectionPath("orchid-reports", "/")).toBe(
      "/projects/orchid-reports",
    );
    expect(
      projectSectionPath("beacon-portal", "/projects/orchid-reports/retired"),
    ).toBe("/projects/beacon-portal");
  });
});
