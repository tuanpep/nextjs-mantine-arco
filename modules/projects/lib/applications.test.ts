import { describe, expect, it } from "vitest";
import { applications, applicationPath, getApplication } from "./applications";

describe("application registry", () => {
  it.each(applications)("resolves $id and its overview path", (application) => {
    expect(getApplication(application.id)).toBe(application);
    expect(applicationPath(application.id)).toBe(`/projects/${application.id}`);
  });

  it("does not resolve unknown applications", () => {
    expect(getApplication("unknown")).toBeUndefined();
  });
});
