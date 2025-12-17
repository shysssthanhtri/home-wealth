"use server";

import z from "zod";

import { getCurrentUserId } from "@/auth";
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

  console.log("createdHome: ", createdHome);

  return createdHome;
};
