"use client";

import {
  Box,
  Button,
  CloseButton,
  Combobox,
  Group,
  Pill,
  PillsInput,
  UnstyledButton,
  useCombobox,
} from "@mantine/core";
import { useEffect, useRef, useState } from "react";

export const filterOperators = ["is", "isNot"] as const;
export type FilterOperator = (typeof filterOperators)[number];

export type FilterChoice = {
  value: string;
  label: string;
};

export type FilterField = {
  type: string;
  title: string;
  options: FilterChoice[];
  operators?: readonly FilterOperator[];
};

export type FilterQuery = {
  type: string;
  operator: FilterOperator;
  value: string;
};

type Stage = "key" | "operator" | "value";

type Suggestion = {
  id: string;
  label: string;
};

export function FilteredSearch({
  fields,
  queries,
  onQueriesChange,
  terms,
  onTermsChange,
  onSearch,
  inputLabel,
  placeholder,
  searchLabel,
  clearLabel,
  operatorLabel,
  emptyLabel,
}: {
  fields: FilterField[];
  queries: FilterQuery[];
  onQueriesChange: (queries: FilterQuery[]) => void;
  terms: string;
  onTermsChange: (terms: string) => void;
  onSearch: () => void;
  inputLabel: string;
  placeholder: string;
  searchLabel: string;
  clearLabel: string;
  operatorLabel: (operator: FilterOperator) => string;
  emptyLabel: string;
}) {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });
  const [stage, setStage] = useState<Stage>("key");
  const [draftType, setDraftType] = useState<string | null>(null);
  const [draftOperator, setDraftOperator] = useState<FilterOperator | null>(
    null,
  );
  const [text, setText] = useState("");
  const textRef = useRef("");
  const [replaceIndex, setReplaceIndex] = useState<number | null>(null);

  function setDraftText(value: string) {
    textRef.current = value;
    setText(value);
  }

  const suggestions = listSuggestions({
    fields,
    queries,
    stage,
    draftType,
    text,
    replaceIndex,
    operatorLabel,
  });
  const suggestionKey = suggestions.map((item) => item.id).join("\n");

  useEffect(() => {
    if (!combobox.dropdownOpened) return;
    if (suggestions.length === 0) {
      combobox.resetSelectedOption();
      return;
    }
    combobox.selectFirstOption();
  }, [combobox, suggestionKey, suggestions.length]);

  const showClear = queries.length > 0 || terms.length > 0 || text.length > 0;

  function resetDraft() {
    setStage("key");
    setDraftType(null);
    setDraftOperator(null);
    setReplaceIndex(null);
    setDraftText("");
  }

  function commitTerms(nextText: string) {
    const addition = nextText.trim();
    setDraftText("");
    if (!addition) return;
    const current = terms.trim();
    onTermsChange(current ? `${current} ${addition}` : addition);
  }

  function unusedFields(source: FilterQuery[]) {
    const used = new Set(
      source
        .filter((_, index) => index !== replaceIndex)
        .map((query) => query.type),
    );
    return fields.some((field) => !used.has(field.type));
  }

  function openKeys() {
    if (!unusedFields(queries)) {
      combobox.closeDropdown();
      return;
    }
    combobox.openDropdown();
  }

  function choose(id: string) {
    if (id.startsWith("key:")) {
      setDraftType(id.slice(4));
      setDraftOperator(null);
      setStage("operator");
      setDraftText("");
      combobox.openDropdown();
      return;
    }

    if (id.startsWith("op:")) {
      const operator = parseOperator(id.slice(3));
      if (!operator) return;
      setDraftOperator(operator);
      setStage("value");
      setDraftText("");
      combobox.openDropdown();
      return;
    }

    if (!id.startsWith("value:") || !draftType || !draftOperator) return;
    const nextQuery: FilterQuery = {
      type: draftType,
      operator: draftOperator,
      value: id.slice(6),
    };
    const next =
      replaceIndex === null
        ? [...queries, nextQuery]
        : queries.map((query, index) =>
            index === replaceIndex ? nextQuery : query,
          );
    onQueriesChange(next);
    resetDraft();
    if (unusedFields(next)) combobox.openDropdown();
    else combobox.closeDropdown();
  }

  function edit(index: number, nextStage: Stage) {
    const query = queries[index];
    if (!query) return;
    setReplaceIndex(index);
    setDraftType(query.type);
    setDraftOperator(nextStage === "key" ? null : query.operator);
    setStage(nextStage);
    setDraftText("");
    combobox.openDropdown();
  }

  function search() {
    if (stage === "key") commitTerms(textRef.current);
    else resetDraft();
    onSearch();
    combobox.closeDropdown();
  }

  function clear() {
    onQueriesChange([]);
    onTermsChange("");
    resetDraft();
    combobox.closeDropdown();
  }

  return (
    <Group gap="xs" wrap="nowrap" align="flex-start" style={{ flex: 1 }}>
      <Box style={{ flex: 1, minWidth: 0 }}>
        <Combobox store={combobox} onOptionSubmit={choose} withinPortal>
          <Combobox.Target>
            <PillsInput
              style={{ flex: 1 }}
              rightSection={
                showClear ? (
                  <CloseButton
                    aria-label={clearLabel}
                    onMouseDown={(event) => event.stopPropagation()}
                    onClick={clear}
                  />
                ) : null
              }
              rightSectionPointerEvents="all"
            >
              <Pill.Group>
                {queries.map((query, index) => {
                  const field = fields.find((item) => item.type === query.type);
                  const title = field?.title ?? query.type;
                  const value =
                    field?.options.find((item) => item.value === query.value)
                      ?.label ?? query.value;
                  const summary = `${title} ${operatorLabel(query.operator)} ${value}`;
                  return (
                    <Pill
                      key={`${query.type}-${query.operator}-${query.value}`}
                      withRemoveButton
                      removeButtonProps={{
                        "aria-label": `${clearLabel}: ${summary}`,
                        "aria-hidden": false,
                        tabIndex: 0,
                      }}
                      onRemove={() =>
                        onQueriesChange(
                          queries.filter((_, itemIndex) => itemIndex !== index),
                        )
                      }
                    >
                      <Group gap={4} wrap="nowrap">
                        <TokenPart
                          label={title}
                          onClick={() => edit(index, "key")}
                        />
                        <TokenPart
                          label={operatorLabel(query.operator)}
                          onClick={() => edit(index, "operator")}
                        />
                        <TokenPart
                          label={value}
                          onClick={() => edit(index, "value")}
                        />
                      </Group>
                    </Pill>
                  );
                })}
                {terms ? (
                  <Pill
                    withRemoveButton
                    removeButtonProps={{
                      "aria-label": `${clearLabel}: ${terms}`,
                      "aria-hidden": false,
                      tabIndex: 0,
                    }}
                    onRemove={() => onTermsChange("")}
                  >
                    {terms}
                  </Pill>
                ) : null}
                <PillsInput.Field
                  aria-label={inputLabel}
                  placeholder={
                    queries.length === 0 && !terms ? placeholder : ""
                  }
                  value={text}
                  onClick={openKeys}
                  onFocus={openKeys}
                  onBlur={() => {
                    if (stage === "key") commitTerms(textRef.current);
                    else resetDraft();
                    combobox.closeDropdown();
                  }}
                  onChange={(event) => {
                    setDraftText(event.currentTarget.value);
                    openKeys();
                  }}
                  onKeyDown={(event) => {
                    if (
                      event.key === "Backspace" &&
                      text === "" &&
                      replaceIndex === null &&
                      queries.length > 0
                    ) {
                      event.preventDefault();
                      onQueriesChange(queries.slice(0, -1));
                      return;
                    }
                    if (event.key === "ArrowDown") {
                      event.preventDefault();
                      openKeys();
                      combobox.selectNextOption();
                      return;
                    }
                    if (event.key === "ArrowUp") {
                      event.preventDefault();
                      combobox.selectPreviousOption();
                      return;
                    }
                    if (event.key === "Escape") {
                      combobox.closeDropdown();
                      return;
                    }
                    if (event.key === "Enter") {
                      event.preventDefault();
                      if (
                        suggestions.length > 0 &&
                        combobox.getSelectedOptionIndex() >= 0
                      ) {
                        combobox.clickSelectedOption();
                        return;
                      }
                      search();
                    }
                  }}
                />
              </Pill.Group>
            </PillsInput>
          </Combobox.Target>
          <Combobox.Dropdown
            hidden={fields.length === 0 && stage === "key"}
            onMouseDown={(event) => event.preventDefault()}
          >
            <Combobox.Options>
              {suggestions.length === 0 ? (
                <Combobox.Empty>{emptyLabel}</Combobox.Empty>
              ) : (
                suggestions.map((suggestion) => (
                  <Combobox.Option key={suggestion.id} value={suggestion.id}>
                    {suggestion.label}
                  </Combobox.Option>
                ))
              )}
            </Combobox.Options>
          </Combobox.Dropdown>
        </Combobox>
      </Box>
      <Button type="button" onClick={search}>
        {searchLabel}
      </Button>
    </Group>
  );
}

