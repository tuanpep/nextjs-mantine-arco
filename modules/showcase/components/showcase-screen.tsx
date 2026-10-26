"use client";

import {
  Accordion,
  AccordionControl,
  AccordionItem,
  AccordionPanel,
  ActionIcon,
  Alert,
  Anchor,
  Avatar,
  Badge,
  Breadcrumbs,
  Button,
  Card,
  Checkbox,
  Code,
  Divider,
  Group,
  Kbd,
  Loader,
  Menu,
  MenuDivider,
  MenuDropdown,
  MenuItem,
  MenuLabel,
  MenuTarget,
  Modal,
  NavLink,
  NumberInput,
  Pagination,
  Paper,
  PasswordInput,
  Popover,
  PopoverDropdown,
  PopoverTarget,
  Progress,
  Radio,
  RadioGroup,
  SegmentedControl,
  Select,
  Skeleton,
  Stack,
  Switch,
  Table,
  Tabs,
  TabsList,
  TabsPanel,
  TabsTab,
  Text,
  Textarea,
  TextInput,
  Title,
  Tooltip,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconDots, IconSearch } from "@tabler/icons-react";
import Link from "next/link";
import { useState, type ReactNode } from "react";

const sections = [
  "Typography",
  "Buttons",
  "Badges",
  "Inputs",
  "Selection",
  "Tabs",
  "Table",
  "Cards",
  "Feedback",
  "Overlays",
  "Navigation",
] as const;

export function ShowcaseScreen() {
  return (
    <Stack gap="xl">
      <Stack gap="sm">
        <Title order={1}>Showcase</Title>
        <Text c="dimmed">Common controls rendered with the shared theme.</Text>
        <Group gap="md">
          {sections.map((section) => (
            <Anchor key={section} href={`#${section.toLowerCase()}`} size="sm">
              {section}
            </Anchor>
          ))}
        </Group>
      </Stack>

      <ShowcaseSection title="Typography">
        <Title order={2}>Issue title</Title>
        <Title order={3}>Section</Title>
        <Title order={4}>Subsection</Title>
        <Text>
          Resetting a password returns the user to the login page, and the new
          password is rejected.
        </Text>
        <Text c="dimmed">SUP-1042 · Beacon Portal</Text>
        <Group gap="sm">
          <Anchor component={Link} href="/issues">
            Issues
          </Anchor>
          <Code>SUP-1042</Code>
          <Text>
            Press <Kbd>Ctrl</Kbd> <Kbd>K</Kbd>
          </Text>
        </Group>
      </ShowcaseSection>

      <ShowcaseSection title="Buttons">
        <Group>
          <Button>Default</Button>
          <Button variant="filled">Confirm</Button>
          <Button variant="subtle">Subtle</Button>
          <Button variant="filled" color="red">
            Danger
          </Button>
          <Button disabled>Disabled</Button>
          <Button loading>Saving</Button>
          <Button size="xs">Compact</Button>
          <ActionIcon aria-label="More actions" variant="default">
            <IconDots size={16} />
          </ActionIcon>
        </Group>
      </ShowcaseSection>

      <ShowcaseSection title="Badges">
        <Group>
          <Badge variant="light" color="blue">
            Open
          </Badge>
          <Badge variant="light" color="orange">
            Waiting
          </Badge>
          <Badge variant="light" color="green">
            Resolved
          </Badge>
          <Badge variant="light" color="red">
            Danger
          </Badge>
          <Badge variant="light" color="gray">
            Neutral
          </Badge>
          <Avatar color="blue" radius="xl">
            BP
          </Avatar>
        </Group>
      </ShowcaseSection>

      <ShowcaseSection title="Inputs">
        <InputExamples />
      </ShowcaseSection>

      <ShowcaseSection title="Selection">
        <SelectionExamples />
      </ShowcaseSection>

      <ShowcaseSection title="Tabs">
        <Tabs defaultValue="discussion">
          <TabsList>
            <TabsTab value="discussion">Discussion</TabsTab>
            <TabsTab value="activity">Activity</TabsTab>
          </TabsList>
          <TabsPanel value="discussion" pt="md">
            <Text>The new password is rejected after a reset.</Text>
          </TabsPanel>
          <TabsPanel value="activity" pt="md">
            <Text>Status set to Open</Text>
          </TabsPanel>
        </Tabs>
      </ShowcaseSection>

      <ShowcaseSection title="Table">
        <Table
          data={{
            head: ["Issue", "Project", "Status"],
            body: [
              ["SUP-1042", "Beacon Portal", "Open"],
              ["SUP-1038", "Beacon Portal", "Waiting"],
              ["SUP-1031", "Atlas Desk", "Resolved"],
            ],
          }}
        />
      </ShowcaseSection>

      <ShowcaseSection title="Cards">
        <Card>
          <Stack gap="xs">
            <Group justify="space-between">
              <Title order={3}>Login fails after password reset</Title>
              <Badge variant="light" color="blue">
                Open
              </Badge>
            </Group>
            <Text c="dimmed">SUP-1042 · Beacon Portal</Text>
            <Divider />
            <Text>
              Resetting a password returns the user to the login page.
            </Text>
          </Stack>
        </Card>
        <Paper withBorder p="md">
          <Text>Paper surface for a short note.</Text>
        </Paper>
      </ShowcaseSection>

      <ShowcaseSection title="Feedback">
        <Stack gap="sm">
          <Alert title="Open" color="blue">
            The reset link still accepts the old password.
          </Alert>
          <Alert title="Waiting" color="orange">
            Asked the reporter for the report id.
          </Alert>
          <Alert title="Resolved" color="green">
            The sender domain is verified.
          </Alert>
          <Alert title="Danger" color="red">
            The invitation could not be sent.
          </Alert>
          <Progress value={60} aria-label="Export progress" />
          <Group>
            <Loader size="sm" />
            <Skeleton height={12} width={180} />
          </Group>
        </Stack>
      </ShowcaseSection>

      <ShowcaseSection title="Overlays">
        <OverlayExamples />
      </ShowcaseSection>

      <ShowcaseSection title="Navigation">
        <NavigationExamples />
      </ShowcaseSection>
    </Stack>
  );
}

function ShowcaseSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <Stack gap="sm" id={title.toLowerCase()}>
      <Title order={2}>{title}</Title>
      {children}
    </Stack>
  );
}

function InputExamples() {
  return (
    <Stack gap="sm" maw={420}>
      <TextInput
        label="Title"
        placeholder="Short summary"
        leftSection={<IconSearch size={16} />}
      />
      <TextInput label="Title" error="Enter a title" />
      <TextInput label="Title" disabled placeholder="Closed issue" />
      <Textarea label="Comment" placeholder="Write a comment" minRows={3} />
      <PasswordInput label="Password" placeholder="New password" />
      <NumberInput label="Pages" defaultValue={12} min={1} />
      <Select
        label="Project"
        placeholder="Choose a project"
        data={["Beacon Portal", "Atlas Desk"]}
        defaultValue="Beacon Portal"
      />
    </Stack>
  );
}

function SelectionExamples() {
  const [resolved, setResolved] = useState(false);
  const [status, setStatus] = useState("Open");
  const [notify, setNotify] = useState(true);
  const [view, setView] = useState("discussion");

  return (
    <Stack gap="md">
      <Checkbox
        label="Include resolved issues"
        checked={resolved}
        onChange={(event) => setResolved(event.currentTarget.checked)}
      />
      <RadioGroup label="Status" value={status} onChange={setStatus}>
        <Group mt="xs">
          <Radio value="Open" label="Open" />
          <Radio value="Waiting" label="Waiting" />
          <Radio value="Resolved" label="Resolved" />
        </Group>
      </RadioGroup>
      <Switch
        label="Email updates"
        checked={notify}
        onChange={(event) => setNotify(event.currentTarget.checked)}
      />
      <SegmentedControl
        aria-label="Issue view"
        value={view}
        onChange={setView}
        data={[
          { label: "Discussion", value: "discussion" },
          { label: "Activity", value: "activity" },
        ]}
      />
    </Stack>
  );
}

function OverlayExamples() {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <Group>
      <Menu>
        <MenuTarget>
          <Button>Actions</Button>
        </MenuTarget>
        <MenuDropdown>
          <MenuLabel>Issue</MenuLabel>
          <MenuItem>Edit</MenuItem>
          <MenuDivider />
          <MenuItem color="red">Delete</MenuItem>
        </MenuDropdown>
      </Menu>
      <Popover>
        <PopoverTarget>
          <Button>Details</Button>
        </PopoverTarget>
        <PopoverDropdown>
          <Text>SUP-1042 is open in Beacon Portal.</Text>
        </PopoverDropdown>
      </Popover>
      <Tooltip label="Copy issue id">
        <Button>SUP-1042</Button>
      </Tooltip>
      <Button onClick={open}>Open modal</Button>
      <Modal opened={opened} onClose={close} title="Close issue">
        <Stack gap="md">
          <Text>Mark SUP-1042 as resolved?</Text>
          <Group justify="flex-end">
            <Button onClick={close}>Cancel</Button>
            <Button variant="filled" onClick={close}>
              Resolve
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Group>
  );
}

function NavigationExamples() {
  const [page, setPage] = useState(1);

  return (
    <Stack gap="md">
      <Breadcrumbs>
        <Anchor component={Link} href="/issues">
          Issues
        </Anchor>
        <Anchor component={Link} href="/showcase">
          Showcase
        </Anchor>
        <Text>Buttons</Text>
      </Breadcrumbs>
      <Pagination
        total={5}
        value={page}
        onChange={setPage}
        aria-label="Issue pages"
      />
      <Accordion>
        <AccordionItem value="discussion">
          <AccordionControl>Discussion</AccordionControl>
          <AccordionPanel>
            The new password is rejected after a reset.
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem value="activity">
          <AccordionControl>Activity</AccordionControl>
          <AccordionPanel>Status set to Open</AccordionPanel>
        </AccordionItem>
      </Accordion>
      <NavLink
        component="button"
        label="Login fails after password reset"
        description="SUP-1042 · Beacon Portal"
        active
      />
    </Stack>
  );
}
