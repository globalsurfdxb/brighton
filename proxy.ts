import { NextResponse, type NextRequest } from "next/server";
import * as jose from "jose";
import { jwtSecret } from "@/lib/jwtSecret";

const ADMIN_BASE = "/4dm1n-br1ght0n";
const LOGIN_PATH = `${ADMIN_BASE}/login`;

async function hasValidToken(request: NextRequest) {
  const token = request.cookies.get("adminToken")?.value;
  if (!token) return false;
  try {
    await jose.jwtVerify(token, jwtSecret());
    return true;
  } catch {
    return false;
  }
}

export async function proxy(request: NextRequest) {
  const isLoginPage = request.nextUrl.pathname === LOGIN_PATH;
  const isAuthenticated = await hasValidToken(request);

  if (isLoginPage && isAuthenticated) {
    return NextResponse.redirect(new URL(ADMIN_BASE, request.url));
  }

  if (!isLoginPage && !isAuthenticated) {
    return NextResponse.redirect(new URL(LOGIN_PATH, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/4dm1n-br1ght0n/:path*"],
};
