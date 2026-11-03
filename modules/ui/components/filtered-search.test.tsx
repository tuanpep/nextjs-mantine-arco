import { cleanup, fireEvent, screen } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";

import { render } from "@/test-utils/render";

import { FilteredSearch, type FilterQuery } from "./filtered-search";

afterEach(cleanup);

const severity = {
  type: "severity",
  title: "Severity",
  options: [
    { value: "High", label: "High" },
    { value: "Low", label: "Low" },
  ],
};

function renderSearch(queries: FilterQuery[] = []) {
  const onQueriesChange = vi.fn();
  const onTermsChange = vi.fn();
  const onSearch = vi.fn();
  render(
    <FilteredSearch
      fields={[severity]}
      queries={queries}
      onQueriesChange={onQueriesChange}
      terms=""
      onTermsChange={onTermsChange}
      onSearch={onSearch}
      inputLabel="Search"
      placeholder="Search this list"
      searchLabel="Search"
      clearLabel="Clear filters"
      emptyLabel="No matching filters"
      operatorLabel={(operator) => (operator === "is" ? "is" : "is not")}
    />,
  );
  return { onQueriesChange, onTermsChange, onSearch };
}

test("builds a key, operator, and value token", () => {
  const { onQueriesChange } = renderSearch();

  fireEvent.focus(screen.getByRole("textbox", { name: "Search" }));
  fireEvent.click(screen.getByRole("option", { name: "Severity" }));
  fireEvent.click(screen.getByRole("option", { name: "is" }));
  fireEvent.click(screen.getByRole("option", { name: "High" }));

  expect(onQueriesChange).toHaveBeenCalledWith([
    { type: "severity", operator: "is", value: "High" },
  ]);
});

test("commits typed text as a search term", () => {
  const { onTermsChange, onSearch } = renderSearch();
  const field = screen.getByRole("textbox", { name: "Search" });

  fireEvent.change(field, { target: { value: "login" } });
  fireEvent.keyDown(field, { key: "Enter" });

  expect(onTermsChange).toHaveBeenCalledWith("login");
  expect(onSearch).toHaveBeenCalled();
});

test("clears tokens and terms", () => {
  const { onQueriesChange, onTermsChange } = renderSearch([
    { type: "severity", operator: "is", value: "High" },
  ]);

  fireEvent.click(screen.getByRole("button", { name: "Clear filters" }));

  expect(onQueriesChange).toHaveBeenCalledWith([]);
  expect(onTermsChange).toHaveBeenCalledWith("");
});
