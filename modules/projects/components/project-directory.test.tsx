import { cleanup, fireEvent, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { render } from "@/test-utils/render";
import { ProjectDirectory } from "./project-directory";

afterEach(cleanup);

describe("project directory", () => {
  it("shows both applications with unique workspace destinations", () => {
    render(<ProjectDirectory />);
    expect(
      screen.getByRole("link", { name: "Open Beacon Portal" }),
    ).toHaveAttribute("href", "/projects/beacon-portal");
    expect(
      screen.getByRole("link", { name: "Open Orchid Reports" }),
    ).toHaveAttribute("href", "/projects/orchid-reports");
    expect(
      screen.getByText("Reporting and scheduled exports"),
    ).toBeInTheDocument();
  });

  it("keeps the Projects heading for legacy callers", () => {
    render(<ProjectDirectory applications={false} />);
    expect(
      screen.getByRole("heading", { name: "Projects" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Open Orchid Reports" }),
    ).toBeInTheDocument();
  });

  it("searches the registry by owner", async () => {
    render(<ProjectDirectory />);
    fireEvent.change(
      screen.getByRole("textbox", { name: "Search applications" }),
      { target: { value: "business analytics" } },
    );
    expect(
      await screen.findByRole("link", { name: "Open Orchid Reports" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: "Open Beacon Portal" }),
    ).not.toBeInTheDocument();
  });

  it("shows a clear empty state for an unmatched query", async () => {
    render(<ProjectDirectory />);
    fireEvent.change(
      screen.getByRole("textbox", { name: "Search applications" }),
      {
        target: { value: "unknown" },
      },
    );
    expect(
      await screen.findByText("No matching applications"),
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Clear search" }));
    expect(
      await screen.findByRole("link", { name: "Open Beacon Portal" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Open Orchid Reports" }),
    ).toBeInTheDocument();
  });
});
