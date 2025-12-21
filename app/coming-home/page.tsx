import React from "react";

import { CreateHome } from "@/app/coming-home/_components/CreateHome";
import { HomeSelect } from "@/app/coming-home/_components/HomeSelect";
import { getCurrentUserId } from "@/auth";
import { Card, CardContent } from "@/components/ui/card";
import { FieldSeparator } from "@/components/ui/field";
import { prisma } from "@/lib/prisma";

const ComingHomePage = async () => {
  const userId = await getCurrentUserId();
  const homes = await prisma.homes.findMany({
    where: { homesUsers: { some: { userId } } },
  });

  return (
    <main className="flex items-center justify-center mx-4 sm:mx-16">
      <Card className="max-w-5xl w-full">
        <CardContent className="flex gap-8 flex-col sm:flex-row">
          {!!homes.length && <HomeSelect homes={homes} />}
          <FieldSeparator childrenClassname="bg-card sm:hidden">
            Or
          </FieldSeparator>
          <CreateHome />
        </CardContent>
      </Card>
    </main>
  );
};

export default ComingHomePage;
