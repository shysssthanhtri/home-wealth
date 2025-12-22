import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

import { AppSidebar } from "@/app/(root)/_components/AppSidebar";
import { AppSiteHeader } from "@/app/(root)/_components/AppSiteHeader";
import { getCurrentUserId } from "@/auth";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { ROUTES } from "@/constants/routes";
import { prisma } from "@/lib/prisma";

interface Props {
  children: React.ReactNode;
}
const RootLayout = async ({ children }: Props) => {
  const cookieStore = await cookies();
  const isSidebarOpen =
    !cookieStore.get("sidebar_state") ||
    cookieStore.get("sidebar_state")?.value === "true";

  const userId = await getCurrentUserId();
  const relation = await prisma.homes_users.findFirst({
    where: {
      userId,
    },
  });
  if (!relation) {
    redirect(ROUTES.COMING_HOME);
  }

  return (
    <SidebarProvider defaultOpen={isSidebarOpen}>
      <AppSidebar />
      <main className="w-full">
        <AppSiteHeader />
        <SidebarInset className="bg-zinc-50 dark:bg-black min-h-[calc(100vh-var(--spacing)*16)] transition-[width,height] group-has-data-[collapsible=icon]/sidebar-wrapper:min-h-[calc(100vh-var(--spacing)*12)] p-4">
          {children}
        </SidebarInset>
      </main>
    </SidebarProvider>
  );
};

export default RootLayout;
