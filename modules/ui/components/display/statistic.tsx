import { Box, Text } from "@mantine/core";
import type { ReactNode } from "react";

type StatisticProps = {
  label: ReactNode;
  value: number;
  locale: string;
  format?: Intl.NumberFormatOptions;
  detail?: ReactNode;
};

export function Statistic({
  label,
  value,
  locale,
  format,
  detail,
}: StatisticProps) {
  return (
    <Box component="dl" m={0}>
      <Text component="dt" c="dimmed">
        {label}
      </Text>
      <Text
        component="dd"
        m={0}
        fz={28}
        fw={500}
        style={{ fontVariantNumeric: "tabular-nums" }}
      >
        {new Intl.NumberFormat(locale, format).format(value)}
      </Text>
      {detail && (
        <Text component="dd" m={0} size="xs" c="dimmed">
          {detail}
        </Text>
      )}
    </Box>
  );
}
