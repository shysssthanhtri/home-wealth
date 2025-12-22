"use client";

import Link from "next/link";
import React from "react";

import {
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

interface Props {
  href: string;
  icon: React.ReactNode;
  label: string;
}
export const NavLink = ({ label, icon, href }: Props) => {
  const { isMobile, setOpenMobile } = useSidebar();
  return (
    <SidebarMenuItem
      onClick={() => {
        if (isMobile) {
          setOpenMobile(false);
        }
      }}
    >
      <SidebarMenuButton asChild>
        <Link href={href}>
          {icon}
          {label}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};
