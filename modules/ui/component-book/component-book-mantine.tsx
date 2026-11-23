"use client";

import {
  Accordion,
  ActionIcon,
  Alert,
  AppShell,
  Autocomplete,
  Avatar,
  Badge,
  Breadcrumbs,
  Button,
  Card,
  Cascader,
  Checkbox,
  Combobox,
  ComboboxChevron,
  DataList,
  Divider,
  Drawer,
  EmptyState,
  Group,
  Indicator,
  Input,
  Menu,
  Modal,
  MultiSelect,
  NativeSelect,
  NavLink,
  Notification,
  Overlay,
  Pagination,
  Paper,
  Pill,
  Popover,
  Progress,
  Radio,
  RangeSlider,
  Rating,
  RingProgress,
  SegmentedControl,
  Select,
  Skeleton,
  Slider,
  Stack,
  Stepper,
  Switch,
  Table,
  Tabs,
  TagsInput,
  Text,
  Timeline,
  Tooltip,
  Tree,
  TreeSelect,
  useCombobox,
} from "@mantine/core";
import { useTranslations } from "next-intl";
import { useState } from "react";

const treeData = [
  {
    value: "projects",
    label: "Projects",
    children: [
      { value: "design", label: "Design" },
      { value: "code", label: "Code" },
    ],
  },
];

