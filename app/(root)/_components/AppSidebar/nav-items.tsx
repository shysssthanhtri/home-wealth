import { IconCategory, IconDashboard, IconInvoice } from "@tabler/icons-react";
import { HomeIcon, Settings2Icon } from "lucide-react";
import { ReceiptIcon, UsersIcon } from "lucide-react";

import { ROUTES } from "@/constants/routes";

export interface NavItem {
  label: string;
  icon: React.ElementType;
  href: string;
}

export const NavHomeItems = [
  {
    label: "Dashboard",
    icon: IconDashboard,
    href: ROUTES.DASHBOARD,
  },
  {
    label: "Expenses",
    icon: IconInvoice,
    href: ROUTES.EXPENSES,
  },
  {
    label: "Categories",
    icon: IconCategory,
    href: ROUTES.CATEGORIES,
  },
  {
    label: "Receipts",
    icon: ReceiptIcon,
    href: ROUTES.RECEIPTS,
  },
  {
    label: "Members",
    icon: UsersIcon,
    href: ROUTES.MEMBERS,
  },
] satisfies NavItem[];

export const NavPersonalItems = [
  {
    label: "Homes",
    icon: HomeIcon,
    href: ROUTES.HOMES,
  },
  {
    label: "Setting",
    icon: Settings2Icon,
    href: ROUTES.PERSONAL_SETTING,
  },
] satisfies NavItem[];
