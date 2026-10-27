import { describe, expect, it } from "vitest";
import {
  applications,
  applicationPath,
  getApplication,
  projectSectionFromPath,
  projectSectionPath,
  projectSupportPath,
} from "./applications";

describe("application registry", () => {
  it.each(applications)("resolves $id and its overview path", (application) => {
    expect(getApplication(application.id)).toBe(application);
    expect(applicationPath(application.id)).toBe(`/projects/${application.id}`);
    expect(projectSupportPath(application.id)).toBe(
      `/projects/${application.id}/support`,
    );
  });

  it("does not resolve unknown applications", () => {
    expect(getApplication("unknown")).toBeUndefined();
  });

  it("preserves the current section when switching projects", () => {
    expect(
      projectSectionPath("beacon-portal", "/projects/orchid-reports/ideas"),
    ).toBe("/projects/beacon-portal/ideas");
    expect(
      projectSectionPath(
        "orchid-reports",
        "/projects/beacon-portal/support/new",
      ),
    ).toBe("/projects/orchid-reports/support");
    expect(projectSectionFromPath("/projects/beacon-portal")).toBe("support");
  });
});
