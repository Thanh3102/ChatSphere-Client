import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  console.log(">>> middleware running...");
}

export const config = {
  matcher: "/profile/:path*",
};
