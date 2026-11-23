import { expect, test } from "@playwright/test";

import messages from "../messages/vi.json";

const labels = messages.ComponentBook.extensions;

test("uses mentions and moves selected people between lists", async ({
  page,
}) => {
  await page.goto("/components/mentions");
  const mentions = page.getByRole("textbox", { name: labels.mentions });
  await mentions.fill("@alex");
  await expect(page.getByRole("option", { name: "Alex Chen" })).toBeVisible();
  await mentions.press("Enter");
  await expect(mentions).toHaveValue("@alex");
  await expect(
    page.getByRole("listbox", { name: labels.mentions }),
  ).toBeHidden();

  await page.goto("/components/transfer");
  const available = page.getByRole("group", {
    name: labels.available,
    exact: true,
  });
  const team = page.getByRole("group", { name: labels.members, exact: true });
  await available.getByRole("checkbox", { name: "Alex Chen" }).check();
  await page.getByRole("button", { name: labels.add, exact: true }).click();
  await expect(team.getByRole("checkbox", { name: "Alex Chen" })).toBeVisible();
  await team.getByRole("checkbox", { name: "Alex Chen" }).check();
  await page.getByRole("button", { name: labels.remove, exact: true }).click();
  await expect(
    available.getByRole("checkbox", { name: "Alex Chen" }),
  ).toBeVisible();
});

test("confirms or cancels, returns focus, and supports keyboard resizing", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/components/popconfirm");
  const confirmation = page.getByRole("main").getByRole("article", {
    name: "Popconfirm",
    exact: true,
  });
  const trigger = page.getByRole("button", { name: labels.action });
  await trigger.click();
  await page.getByRole("button", { name: labels.cancel, exact: true }).click();
  await expect(trigger).toBeFocused();
  await expect(confirmation.getByText(labels.confirmed)).toHaveCount(0);
  await trigger.press("Enter");
  await page.getByRole("button", { name: labels.confirm, exact: true }).click();
  await expect(confirmation.getByRole("status")).toHaveText(labels.confirmed);

  await page.goto("/components/trigger");
  const details = page.getByRole("button", { name: labels.details });
  await details.click();
  await expect(
    page.getByRole("dialog", { name: labels.details }),
  ).toBeVisible();
  await details.press("Escape");
  await expect(page.getByRole("dialog", { name: labels.details })).toBeHidden();

  await page.goto("/components/resize-box");
  const handle = page.getByRole("separator", { name: labels.resize });
  await handle.press("ArrowRight");
  await expect(handle).toHaveAttribute("aria-valuenow", "220");
});

test("filters and sorts the data table and shows local-file progress", async ({
  page,
}) => {
  await page.goto("/components/data-table");
  const preview = page
    .getByRole("main")
    .getByRole("article", { name: "DataTable", exact: true });
  const table = page.getByRole("table", { name: labels.directory });
  await table.getByRole("button", { name: labels.name }).click();
  await expect(
    table.getByRole("columnheader", { name: labels.name }),
  ).toHaveAttribute("aria-sort", "ascending");
  await preview
    .getByRole("textbox", { name: labels.searchPeople })
    .fill("Samira");
  await expect(table.getByRole("row")).toHaveCount(2);
  await table.getByRole("checkbox", { name: labels.selectPage }).check();
  await expect(
    table.getByRole("checkbox", { name: "Chọn Samira Khan", exact: true }),
  ).toBeChecked();

  await page.goto("/components/upload");
  await page
    .locator('input[type="file"]')
    .and(page.getByLabel(labels.upload, { exact: true }))
    .setInputFiles({
      name: "sample.txt",
      mimeType: "text/plain",
      buffer: Buffer.from("demo"),
    });
  await expect(
    page.getByRole("progressbar", { name: /sample\.txt/ }),
  ).toHaveAttribute("aria-valuenow", "100");
});
