import { NextResponse } from "next/server";
import type { NextRequest } from "next/request";

export function middleware(req: NextRequest) {
  // Client-side authentication checks are preferred in this architecture
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};