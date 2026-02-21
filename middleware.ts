import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Middleware para Next.js.
 * Las verificaciones de autenticación se realizan en el lado del cliente
 * para mantener la compatibilidad con la arquitectura de Firebase Studio.
 */
export function middleware(req: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
