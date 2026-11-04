import { expect, test } from "@playwright/test";

test("queue tabs expose labelled content and support arrow keys", async ({
  page,
}) => {
  await page.goto("/projects/beacon-portal/support/bugs");
  const tabs = page.getByRole("tablist");
  const first = tabs.getByRole("tab").first();
  await expect(first).toHaveAttribute("aria-selected", "true");
  await first.focus();
  await first.press("ArrowRight");
  const selected = tabs.getByRole("tab", { selected: true });
  await expect(selected).toBeFocused();
  await expect(page).toHaveURL(/view=resolved/);
  const panel = page.getByRole("tabpanel");
  await expect(selected).toHaveAttribute(
    "aria-controls",
    (await panel.getAttribute("id")) ?? "",
  );
  await expect(panel).toHaveAttribute(
    "aria-labelledby",
    (await selected.getAttribute("id")) ?? "",
  );
  await expect(panel).toBeVisible();
});

test("all module collections fit narrow screens and keep views above content", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  for (const section of [
    "support/bugs",
    "support/help",
    "ideas/features",
    "ideas/feedback",
    "guides",
    "discussions",
  ]) {
    await page.goto(`/projects/beacon-portal/${section}`);
    await expect(
      page.getByRole("main").getByRole("heading", { level: 1 }),
    ).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
    if (section !== "guides") {
      await expect(page.getByRole("tabpanel")).toBeVisible();
      const selected = page.getByRole("tab", { selected: true });
      await expect(selected).toBeVisible();
      const tabBox = await selected.boundingBox();
      const panelBox = await page.getByRole("tabpanel").boundingBox();
      expect(tabBox && panelBox && tabBox.y < panelBox.y).toBe(true);
    }
  }
});
