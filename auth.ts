import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { redirect } from "next/navigation";
import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

import { ROUTES } from "@/constants/routes";
import { mongoClient } from "@/lib/mongo";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: MongoDBAdapter(mongoClient),
  providers: [GitHub, Google],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    session: ({ session, token }) => {
      session.user.id = token.sub ?? "";
      return session;
    },
  },
});

export const getCurrentUser = async () => {
  const session = await auth();
  const user = session?.user;
  if (!user) {
    return redirect(ROUTES.LOGIN);
  }
  return user;
};

export const getCurrentUserId = async () => {
  const session = await auth();
  const user = session?.user;
  if (!user || !user.id) {
    return redirect(ROUTES.LOGIN);
  }
  return user.id;
};
