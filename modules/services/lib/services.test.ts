import { describe, expect, it } from "vitest";
import {
  seedRequests,
  services,
  updateRequest,
  validateRequest,
  type RequestDraft,
} from "./services";

describe("service requests", () => {
  it("requires application, justification, and each service's own fields", () => {
    for (const service of services) {
      const draft: RequestDraft = {
        serviceId: service.id,
        application: "",
        justification: "short",
        details: {},
      };
      const errors = validateRequest(draft);
      expect(errors.application).toBeTruthy();
      expect(errors.justification).toBeTruthy();
      for (const field of service.fields)
        expect(errors[field.key]).toBeTruthy();
      draft.application = "CRM";
      draft.justification = "The team needs this for the monthly review.";
      draft.details = Object.fromEntries(
        service.fields.map((field) => [
          field.key,
          field.kind === "email" ? "you@example.com" : "Business reference",
        ]),
      );
      expect(validateRequest(draft)).toEqual({});
    }
  });

  it("rejects invalid email and unknown service", () => {
    expect(
      validateRequest({
        serviceId: "access",
        application: "CRM",
        justification: "Review monthly customer records.",
        details: { account: "invalid", scope: "read" },
      }).account,
    ).toBeTruthy();
    expect(
      validateRequest({
        serviceId: "unknown",
        application: "CRM",
        justification: "Review monthly customer records.",
        details: {},
      }).serviceId,
    ).toBeTruthy();
  });

  it("requires assignment and reason, preserves history through approval and progress", () => {
    const original = seedRequests()[1];
    expect(() =>
      updateRequest(
        original,
        { kind: "status", status: "In review", reason: "Review started." },
        "now",
      ),
    ).toThrow("Assign");
    const assigned = updateRequest(
      original,
      { kind: "assign", assignee: "Minh Tran" },
      "now",
    );
    expect(() =>
      updateRequest(
        assigned,
        {
          kind: "status",
          status: "Approved",
          reason: "Reviewed owner decision.",
        },
        "now",
      ),
    ).toThrow("not allowed");
    expect(() =>
      updateRequest(
        assigned,
        { kind: "status", status: "In review", reason: "" },
        "now",
      ),
    ).toThrow("reason");
    const review = updateRequest(
      assigned,
      {
        kind: "status",
        status: "In review",
        reason: "Owner review requested.",
      },
      "now",
    );
    const approved = updateRequest(
      review,
      {
        kind: "status",
        status: "Approved",
        reason: "Owner confirmed business need.",
      },
      "now",
    );
    const progress = updateRequest(
      approved,
      {
        kind: "status",
        status: "In progress",
        reason: "Coordinating a change window.",
      },
      "now",
    );
    for (const request of [original, assigned, review, approved]) {
      expect(() =>
        updateRequest(
          request,
          {
            kind: "status",
            status: "Fulfilled",
            reason: "Demo work completed.",
            evidence: "Demo verification reference DX-123.",
          },
          "now",
        ),
      ).toThrow("not allowed");
    }
    expect(() =>
      updateRequest(
        progress,
        {
          kind: "status",
          status: "Fulfilled",
          reason: "Demo work completed.",
          evidence: "",
        },
        "now",
      ),
    ).toThrow("evidence");
    const fulfilled = updateRequest(
      progress,
      {
        kind: "status",
        status: "Fulfilled",
        reason: "Demo work completed.",
        evidence: "Demo verification reference DX-123.",
      },
      "now",
    );
    expect(fulfilled.status).toBe("Fulfilled");
    expect(fulfilled.history).toHaveLength(progress.history.length + 1);
    expect(fulfilled.history.at(-1)?.message).toContain(
      "Demo verification reference DX-123.",
    );
    expect(fulfilled.history.at(-1)?.message).toContain("No real provisioning");
    expect(() =>
      updateRequest(
        fulfilled,
        { kind: "assign", assignee: "Alex Chen" },
        "now",
      ),
    ).toThrow("cannot be changed");
    expect(() =>
      updateRequest(
        fulfilled,
        {
          kind: "status",
          status: "In progress",
          reason: "Attempt to reopen demo.",
        },
        "now",
      ),
    ).toThrow("cannot be changed");
    expect(progress.history).toHaveLength(original.history.length + 4);
    expect(progress.history[0]).toEqual(original.history[0]);
    expect(original.status).toBe("Submitted");
    const declined = updateRequest(
      progress,
      {
        kind: "status",
        status: "Declined",
        reason: "Business need was withdrawn.",
      },
      "now",
    );
    expect(() =>
      updateRequest(declined, { kind: "assign", assignee: "Alex Chen" }, "now"),
    ).toThrow("cannot be changed");
  });
});
