import {
  cleanup,
  fireEvent,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { NuqsTestingAdapter } from "nuqs/adapters/testing";
import { useState, type ReactNode } from "react";
import { afterEach, expect, test, vi } from "vitest";

import { render as renderWithProviders } from "@/test-utils/render";

import { ProjectSettings } from "./project-settings";
import {
  ProjectSettingsProvider,
  useProjectSettings,
} from "./project-settings-provider";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

function render(ui: ReactNode) {
  return renderWithProviders(
    <NuqsTestingAdapter hasMemory>{ui}</NuqsTestingAdapter>,
  );
}

function Harness() {
  const [projectId, setProjectId] = useState("beacon-portal");
  const [visible, setVisible] = useState(true);
  const store = useProjectSettings();
  return (
    <>
      <button onClick={() => setVisible(!visible)}>Toggle settings</button>
      <button
        onClick={() => {
          if (store.confirmLeave(projectId)) {
            setProjectId(
              projectId === "beacon-portal"
                ? "orchid-reports"
                : "beacon-portal",
            );
          }
        }}
      >
        Switch test project
      </button>
      {visible && <ProjectSettings projectId={projectId} />}
    </>
  );
}

function openReferences() {
  fireEvent.click(
    screen.getByRole("button", {
      name: "Thông tin tham chiếu trách nhiệm minh họa",
    }),
  );
}

function editHandler(value: string) {
  fireEvent.change(screen.getByLabelText("Người xử lý hỗ trợ"), {
    target: { value },
  });
}

async function waitForReviewToClose() {
  await waitFor(() =>
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
  );
}

test("identity is read-only and unknown projects do not fall back to registry data", () => {
  const { unmount } = render(
    <ProjectSettingsProvider>
      <ProjectSettings projectId="beacon-portal" />
    </ProjectSettingsProvider>,
  );
  expect(
    screen.getByLabelText("Đơn vị phụ trách trong danh mục"),
  ).toHaveAttribute("readonly");
  expect(screen.getByLabelText("Mã dự án")).toHaveValue("beacon-portal");
  unmount();
  render(
    <ProjectSettingsProvider>
      <ProjectSettings projectId="unknown" />
    </ProjectSettingsProvider>,
  );
  expect(
    screen.getByRole("heading", { name: "Không thể truy cập trang này" }),
  ).toBeInTheDocument();
  expect(screen.queryByText(/Beacon Portal/)).not.toBeInTheDocument();
});

test("review and back-to-edit preserve drafts; only apply changes the same-session value", async () => {
  render(
    <ProjectSettingsProvider>
      <Harness />
    </ProjectSettingsProvider>,
  );
  openReferences();
  editHandler("Demo new handler");
  fireEvent.click(screen.getByRole("button", { name: "Xem lại thay đổi" }));
  const dialog = await screen.findByRole("dialog");
  expect(within(dialog).getByText("Minh Pham")).toBeInTheDocument();
  expect(within(dialog).getByText("Demo new handler")).toBeInTheDocument();
  fireEvent.click(
    within(dialog).getByRole("button", { name: "Quay lại chỉnh sửa" }),
  );
  await waitForReviewToClose();
  expect(screen.getByLabelText("Người xử lý hỗ trợ")).toHaveValue(
    "Demo new handler",
  );
  fireEvent.click(screen.getByRole("button", { name: "Xem lại thay đổi" }));
  fireEvent.click(
    await screen.findByRole("button", {
      name: "Áp dụng thông tin tham chiếu minh họa",
    }),
  );
  await waitForReviewToClose();
  expect(screen.getByRole("status")).toHaveTextContent(
    "chỉ trong phiên minh họa này",
  );
  fireEvent.click(screen.getByRole("button", { name: "Toggle settings" }));
  fireEvent.click(screen.getByRole("button", { name: "Toggle settings" }));
  openReferences();
  expect(screen.getByLabelText("Người xử lý hỗ trợ")).toHaveValue(
    "Demo new handler",
  );
  expect(
    screen.getByText(
      /Nguồn đang áp dụng: giá trị minh họa trong phiên hiện tại/,
    ),
  ).toBeInTheDocument();
});

test("cancel and discard restore the applied value instead of the registry baseline", async () => {
  render(
    <ProjectSettingsProvider>
      <Harness />
    </ProjectSettingsProvider>,
  );
  openReferences();
  editHandler("Applied demo handler");
  fireEvent.click(screen.getByRole("button", { name: "Xem lại thay đổi" }));
  fireEvent.click(
    await screen.findByRole("button", {
      name: "Áp dụng thông tin tham chiếu minh họa",
    }),
  );
  await waitForReviewToClose();
  editHandler("Canceled handler");
  fireEvent.click(screen.getByRole("button", { name: "Xem lại thay đổi" }));
  fireEvent.click(await screen.findByRole("button", { name: "Hủy thay đổi" }));
  await waitForReviewToClose();
  expect(screen.getByLabelText("Người xử lý hỗ trợ")).toHaveValue(
    "Applied demo handler",
  );
  editHandler("Discarded handler");
  fireEvent.click(screen.getByRole("button", { name: "Bỏ thay đổi" }));
  expect(screen.getByLabelText("Người xử lý hỗ trợ")).toHaveValue(
    "Applied demo handler",
  );
});

test("project switch can keep edits or explicitly discard them without changing another project", () => {
  const confirm = vi.spyOn(window, "confirm").mockReturnValue(false);
  render(
    <ProjectSettingsProvider>
      <Harness />
    </ProjectSettingsProvider>,
  );
  openReferences();
  editHandler("Unsaved Beacon reference");
  fireEvent.click(screen.getByRole("button", { name: "Switch test project" }));
  expect(confirm).toHaveBeenCalledOnce();
  expect(screen.getByLabelText("Người xử lý hỗ trợ")).toHaveValue(
    "Unsaved Beacon reference",
  );
  confirm.mockReturnValue(true);
  fireEvent.click(screen.getByRole("button", { name: "Switch test project" }));
  expect(screen.getByLabelText("Người xử lý hỗ trợ")).toHaveValue("Minh Pham");
  fireEvent.click(screen.getByRole("button", { name: "Switch test project" }));
  expect(screen.getByLabelText("Người xử lý hỗ trợ")).toHaveValue("Minh Pham");
  expect(confirm).toHaveBeenCalledTimes(2);
});

test("setup gaps use applied references and never claim operational readiness", async () => {
  render(
    <ProjectSettingsProvider>
      <Harness />
    </ProjectSettingsProvider>,
  );
  openReferences();
  editHandler("   ");
  fireEvent.click(screen.getByRole("button", { name: "Thông tin thiết lập" }));
  expect(
    screen.getByText("Không thiếu thông tin tham chiếu minh họa."),
  ).toBeInTheDocument();
  openReferences();
  fireEvent.click(screen.getByRole("button", { name: "Xem lại thay đổi" }));
  fireEvent.click(
    await screen.findByRole("button", {
      name: "Áp dụng thông tin tham chiếu minh họa",
    }),
  );
  await waitForReviewToClose();
  fireEvent.click(screen.getByRole("button", { name: "Thông tin thiết lập" }));
  expect(
    screen.getByText("Thiếu thông tin tham chiếu: Người xử lý hỗ trợ."),
  ).toBeInTheDocument();
  expect(
    screen.getByText(/Chưa xác minh khả năng vận hành/),
  ).toBeInTheDocument();
});

test("reload guard is present only while unsaved edits exist and a fresh session resets values", async () => {
  const { unmount } = render(
    <ProjectSettingsProvider>
      <Harness />
    </ProjectSettingsProvider>,
  );
  openReferences();
  editHandler("Unapplied handler");
  const blocked = new Event("beforeunload", { cancelable: true });
  window.dispatchEvent(blocked);
  expect(blocked.defaultPrevented).toBe(true);
  fireEvent.click(screen.getByRole("button", { name: "Bỏ thay đổi" }));
  const allowed = new Event("beforeunload", { cancelable: true });
  window.dispatchEvent(allowed);
  expect(allowed.defaultPrevented).toBe(false);
  editHandler("Applied handler");
  fireEvent.click(screen.getByRole("button", { name: "Xem lại thay đổi" }));
  fireEvent.click(
    await screen.findByRole("button", {
      name: "Áp dụng thông tin tham chiếu minh họa",
    }),
  );
  unmount();
  render(
    <ProjectSettingsProvider>
      <Harness />
    </ProjectSettingsProvider>,
  );
  openReferences();
  expect(screen.getByLabelText("Người xử lý hỗ trợ")).toHaveValue("Minh Pham");
});
