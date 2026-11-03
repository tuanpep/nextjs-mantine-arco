import { describe, expect, it } from "vitest";

import { addDiscussionReply, createDiscussionThread } from "./state";

describe("discussions", () => {
  it("starts a thread and appends a reply without linking another record", () => {
    const thread = createDiscussionThread("DISC-9", {
      projectId: "beacon-portal",
      title: " Naming ",
      body: "How should views be named?",
    });
    expect(thread?.replies).toEqual([]);
    const replied = thread
      ? addDiscussionReply(thread, "REPLY-9", "you", " Use the team name ")
      : null;
    expect(thread?.replies).toEqual([]);
    expect(replied?.replies).toEqual([
      { id: "REPLY-9", author: "you", text: "Use the team name" },
    ]);
    expect(
      thread ? addDiscussionReply(thread, "REPLY-10", "you", " ") : null,
    ).toBeNull();
  });
});
