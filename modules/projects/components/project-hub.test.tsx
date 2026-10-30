import { cleanup, fireEvent, screen, within } from "@testing-library/react";
import { afterEach, expect, test } from "vitest";
import { render } from "@/test-utils/render";
import {
  SupportProvider,
  useSupport,
} from "@/modules/support/components/support-provider";
import { supportFixtures } from "@/modules/support/lib/fixtures";
import { ProjectHub } from "./project-hub";

afterEach(cleanup);

function Reply() {
  const { respond } = useSupport();
  return (
    <button
      onClick={() =>
        respond("SUP112", { kind: "reply", text: "Thông tin minh họa" })
      }
    >
      Trả lời mẫu
    </button>
  );
}

test("overview uses scoped session records and updates after a reply", () => {
  render(
    <SupportProvider>
      <ProjectHub projectId="beacon-portal" />
      <Reply />
    </SupportProvider>,
  );
  const expected = supportFixtures.filter(
    (item) =>
      item.applicationId === "beacon-portal" &&
      item.status !== "Resolved" &&
      item.nextActor === "Sender",
  ).length;
  const card = screen.getByRole("region", { name: "Cần bạn phản hồi" });
  expect(
    within(card).getByText(String(expected), { exact: true }),
  ).toBeInTheDocument();
  expect(within(card).getByRole("link")).toHaveAttribute(
    "href",
    "/projects/beacon-portal/support?view=needs-action",
  );
  fireEvent.click(screen.getByRole("button", { name: "Trả lời mẫu" }));
  expect(
    within(card).getByText(String(expected - 1), { exact: true }),
  ).toBeInTheDocument();
  expect(
    within(
      screen.getByRole("region", { name: "Cần bạn thực hiện" }),
    ).queryByText("SUP112"),
  ).not.toBeInTheDocument();
});

test("Orchid overview excludes Beacon requests and uses project-scoped quick actions", () => {
  render(
    <SupportProvider>
      <ProjectHub projectId="orchid-reports" />
    </SupportProvider>,
  );
  expect(
    screen.getByText("Hiện không có yêu cầu hỗ trợ chờ bạn phản hồi."),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("link", { name: "Tạo yêu cầu hỗ trợ" }),
  ).toHaveAttribute("href", "/projects/orchid-reports/support/new");
  expect(screen.getByRole("link", { name: "Gửi phản hồi" })).toHaveAttribute(
    "href",
    "/projects/orchid-reports/feedback/new",
  );
  expect(
    within(screen.getByRole("region", { name: "Tiến độ UAT" })).getByText(
      "Chưa có dữ liệu",
    ),
  ).toBeInTheDocument();
  expect(screen.queryByText("SUP112")).not.toBeInTheDocument();
});

test("unknown project does not display stats or quick actions", () => {
  render(
    <SupportProvider>
      <ProjectHub projectId="missing" />
    </SupportProvider>,
  );
  expect(
    screen.queryByRole("region", { name: "Cần bạn phản hồi" }),
  ).not.toBeInTheDocument();
  expect(
    screen.queryByRole("link", { name: "Tạo yêu cầu hỗ trợ" }),
  ).not.toBeInTheDocument();
});
