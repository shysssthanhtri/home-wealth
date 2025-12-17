import { redirect } from "next/navigation";
import React from "react";

import { getCurrentUser } from "@/auth";
import { ROUTES } from "@/constants/routes";
import { prisma } from "@/lib/prisma";

interface Props {
  children: React.ReactNode;
}
const RootLayout = async ({ children }: Props) => {
  const user = await getCurrentUser();
  const relation = await prisma.homes_users.findFirst({
    where: {
      userId: user.id,
    },
  });
  if (!relation) {
    redirect(ROUTES.HOMELESS);
  }

  return <>{children}</>;
};

export default RootLayout;
