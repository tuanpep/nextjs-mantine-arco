import { describe, expect, it } from "vitest";

import {
  acceptBugFiles,
  bugAttachmentMessage,
  bugFileKind,
  formatFileSize,
  partitionBugFiles,
} from "./attachments";

function file(name: string, size: number) {
  return new File([new Uint8Array(size)], name);
}

describe("bug attachments", () => {
  it("keeps a png name and size", () => {
    const accepted = acceptBugFiles([file("screen.png", 2048)]);
    expect(accepted).toEqual({
      attachments: [{ name: "screen.png", sizeLabel: "2 KB" }],
    });
    expect(formatFileSize(10)).toBe("10 B");
  });

  it("rejects the wrong type, an oversized file, and a sixth file", () => {
    expect(acceptBugFiles([file("notes.txt", 12)])).toEqual({ error: "type" });
    expect(acceptBugFiles([file("shot.png", 10 * 1024 * 1024 + 1)])).toEqual({
      error: "size",
    });
    expect(
      acceptBugFiles(
        ["a", "b", "c", "d", "e", "f"].map((name) => file(`${name}.png`, 10)),
      ),
    ).toEqual({ error: "count" });
  });

  it("keeps accepted files and reports the first rejection", () => {
    const png = file("screen.png", 2048);
    const added = partitionBugFiles([], [png, file("notes.txt", 12)]);
    expect(added.error).toBe("type");
    expect(added.files).toEqual([png]);
    expect(partitionBugFiles([png], [png]).files).toEqual([png]);
    const five = ["a", "b", "c", "d", "e"].map((name) =>
      file(`${name}.png`, 8),
    );
    expect(partitionBugFiles(five, [file("f.png", 8)]).error).toBe("count");
    expect(bugFileKind("shot.JPEG")).toBe("image");
    expect(bugFileKind("notes.txt")).toBeNull();
    expect(
      bugAttachmentMessage("size", { type: "t", size: "s", count: "c" }),
    ).toBe("s");
  });
});
