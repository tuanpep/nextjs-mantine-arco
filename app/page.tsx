import { Container, Stack, Text, Title } from "@mantine/core";

export default function HomePage() {
  return (
    <Container size="sm" py="xl">
      <Stack gap="xs">
        <Title order={1}>Next.js FE</Title>
        <Text c="dimmed">Mantine UI is set up for this app.</Text>
      </Stack>
    </Container>
  );
}
