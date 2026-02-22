import type { Metadata } from "next";

import { auth } from "@/auth";

export const metadata: Metadata = {
  title: "Dashboard - Home Wealth",
  description: "Your family finance dashboard",
};

export default async function DashboardPage() {
  const session = await auth();

  return (
    <div className="flex min-h-svh items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold">
          Welcome, {session?.user?.name ?? "User"}!
        </h1>
        <p className="text-muted-foreground mt-2">
          Your dashboard is coming soon.
        </p>
      </div>
    </div>
  );
}
