import "next-auth";

import { type DefaultSession } from "next-auth";
import { type DefaultJWT } from "next-auth/jwt";
import z from "zod";

import { homesSchema } from "@/schemas";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      homeId?: z.infer<typeof homesSchema>["id"];
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    homeId?: z.infer<typeof homesSchema>["id"];
  }
}
