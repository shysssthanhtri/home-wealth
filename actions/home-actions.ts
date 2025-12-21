"use server";

import z from "zod";

import { getCurrentUserId, update } from "@/auth";
import { prisma } from "@/lib/prisma";
import { homesSchema } from "@/schemas";

export const createHome = async (
  home: Pick<z.infer<typeof homesSchema>, "name">,
) => {
  const userId = await getCurrentUserId();

  const createdHome = await prisma.homes.create({
    data: {
      name: home.name,
      homesUsers: {
        create: {
          userId: userId,
        },
      },
    },
  });

  await loginHome(createdHome.id);

  return createdHome;
};

export const loginHome = async (homeId: z.infer<typeof homesSchema>["id"]) => {
  await update({ user: { homeId } });
};