function TokenPart({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <UnstyledButton
      type="button"
      aria-label={label}
      onMouseDown={(event) => {
        event.preventDefault();
        event.stopPropagation();
      }}
      onClick={onClick}
      style={{ font: "inherit", color: "inherit" }}
    >
      {label}
    </UnstyledButton>
  );
}

function listSuggestions({
  fields,
  queries,
  stage,
  draftType,
  text,
  replaceIndex,
  operatorLabel,
}: {
  fields: FilterField[];
  queries: FilterQuery[];
  stage: Stage;
  draftType: string | null;
  text: string;
  replaceIndex: number | null;
  operatorLabel: (operator: FilterOperator) => string;
}): Suggestion[] {
  const needle = text.trim().toLowerCase();
  const used = new Set(
    queries
      .filter((_, index) => index !== replaceIndex)
      .map((query) => query.type),
  );

  switch (stage) {
    case "key":
      return fields
        .filter((field) => !used.has(field.type))
        .filter((field) => field.title.toLowerCase().includes(needle))
        .map((field) => ({ id: `key:${field.type}`, label: field.title }));
    case "operator": {
      const field = fields.find((item) => item.type === draftType);
      const operators = field?.operators ?? filterOperators;
      return operators
        .filter((operator) =>
          operatorLabel(operator).toLowerCase().includes(needle),
        )
        .map((operator) => ({
          id: `op:${operator}`,
          label: operatorLabel(operator),
        }));
    }
    case "value": {
      const field = fields.find((item) => item.type === draftType);
      return (field?.options ?? [])
        .filter((option) => option.label.toLowerCase().includes(needle))
        .map((option) => ({
          id: `value:${option.value}`,
          label: option.label,
        }));
    }
    default: {
      const neverStage: never = stage;
      return neverStage;
    }
  }
}

function parseOperator(value: string): FilterOperator | null {
  switch (value) {
    case "is":
    case "isNot":
      return value;
    default:
      return null;
  }
}
