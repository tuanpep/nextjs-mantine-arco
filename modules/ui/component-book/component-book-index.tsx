"use client";

import { Anchor, Card, List, SimpleGrid, Stack, Title } from "@mantine/core";
import { useTranslations } from "next-intl";
import Link from "next/link";

import { categories, components } from "./component-catalog";

export function ComponentBookIndex() {
  const t = useTranslations("ComponentBook");

  return (
    <Stack gap="lg">
      <Title>{t("title")}</Title>
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
        {categories.map((category) => (
          <Card
            key={category}
            withBorder
            component="section"
            aria-labelledby={`index-${category}`}
          >
            <Stack gap="xs">
              <Title order={2} id={`index-${category}`}>
                {t(`categories.${category}`)}
              </Title>
              <List listStyleType="none" spacing={4}>
                {components
                  .filter((entry) => entry.category === category)
                  .map(({ name, href }) => (
                    <List.Item key={name}>
                      <Anchor component={Link} href={href} prefetch={false}>
                        {name}
                      </Anchor>
                    </List.Item>
                  ))}
              </List>
            </Stack>
          </Card>
        ))}
      </SimpleGrid>
    </Stack>
  );
}
