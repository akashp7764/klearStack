// components/header/nav-data.ts
// Typed navigation configuration — no hardcoded labels in JSX

export type NavItemType = "link" | "dropdown" | "mega";

export interface DropdownItem {
  label: string;
  href: string;
  description?: string;
  icon?: boolean; // uses brand checkmark icon
}

export interface MegaMenuColumn {
  title?: string;
  titleHref?: string;
  isHeader?: boolean; // renders as a prominent linked heading
  items: DropdownItem[];
}

export interface NavItem {
  label: string;
  href: string;
  type: NavItemType;
  dropdown?: DropdownItem[];
  megaColumns?: MegaMenuColumn[];
  isActive?: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  {
    label: "Product",
    href: "#",
    type: "dropdown",
    dropdown: [
      { label: "Overview", href: "#" },
      { label: "How it Works", href: "#" },
      { label: "Pricing", href: "#" },
    ],
  },
  {
    label: "Solutions",
    href: "#",
    type: "mega",
    isActive: true,
    megaColumns: [
      {
        items: [
          { label: "Capabilities", href: "#", icon: true },
          { label: "Features", href: "#", icon: true },
          { label: "Integration", href: "#", icon: true },
          { label: "Document Types", href: "#", icon: true },
        ],
      },
      {
        title: "Data Processing",
        titleHref: "#",
        isHeader: true,
        items: [
          { label: "Data Extraction", href: "#" },
          { label: "Data Interpretation", href: "#" },
          { label: "Straight Through Processing (STP)", href: "#" },
        ],
      },
    ],
  },
  {
    label: "Industries",
    href: "#",
    type: "dropdown",
    dropdown: [
      { label: "BFSI", href: "#" },
      { label: "Healthcare", href: "#" },
      { label: "Telecom", href: "#" },
      { label: "Manufacturing", href: "#" },
    ],
  },
  {
    label: "Pricing",
    href: "#",
    type: "link",
  },
  {
    label: "Resources",
    href: "#",
    type: "dropdown",
    dropdown: [
      { label: "Blog", href: "#" },
      { label: "Guides", href: "#" },
      { label: "Newsroom", href: "#" },
      { label: "API Documentation", href: "#" },
      { label: "Product Documentation", href: "#" },
    ],
  },
  {
    label: "Company",
    href: "#",
    type: "dropdown",
    dropdown: [
      { label: "About", href: "#" },
      { label: "Contact", href: "#" },
      { label: "Careers", href: "#" },
    ],
  },
];

export const CTA_PRIMARY = { label: "Get Free Demo", href: "#contact" };
export const CTA_SECONDARY = { label: "Try it for Free", href: "#contact" };

export const HEADER_HEIGHT = 68; // px — used for sticky offset reservation
