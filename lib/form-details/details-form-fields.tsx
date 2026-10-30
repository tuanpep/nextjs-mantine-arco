"use client";

import { Select, Text, Textarea, TextInput, Title } from "@mantine/core";
import { Fragment, type ReactNode } from "react";

import type { DetailsFieldDef } from "./types";

type FieldInputProps = {
  value?: string;
  error?: ReactNode;
  onChange?: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  onFocus?: (
    event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  onBlur?: (
    event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
};

export function DetailsFormFields<K extends string>({
  fields,
  disabled,
  getInputProps,
  getSelectValue,
  onSelectChange,
  afterField,
}: {
  fields: DetailsFieldDef<K>[];
  disabled?: boolean;
  getInputProps: (key: K) => FieldInputProps;
  getSelectValue?: (key: K) => string | null;
  onSelectChange?: (key: K, value: string) => void;
  afterField?: (key: K) => ReactNode;
}) {
  return (
    <>
      {fields
        .filter((field) => field.visible)
        .map((field) => {
          const section = field.section ? (
            <>
              <Title order={3} size="h4">
                {field.section}
              </Title>
              {field.sectionDescription ? (
                <Text size="sm" c="dimmed">
                  {field.sectionDescription}
                </Text>
              ) : null}
            </>
          ) : null;

          let control: ReactNode;
          if (field.control === "textarea") {
            control = (
              <Textarea
                disabled={disabled}
                label={field.label}
                required={field.required}
                rows={field.rows ?? 3}
                {...getInputProps(field.key)}
                placeholder={field.placeholder}
              />
            );
          } else if (field.control === "select") {
            control = (
              <Select
                disabled={disabled}
                label={field.label}
                required={field.required}
                clearable={field.clearable}
                clearButtonProps={{ "aria-label": "Xóa lựa chọn" }}
                data={field.options ?? []}
                error={getInputProps(field.key).error}
                value={getSelectValue?.(field.key) ?? null}
                onChange={(value) => onSelectChange?.(field.key, value ?? "")}
                placeholder={field.placeholder}
              />
            );
          } else {
            control = (
              <TextInput
                disabled={disabled}
                label={field.label}
                required={field.required}
                {...getInputProps(field.key)}
                placeholder={field.placeholder}
              />
            );
          }

          return (
            <Fragment key={field.key}>
              {section}
              {control}
              {afterField?.(field.key)}
            </Fragment>
          );
        })}
    </>
  );
}