function ComboboxPreview() {
  const store = useCombobox();
  const [value, setValue] = useState("Choose an option");
  return (
    <Combobox
      store={store}
      onOptionSubmit={(option) => {
        setValue(option);
        store.closeDropdown();
      }}
    >
      <Combobox.Target>
        <Button variant="default" onClick={() => store.toggleDropdown()}>
          {value}
        </Button>
      </Combobox.Target>
      <Combobox.Dropdown>
        <Combobox.Options>
          <Combobox.Option value="Design">Design</Combobox.Option>
          <Combobox.Option value="Code">Code</Combobox.Option>
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
}

function OverlayPreview({ kind }: { kind: "Modal" | "Drawer" }) {
  const [opened, setOpened] = useState(false);
  const content = <Text>Preview content</Text>;
  return (
    <>
      <Button onClick={() => setOpened(true)}>Open {kind}</Button>
      {kind === "Modal" ? (
        <Modal opened={opened} onClose={() => setOpened(false)} title="Modal">
          {content}
        </Modal>
      ) : (
        <Drawer opened={opened} onClose={() => setOpened(false)} title="Drawer">
          {content}
        </Drawer>
      )}
    </>
  );
}

export function useMantinePreviews() {
  const t = useTranslations("ComponentBook.components");
  const status = useTranslations("ComponentBook.status");
  const options = (["published", "review", "draft"] as const).map((value) => ({
    value,
    label: status(value),
  }));
  return {
    Button: (
      <Group gap="xs">
        <Button size="md">{t("primary")}</Button>
        <Button size="md" variant="default">
          {t("secondary")}
        </Button>
        <Button size="md" variant="outline">
          {t("outline")}
        </Button>
        <Button size="md" variant="light">
          {t("light")}
        </Button>
        <Button size="md" variant="subtle">
          {t("subtle")}
        </Button>
        <Button size="md" color="red">
          {t("danger")}
        </Button>
      </Group>
    ),
    ActionIcon: <ActionIcon aria-label="Add">+</ActionIcon>,
    Input: <Input aria-label="Name" placeholder="Name" />,
    Checkbox: (
      <Stack>
        <Checkbox label="Selected" defaultChecked />
        <Checkbox
          label="Optional"
          size="md"
          description="This choice can be changed later."
        />
        <Checkbox label="Unavailable" size="xs" disabled />
      </Stack>
    ),
    Radio: (
      <Stack>
        <Radio label="Selected" name="component-book-radio" defaultChecked />
        <Radio
          label="Alternative"
          name="component-book-radio"
          size="md"
          description="Choose one option."
        />
        <Radio
          label="Unavailable"
          name="component-book-radio"
          size="xs"
          disabled
        />
      </Stack>
    ),
    Switch: <Switch label="Enabled" defaultChecked />,
    SegmentedControl: (
      <SegmentedControl data={["Daily", "Weekly", "Monthly"]} />
    ),
    Combobox: <ComboboxPreview />,
    ComboboxChevron: <ComboboxChevron />,
    Select: (
      <Select
        label={t("searchableSelect")}
        searchable
        data={options}
        nothingFoundMessage={t("nothingFound")}
      />
    ),
    MultiSelect: (
      <MultiSelect
        label={t("searchableMultiSelect")}
        searchable
        data={options}
        nothingFoundMessage={t("nothingFound")}
      />
    ),
    NativeSelect: <NativeSelect label="Status" data={options} />,
    Autocomplete: (
      <Autocomplete label="Project" data={["Design", "Code", "Research"]} />
    ),
    TagsInput: (
      <TagsInput
        label="Tags"
        defaultValue={["Design"]}
        data={["Design", "Code"]}
      />
    ),
    Cascader: <Cascader label="Project" data={treeData} withColumns={false} />,
    TreeSelect: <TreeSelect label="Project" data={treeData} />,
    Slider: <Slider thumbLabel="Value" defaultValue={40} />,
    RangeSlider: <RangeSlider thumbLabel="Range" defaultValue={[20, 70]} />,
    Rating: <Rating aria-label="Rating" defaultValue={3} />,
    Menu: (
      <Menu>
        <Menu.Target>
          <Button variant="default">Open menu</Button>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item>Edit</Menu.Item>
          <Menu.Item>Archive</Menu.Item>
        </Menu.Dropdown>
      </Menu>
    ),
    Popover: (
      <Popover>
        <Popover.Target>
          <Button variant="default">Open popover</Button>
        </Popover.Target>
        <Popover.Dropdown>Popover content</Popover.Dropdown>
      </Popover>
    ),
    Tooltip: (
      <Tooltip
        label="Helpful detail"
        events={{ hover: true, focus: true, touch: false }}
      >
        <Button variant="default">Hover or focus</Button>
      </Tooltip>
    ),
    Overlay: (
      <Paper pos="relative" h={80} p="md" withBorder>
        <Text>Background</Text>
        <Overlay color="#000" backgroundOpacity={0.35} />
      </Paper>
    ),
    Modal: <OverlayPreview kind="Modal" />,
    Drawer: <OverlayPreview kind="Drawer" />,
    Card: (
      <Card withBorder padding="md">
        <Text fw={500}>Card</Text>
        <Text size="sm">Card content</Text>
      </Card>
    ),
    Paper: (
      <Paper withBorder p="md">
        Paper content
      </Paper>
    ),
    AppShell: (
      <AppShell mode="static" header={{ height: 40 }} padding="sm" withBorder>
        <AppShell.Header p="xs">Header</AppShell.Header>
        <AppShell.Main renderRoot={(props) => <div {...props} />}>
          Main content
        </AppShell.Main>
      </AppShell>
    ),
    Table: (
      <Table.ScrollContainer minWidth={300}>
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Name</Table.Th>
              <Table.Th>Status</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            <Table.Tr>
              <Table.Td>Project</Table.Td>
              <Table.Td>{status("published")}</Table.Td>
            </Table.Tr>
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>
    ),
    Tabs: (
      <Tabs defaultValue="overview">
        <Tabs.List>
          <Tabs.Tab value="overview">{t("tab.overview")}</Tabs.Tab>
          <Tabs.Tab value="analytics">{t("tab.analytics")}</Tabs.Tab>
          <Tabs.Tab value="settings">{t("tab.settings")}</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="overview" pt="sm">
          {t("tabOverviewBody")}
        </Tabs.Panel>
        <Tabs.Panel value="analytics" pt="sm">
          {t("tabAnalyticsBody")}
        </Tabs.Panel>
        <Tabs.Panel value="settings" pt="sm">
          {t("tabSettingsBody")}
        </Tabs.Panel>
      </Tabs>
    ),
    NavLink: <NavLink href="#preview-NavLink" label="Overview" active />,
    Pagination: <Pagination total={8} defaultValue={1} />,
    Accordion: (
      <Accordion>
        <Accordion.Item value="details">
          <Accordion.Control>Details</Accordion.Control>
          <Accordion.Panel>More information</Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    ),
    Avatar: (
      <Group>
        <Avatar name="Alex Morgan" color="initials" />
        <Avatar size={56} name="Samira Khan" color="initials" />
        <Avatar name="Morgan Lee" radius="sm" />
      </Group>
    ),
    Breadcrumbs: (
      <Breadcrumbs>
        <a href="#main-content">Home</a>
        <span>Projects</span>
      </Breadcrumbs>
    ),
    Divider: <Divider label="Section" />,
    Stepper: (
      <Stepper active={1} size="xs">
        <Stepper.Step label="Start" />
        <Stepper.Step label="Review" />
        <Stepper.Step label="Done" />
      </Stepper>
    ),
    Timeline: (
      <Timeline active={1}>
        <Timeline.Item title="Created" />
        <Timeline.Item title="Reviewed" />
      </Timeline>
    ),
    DataList: (
      <DataList>
        <DataList.Item>
          <DataList.ItemLabel>Status</DataList.ItemLabel>
          <DataList.ItemValue>{status("published")}</DataList.ItemValue>
        </DataList.Item>
      </DataList>
    ),
    EmptyState: (
      <EmptyState title="No items" description="Add an item to get started." />
    ),
    Indicator: (
      <Indicator w="fit-content">
        <Avatar name="Alex Morgan" />
      </Indicator>
    ),
    Notification: (
      <Notification title="Saved" withCloseButton={false}>
        Changes saved.
      </Notification>
    ),
    Progress: <Progress value={60} aria-label="Progress" />,
    RingProgress: (
      <RingProgress
        sections={[{ value: 60, color: "blue" }]}
        label={<Text ta="center">60%</Text>}
      />
    ),
    Skeleton: (
      <Stack>
        <Skeleton height={12} />
        <Skeleton height={12} width="70%" />
      </Stack>
    ),
    Tree: <Tree data={treeData} />,
    Alert: <Alert title="Notice">Changes are ready to review.</Alert>,
    Badge: (
      <Group>
        <Badge>{status("published")}</Badge>
        <Badge color="orange">{status("review")}</Badge>
        <Badge color="gray">{status("draft")}</Badge>
      </Group>
    ),
    Pill: <Pill>Design</Pill>,
  };
}
