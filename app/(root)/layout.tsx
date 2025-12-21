import { redirect } from "next/navigation";
import React from "react";

import { getCurrentUserId } from "@/auth";
import { ROUTES } from "@/constants/routes";
import { prisma } from "@/lib/prisma";

interface Props {
  children: React.ReactNode;
}
const RootLayout = async ({ children }: Props) => {
  const userId = await getCurrentUserId();
  const relation = await prisma.homes_users.findFirst({
    where: {
      userId,
    },
  });
  if (!relation) {
    redirect(ROUTES.COMING_HOME);
  }

  return <>{children}</>;
};

export default RootLayout;
