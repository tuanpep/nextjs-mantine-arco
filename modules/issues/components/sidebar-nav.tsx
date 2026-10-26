"use client";

import { NavLink, Stack, Tooltip } from "@mantine/core";
import { useHash } from "@mantine/hooks";
import {
  IconAdjustments,
  IconAlertCircle,
  IconBadge,
  IconBrowser,
  IconCards,
  IconClick,
  IconComponents,
  IconForms,
  IconLayout,
  IconListDetails,
  IconPalette,
  IconRoute,
  IconSearch,
  IconSquareCheck,
  IconStack2,
  IconTable,
  IconTypography,
} from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type NavIcon = typeof IconSearch;

type NavItem = {
  label: string;
  href?: string;
  icon: NavIcon;
  children?: NavItem[];
};

const navigation: NavItem[] = [
  {
    label: "Issues",
    href: "/issues",
    icon: IconListDetails,
  },
  {
    label: "Showcase",
    href: "/showcase",
    icon: IconComponents,
  },
  {
    label: "Foundations",
    icon: IconPalette,
    children: [
      {
        label: "Typography",
        href: "/showcase#typography",
        icon: IconTypography,
      },
      { label: "Buttons", href: "/showcase#buttons", icon: IconClick },
      { label: "Badges", href: "/showcase#badges", icon: IconBadge },
    ],
  },
  {
    label: "Controls",
    icon: IconAdjustments,
    children: [
      { label: "Inputs", href: "/showcase#inputs", icon: IconForms },
      {
        label: "Selection",
        href: "/showcase#selection",
        icon: IconSquareCheck,
      },
    ],
  },
  {
    label: "Patterns",
    icon: IconLayout,
    children: [
      { label: "Tabs", href: "/showcase#tabs", icon: IconBrowser },
      { label: "Table", href: "/showcase#table", icon: IconTable },
      { label: "Cards", href: "/showcase#cards", icon: IconCards },
      {
        label: "Feedback",
        href: "/showcase#feedback",
        icon: IconAlertCircle,
      },
      { label: "Overlays", href: "/showcase#overlays", icon: IconStack2 },
      {
        label: "Navigation",
        href: "/showcase#navigation",
        icon: IconRoute,
      },
    ],
  },
];

function hrefPath(href: string) {
  const path = href.split("#")[0];
  return path && path.length > 0 ? path : href;
}

function isCurrent(href: string, pathname: string, hash: string) {
  const path = hrefPath(href);
  const fragment = href.split("#")[1];

  if (fragment) {
    return pathname === path && hash === `#${fragment}`;
  }

  return pathname === path || pathname.startsWith(`${path}/`);
}

function hasCurrentDescendant(
  item: NavItem,
  pathname: string,
  hash: string,
): boolean {
  return (item.children ?? []).some(
    (child) =>
      (child.href ? isCurrent(child.href, pathname, hash) : false) ||
      hasCurrentDescendant(child, pathname, hash),
  );
}

function normalizedHash(value: string) {
  if (value.length === 0) {
    return "";
  }

  return value.startsWith("#") ? value : `#${value}`;
}

export function SidebarNav({
  iconOnly,
  onNavigate,
}: {
  iconOnly: boolean;
  onNavigate: () => void;
}) {
  const pathname = usePathname();
  const [rawHash] = useHash();
  const hash = normalizedHash(rawHash);

  return (
    <Stack gap={4} align={iconOnly ? "center" : "stretch"}>
      {navigation.map((item) => (
        <SidebarNode
          key={item.label}
          item={item}
          iconOnly={iconOnly}
          pathname={pathname}
          hash={hash}
          onNavigate={onNavigate}
        />
      ))}
    </Stack>
  );
}

function SidebarNode({
  item,
  iconOnly,
  pathname,
  hash,
  onNavigate,
}: {
  item: NavItem;
  iconOnly: boolean;
  pathname: string;
  hash: string;
  onNavigate: () => void;
}) {
  const current = item.href ? isCurrent(item.href, pathname, hash) : false;
  const branchActive = hasCurrentDescendant(item, pathname, hash);
  const icon = <item.icon size={18} aria-hidden />;

  if (iconOnly) {
    if (!item.href) {
      return null;
    }

    return (
      <Tooltip label={item.label} position="right" openDelay={300}>
        <NavLink
          component={Link}
          href={item.href}
          aria-label={item.label}
          aria-current={current || branchActive ? "page" : undefined}
          active={current || branchActive}
          variant="subtle"
          leftSection={icon}
          onClick={onNavigate}
          w={40}
          h={40}
          p={0}
          styles={{
            root: { justifyContent: "center" },
            section: { marginInlineEnd: 0 },
            body: { display: "none" },
          }}
        />
      </Tooltip>
    );
  }

  if (item.children && item.children.length > 0) {
    return (
      <NavLink
        component="button"
        label={item.label}
        leftSection={icon}
        variant="subtle"
        childrenOffset={12}
        defaultOpened
        active={branchActive}
        noWrap
      >
        <Stack gap={2}>
          {item.children.map((child) => (
            <SidebarNode
              key={child.label}
              item={child}
              iconOnly={false}
              pathname={pathname}
              hash={hash}
              onNavigate={onNavigate}
            />
          ))}
        </Stack>
      </NavLink>
    );
  }

  if (!item.href) {
    return null;
  }

  return (
    <NavLink
      component={Link}
      href={item.href}
      label={item.label}
      leftSection={icon}
      variant="subtle"
      active={current}
      aria-current={current ? "page" : undefined}
      onClick={onNavigate}
      noWrap
    />
  );
}
