import { expect, test, type Locator } from "@playwright/test";

async function centerY(locator: Locator) {
  return locator.evaluate((element) => {
    const { y, height } = element.getBoundingClientRect();
    return y + height / 2;
  });
}

async function expectAligned(a: Locator, b: Locator) {
  await expect
    .poll(async () => Math.abs((await centerY(a)) - (await centerY(b))))
    .toBeLessThanOrEqual(0.5);
}

for (const component of ["Checkbox", "Radio"] as const) {
  test(`${component} marks align with labels, including described choices`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(`/components/${component.toLowerCase()}`);
    const preview = page.getByRole("article", { name: component });
    const control = preview.getByRole(
      component === "Checkbox" ? "checkbox" : "radio",
      { name: "Selected" },
    );
    const described = preview.getByRole(
      component === "Checkbox" ? "checkbox" : "radio",
      { name: component === "Checkbox" ? "Optional" : "Alternative" },
    );
    const disabled = preview.getByRole(
      component === "Checkbox" ? "checkbox" : "radio",
      { name: "Unavailable" },
    );
    const describedLabel = preview
      .locator(`.mantine-${component}-label`)
      .nth(1);
    await expect(control).toHaveCSS("width", "14px");
    await expect(control).toHaveCSS("height", "14px");
    await expect(control).toHaveCSS(
      "border-top-left-radius",
      component === "Checkbox" ? "2px" : "14px",
    );
    await expectAligned(
      control,
      preview.getByText("Selected", { exact: true }),
    );
    await expectAligned(
      control,
      preview.locator(`.mantine-${component}-icon`).first(),
    );
    await expectAligned(described, describedLabel);
    await expectAligned(
      disabled,
      preview.getByText("Unavailable", { exact: true }),
    );
    await expect(disabled).toBeDisabled();
    await described.press("Space");
    await expect(described).toBeChecked();
  });
}

test("switch thumb, track, and label share a center line", async ({ page }) => {
  await page.goto("/components/switch");
  const preview = page.getByRole("article", { name: "Switch" });
  const track = preview.locator(".mantine-Switch-track");
  const thumb = preview.locator(".mantine-Switch-thumb");
  await expectAligned(track, preview.getByText("Enabled", { exact: true }));
  await expectAligned(track, thumb);
});

test("avatars are circular at different sizes and still accept custom corners", async ({
  page,
}) => {
  await page.goto("/components/avatar");
  const avatars = page
    .getByRole("article", { name: "Avatar" })
    .locator(".mantine-Avatar-root");
  for (const [index, size] of [
    [0, 40],
    [1, 56],
  ] as const) {
    const avatar = avatars.nth(index);
    await expect(avatar).toHaveCSS("width", `${size}px`);
    await expect(avatar).toHaveCSS("height", `${size}px`);
    await expect(avatar).toHaveCSS("border-radius", "50%");
    await expect(avatar.locator(".mantine-Avatar-placeholder")).toHaveCSS(
      "border-radius",
      "50%",
    );
  }
  await expect(avatars.nth(2)).toHaveCSS("border-radius", "4px");
});

test("indicator dot is anchored to the avatar, not the preview card", async ({
  page,
}) => {
  await page.goto("/components/indicator");
  const preview = page.getByRole("article", { name: "Indicator" });
  const avatar = preview.locator(".mantine-Avatar-root");
  const dot = preview.locator(".mantine-Indicator-indicator");
  await expect
    .poll(async () => {
      const avatarRight = await avatar.evaluate(
        (element) => element.getBoundingClientRect().right,
      );
      const dotCenter = await dot.evaluate((element) => {
        const { x, width } = element.getBoundingClientRect();
        return x + width / 2;
      });
      return Math.abs(avatarRight - dotCenter);
    })
    .toBeLessThanOrEqual(0.5);
});
