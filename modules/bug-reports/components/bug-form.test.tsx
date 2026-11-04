import { cleanup, fireEvent, screen, waitFor } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { NuqsTestingAdapter } from "nuqs/adapters/testing";
import { afterEach, expect, test, vi } from "vitest";

import messages from "@/messages/en.json";
import { render } from "@/test-utils/render";
import { BugForm } from "./bug-form";
import { OpenRequestForm } from "@/modules/portal/components/open-request-form";

const { createBug, push } = vi.hoisted(() => ({
  createBug: vi.fn(),
  push: vi.fn(),
}));
vi.mock("@/modules/portal/components/portal-provider", () => ({
  usePortal: () => ({ createBug, bugs: [] }),
}));
vi.mock("nextjs-toploader/app", () => ({ useRouter: () => ({ push }) }));
afterEach(() => {
  cleanup();
  vi.resetAllMocks();
  vi.unstubAllGlobals();
});

test("failed creation retains the review and retries once", async () => {
  Object.defineProperty(window, "visualViewport", {
    configurable: true,
    value: {
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      width: 1024,
      height: 768,
      offsetLeft: 0,
      offsetTop: 0,
    },
  });
  Object.defineProperty(document, "fonts", {
    configurable: true,
    value: {
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      ready: Promise.resolve(),
    },
  });
  createBug.mockReturnValueOnce(null).mockReturnValueOnce({ id: "BUG-9" });
  const { container } = render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <NuqsTestingAdapter>
        <BugForm projectId="beacon-portal" />
      </NuqsTestingAdapter>
    </NextIntlClientProvider>,
  );
  const preview = vi.fn().mockReturnValue("blob:http://localhost/preview");
  const revoke = vi.fn();
  vi.stubGlobal(
    "URL",
    class extends URL {
      static createObjectURL = preview;
      static revokeObjectURL = revoke;
    },
  );
  const fileInput =
    container.querySelector<HTMLInputElement>('input[type="file"]');
  if (!fileInput) throw new Error("Expected file input");
  fireEvent.change(fileInput, {
    target: {
      files: [
        new File(["image"], "evidence.png", { type: "image/png" }),
        new File(["pdf"], "evidence.pdf", { type: "application/pdf" }),
      ],
    },
  });
  for (const [name, value] of [
    ["Title", "Failed export"],
    ["What happened", "Export fails"],
    ["Expected result", "Export works"],
    ["Steps to reproduce", "Press export"],
  ]) {
    fireEvent.change(screen.getByRole("textbox", { name }), {
      target: { value },
    });
  }
  for (const name of ["Who is affected", "How soon"]) {
    fireEvent.click(screen.getByRole("combobox", { name }));
    fireEvent.click(
      (
        await screen.findAllByRole("option", { name: "Not sure", hidden: true })
      )[name === "Who is affected" ? 0 : 1],
    );
  }
  fireEvent.click(screen.getByRole("button", { name: "Review" }));
  fireEvent.click(
    await screen.findByRole("button", { name: "Create bug report" }),
  );
  expect(await screen.findByRole("alert")).toHaveTextContent(
    messages.Bugs.createFailed,
  );
  expect(screen.getByText("Failed export")).toBeInTheDocument();
  expect(createBug).toHaveBeenCalledTimes(1);
  expect(screen.getByText("evidence.png")).toBeVisible();
  expect(screen.getByText("evidence.pdf")).toBeVisible();
  expect(revoke).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole("button", { name: "Create bug report" }));
  expect(createBug).toHaveBeenCalledTimes(2);
  expect(createBug.mock.calls[1][0].attachments).toEqual([
    expect.objectContaining({
      name: "evidence.png",
      previewUrl: "blob:http://localhost/preview",
    }),
    expect.objectContaining({ name: "evidence.pdf" }),
  ]);
  await waitFor(() =>
    expect(push).toHaveBeenCalledWith(
      expect.stringContaining("/BUG-9?returnTo="),
    ),
  );
}, 15000);

test("drawer retains rejected bug text and accepts a retry", async () => {
  createBug
    .mockReturnValueOnce(null)
    .mockReturnValueOnce({ id: "BUG-10", title: "Retry drawer" });
  render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <OpenRequestForm
        defaultProjectId="beacon-portal"
        projectOptions={[{ value: "beacon-portal", label: "Beacon Portal" }]}
        onClose={vi.fn()}
      />
    </NextIntlClientProvider>,
  );
  for (const [name, value] of [
    ["Title", "Retry drawer"],
    ["What happened", "Saving fails"],
    ["Expected result", "It saves"],
    ["Steps to reproduce", "Click Save"],
  ]) {
    fireEvent.change(screen.getByRole("textbox", { name }), {
      target: { value },
    });
  }
  for (const name of ["Who is affected", "How soon"]) {
    fireEvent.change(screen.getByRole("combobox", { name }), {
      target: { value: "unsure" },
    });
  }
  fireEvent.click(screen.getByRole("button", { name: "Create bug report" }));
  expect(await screen.findByRole("alert")).toHaveTextContent(
    messages.Bugs.createFailed,
  );
  expect(
    screen.getByRole("textbox", { name: "Title" }),
  ).toHaveValue("Retry drawer");
  fireEvent.click(screen.getByRole("button", { name: "Create bug report" }));
  expect(
    await screen.findByRole("link", { name: "Retry drawer" }),
  ).toHaveAttribute("href", "/projects/beacon-portal/support/bugs/BUG-10");
  expect(createBug).toHaveBeenCalledTimes(2);
});
