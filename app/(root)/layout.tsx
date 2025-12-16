import { cookies } from "next/headers";
import React from "react";

import { AppSidebar } from "@/app/(root)/_components/AppSidebar";
import { AppSiteHeader } from "@/app/(root)/_components/AppSiteHeader";
import { SidebarProvider } from "@/components/ui/sidebar";

interface Props {
  children: React.ReactNode;
}
const RootLayout = async ({ children }: Props) => {
  const cookieStore = await cookies();
  const isSidebarOpen =
    !cookieStore.get("sidebar_state") ||
    cookieStore.get("sidebar_state")?.value === "true";

  return (
    <SidebarProvider defaultOpen={isSidebarOpen}>
      <AppSidebar />
      <main className="w-full">
        <AppSiteHeader />
        {children}
      </main>
    </SidebarProvider>
  );
};

export default RootLayout;
