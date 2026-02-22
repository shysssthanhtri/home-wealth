import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { prisma } from "@/lib/prisma";

const authRoutes = ["/login", "/signup"];
const publicRoutes = [...authRoutes];

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user?.password) return null;

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.password,
        );

        if (!isValid) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    authorized({ auth: session, request: { nextUrl } }) {
      const isLoggedIn = !!session?.user;
      const pathname = nextUrl.pathname;

      // Skip static assets and API routes
      if (
        pathname.startsWith("/api/auth") ||
        pathname.startsWith("/_next") ||
        /\.(?:css|js|json|ico|png|jpg|jpeg|gif|svg|webp|woff2?)$/.test(pathname)
      ) {
        return true;
      }

      // Authenticated user visiting auth pages → redirect to dashboard
      if (isLoggedIn && authRoutes.includes(pathname)) {
        return Response.redirect(new URL("/dashboard", nextUrl));
      }

      // Unauthenticated user visiting protected pages → redirect to login
      if (!isLoggedIn && !publicRoutes.includes(pathname)) {
        return Response.redirect(new URL("/login", nextUrl));
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
});
