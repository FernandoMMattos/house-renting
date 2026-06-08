import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export const middleware = (request: NextRequest) => {
  if (!request.cookies.get("token")?.value)
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
