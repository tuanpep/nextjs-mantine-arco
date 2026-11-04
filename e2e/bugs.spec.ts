import { expect, test } from "@playwright/test";

test("create a bug report, revisit it, and start work", async ({ page }) => {
  await page.goto("/projects/beacon-portal/support/bugs/new");
  await expect(
    page.getByRole("button", { name: "Xem lại", exact: true }),
  ).toBeEnabled();
  await page
    .getByRole("textbox", { name: "Tiêu đề" })
    .fill("Workspace stays blank");
  await page
    .getByRole("textbox", { name: "Mô tả lỗi" })
    .fill("The page stays blank after sign-in.");
  await page
    .getByRole("textbox", { name: "Các bước tái hiện lỗi" })
    .fill("Sign in, then open the project.");
  await page
    .getByRole("textbox", { name: "Kết quả mong đợi" })
    .fill("The project overview appears.");
  await page
    .getByRole("textbox", { name: "Phiên bản hoặc môi trường" })
    .fill("Production · Chrome");
  await page.getByRole("combobox", { name: "Đối tượng bị ảnh hưởng" }).click();
  await page.getByRole("option", { name: "Chỉ tôi", exact: true }).click();
  await page.getByRole("combobox", { name: "Mức độ khẩn cấp" }).click();
  await page
    .getByRole("option", { name: "Công việc đang bị đình trệ", exact: true })
    .click();
  await page.getByRole("button", { name: "Xem lại" }).click();
  await expect(page.getByText("Cao", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Tạo báo cáo" }).click();

  await expect(
    page.getByRole("heading", { name: "Workspace stays blank" }),
  ).toBeVisible();
  await expect(
    page.getByText("Đang mở", { exact: true }).first(),
  ).toBeVisible();

  await page
    .getByRole("navigation", { name: "Điều hướng chính" })
    .getByRole("link", { name: "Báo cáo lỗi", exact: true })
    .click();
  await expect(
    page.getByRole("link", { name: "Workspace stays blank" }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Workspace stays blank" }).click();

  await page
    .getByRole("textbox", { name: "Ghi chú" })
    .fill("Reproduced locally.");
  await page.getByRole("button", { name: "Cập nhật" }).click();
  await expect(
    page.getByText("Đang xử lý", { exact: true }).first(),
  ).toBeVisible();
  await expect(page.getByText("Reproduced locally.")).toBeVisible();

  await page.getByRole("combobox", { name: "Thao tác", exact: true }).click();
  await page.getByRole("option", { name: "Yêu cầu thêm thông tin" }).click();
  await page
    .getByRole("textbox", { name: "Ghi chú", exact: true })
    .fill("Which release is affected?");
  await page.getByRole("button", { name: "Cập nhật", exact: true }).click();
  await expect(
    page.getByText("Chờ bổ sung thông tin", { exact: true }),
  ).toBeVisible();
  const discussion = page.getByRole("region", {
    name: "Trao đổi",
    exact: true,
  });
  await expect(
    discussion.getByText("Which release is affected?"),
  ).toBeVisible();
  await page
    .getByRole("textbox", { name: "Tin nhắn", exact: true })
    .fill("Release 2 is affected.");
  await page.getByRole("button", { name: "Gửi tin nhắn", exact: true }).click();
  await expect(
    page.getByText("Đang mở", { exact: true }).first(),
  ).toBeVisible();
  await expect(discussion.getByText("Which release is affected?")).toHaveCount(
    0,
  );
  await expect(discussion.getByRole("status")).toHaveText(
    "Đã lưu tin nhắn trong phiên này.",
  );

  await page.getByRole("combobox", { name: "Thao tác", exact: true }).click();
  await page
    .getByRole("option", { name: "Đánh dấu đã xử lý", exact: true })
    .click();
  await page
    .getByRole("textbox", { name: "Ghi chú", exact: true })
    .fill("Fixed in release 3.");
  await page.getByRole("button", { name: "Cập nhật", exact: true }).click();
  await expect(
    page.getByText("Đã xử lý", { exact: true }).first(),
  ).toBeVisible();
  await page
    .getByRole("textbox", { name: "Tin nhắn", exact: true })
    .fill("Verified in release 3.");
  await page.getByRole("button", { name: "Gửi tin nhắn", exact: true }).click();
  await expect(
    page.getByText("Verified in release 3.", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText("Đã xử lý", { exact: true }).first(),
  ).toBeVisible();
  await page
    .getByRole("textbox", { name: "Ghi chú", exact: true })
    .fill("Returned in release 4.");
  await page.getByRole("button", { name: "Cập nhật", exact: true }).click();
  await expect(
    page.getByText("Đang mở", { exact: true }).first(),
  ).toBeVisible();
});

test("report an intermittent bug in English without environment details", async ({
  page,
  context,
}) => {
  await context.addCookies([
    {
      name: "DX_LOCALE",
      value: "en",
      domain: "localhost",
      path: "/",
      httpOnly: true,
    },
  ]);
  await page.goto("/projects/beacon-portal/support/bugs/new");
  await expect(
    page.getByRole("button", { name: "Review", exact: true }),
  ).toBeEnabled();
  await page
    .getByRole("textbox", { name: "Title", exact: true })
    .fill("Intermittent save failure");
  await page
    .getByRole("textbox", { name: "What happened", exact: true })
    .fill("Saving occasionally fails.");
  await page
    .getByRole("textbox", { name: "Expected result", exact: true })
    .fill("Saved changes remain visible.");
  const steps = page.getByRole("textbox", {
    name: "Steps to reproduce",
    exact: true,
  });
  await steps.fill("Original steps");
  const unknown = page.getByRole("checkbox", {
    name: "I don't know how to reproduce this",
  });
  await unknown.check();
  await expect(steps).not.toBeVisible();
  await unknown.uncheck();
  await expect(steps).toHaveValue("Original steps");
  await unknown.check();
  await page.getByRole("combobox", { name: "Who is affected" }).click();
  await page.getByRole("option", { name: "Not sure", exact: true }).click();
  await page.getByRole("combobox", { name: "How soon" }).click();
  await page.getByRole("option", { name: "Not sure", exact: true }).click();
  await page.getByRole("button", { name: "Review", exact: true }).click();
  await expect(
    page
      .getByText("I don't know how to reproduce this", { exact: true })
      .first(),
  ).toBeVisible();
  await expect(
    page.getByText("Original steps", { exact: true }),
  ).not.toBeVisible();
  await page
    .getByRole("button", { name: "Create bug report", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Intermittent save failure" }),
  ).toBeVisible();
  await expect(
    page
      .getByText("I don't know how to reproduce this", { exact: true })
      .first(),
  ).toBeVisible();
  await page
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("link", { name: "Bug Reports", exact: true })
    .click();
  await page
    .getByRole("textbox", { name: "Search", exact: true })
    .fill("Saved changes remain visible");
  await page
    .getByRole("textbox", { name: "Search", exact: true })
    .press("Enter");
  await expect(
    page.getByRole("link", { name: "Intermittent save failure" }),
  ).toBeVisible();
});
