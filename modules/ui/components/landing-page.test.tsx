import { cleanup, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { afterEach, expect, test } from "vitest";

import messages from "@/messages/en.json";
import vi from "@/messages/vi.json";
import { render } from "@/test-utils/render";

import { LandingPage } from "./landing-page";

afterEach(cleanup);

test("renders localized welcome copy", () => {
  render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <LandingPage />
    </NextIntlClientProvider>,
  );
  expect(
    screen.getByRole("heading", { name: messages.Home.title }),
  ).toBeInTheDocument();
});

test("renders Vietnamese copy", () => {
  render(
    <NextIntlClientProvider locale="vi" messages={vi}>
      <LandingPage />
    </NextIntlClientProvider>,
  );
  expect(
    screen.getByRole("heading", { name: vi.Home.title }),
  ).toBeInTheDocument();
});
