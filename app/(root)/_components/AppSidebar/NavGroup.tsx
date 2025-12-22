import React from "react";

import { NavLink } from "@/app/(root)/_components/AppSidebar/NavLink";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
} from "@/components/ui/sidebar";

interface Props {
  label: string;
  items: { label: string; icon: React.ElementType; href: string }[];
}
export const NavGroup = ({ label, items }: Props) => {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <NavLink
            key={item.label}
            label={item.label}
            href={item.href}
            icon={<item.icon />}
          />
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
};
