import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

const protectedRoutes = [
  "/dashboard",
  "/profile",
  "/place-ad",
  "/properties/edit",
];

export const middleware = (request: NextRequest) => {
  const token = request.cookies.get("token")?.value;
  const isProtected = protectedRoutes.some((r) =>
    request.nextUrl.pathname.startsWith(r),
  );

  if (isProtected && !token)
    return NextResponse.redirect(new URL("/login", request.url));

  return NextResponse.next();
};

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/place-ad",
    "/place-ad/:path*",
    "/properties/edit/:path*",
  ],
};
