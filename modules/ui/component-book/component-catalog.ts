export const categories = [
  "inputs",
  "navigation",
  "overlays",
  "display",
  "feedback",
] as const;

const catalog = {
  Accordion: "display",
  ActionIcon: "inputs",
  Alert: "feedback",
  AppShell: "display",
  Autocomplete: "inputs",
  Avatar: "display",
  BackTop: "navigation",
  Badge: "display",
  Breadcrumbs: "navigation",
  Button: "inputs",
  Card: "display",
  Cascader: "inputs",
  Checkbox: "inputs",
  Combobox: "inputs",
  ComboboxChevron: "inputs",
  Comment: "display",
  DataList: "display",
  DataTable: "display",
  Divider: "display",
  Drawer: "overlays",
  EmptyState: "feedback",
  Indicator: "display",
  Input: "inputs",
  Mentions: "inputs",
  Menu: "overlays",
  Message: "feedback",
  Modal: "overlays",
  MultiSelect: "inputs",
  NativeSelect: "inputs",
  NavLink: "navigation",
  Notification: "feedback",
  Overlay: "overlays",
  PageHeader: "navigation",
  Pagination: "navigation",
  Paper: "display",
  Pill: "display",
  Popconfirm: "overlays",
  Popover: "overlays",
  Progress: "feedback",
  Radio: "inputs",
  RangeSlider: "inputs",
  Rating: "inputs",
  ResizeBox: "display",
  Result: "feedback",
  RingProgress: "feedback",
  SegmentedControl: "inputs",
  Select: "inputs",
  Skeleton: "feedback",
  Slider: "inputs",
  Statistic: "display",
  Stepper: "navigation",
  Switch: "inputs",
  Table: "display",
  Tabs: "navigation",
  TagsInput: "inputs",
  Timeline: "display",
  Tooltip: "overlays",
  Transfer: "inputs",
  Tree: "navigation",
  TreeSelect: "inputs",
  Trigger: "overlays",
  Upload: "inputs",
  Watermark: "display",
} satisfies Record<string, (typeof categories)[number]>;

export type ComponentName = keyof typeof catalog;

function isComponentName(name: string): name is ComponentName {
  return Object.hasOwn(catalog, name);
}

export const components = Object.keys(catalog)
  .filter(isComponentName)
  .map((name) => {
    const slug = name.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
    return { name, category: catalog[name], slug, href: `/components/${slug}` };
  });
