import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { ROUTES } from "@/constants/routes";

const authRoutes = [ROUTES.LOGIN];

export default auth(async (request) => {
  const path = request.nextUrl.pathname;
  const isSignedIn = !!request.auth?.user;

  if (isSignedIn && authRoutes.some((route) => path.startsWith(route))) {
    return NextResponse.redirect(new URL(ROUTES.HOME, request.url));
  }

  if (!isSignedIn && !path.startsWith(ROUTES.LOGIN)) {
    return NextResponse.redirect(new URL(ROUTES.LOGIN, request.url));
  }
});

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: ["/((?!api|_next/static|images|_next/image|favicon.ico).*)"],
};
